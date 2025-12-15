import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createWorker, Worker, OEM, PSM } from 'tesseract.js';
import { FraudCheckService } from '../fraudcheck/fraudcheck.service';

export interface OcrResult {
  text: string;
  confidence: number;
  language: string;
  processingTime: number;
  version: string;
  fraudIndicators?: string[];
}

export interface ReceiptItem {
  name: string;
  quantity?: number;
  price: number;
  total: number;
}

export interface ReceiptData {
  merchant?: string;
  date?: Date;
  totalAmount: number;
  taxAmount?: number;
  items: ReceiptItem[];
  currency: string;
  rawText: string;
  confidence: number;
  fraudScore?: number;
  fraudIndicators?: string[];
  isValid: boolean;
}

export interface UpiScreenshotData {
  amount: number;
  upiId: string;
  transactionId?: string;
  date?: Date;
  status: 'success' | 'failed' | 'pending';
  bank?: string;
  rawText: string;
  confidence: number;
  fraudScore: number;
  fraudIndicators: string[];
  isSuspicious: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  suggestedAction: 'auto_verify' | 'manual_review' | 'require_additional_proof' | 'reject';
  upiApp?: 'google_pay' | 'phonepe' | 'paytm' | 'bhim' | 'other';
}

export interface OcrOptions {
  language?: string;
  whitelist?: string;
  blacklist?: string;
  psm?: PSM;
  oem?: OEM;
  checkFraud?: boolean;
}

@Injectable()
export class OcrService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OcrService.name);
  private worker: Worker | null = null;
  private isInitialized = false;
  private readonly defaultLanguages = ['eng'];

  constructor(
    private configService: ConfigService,
    private fraudCheckService: FraudCheckService,
  ) {}

  async onModuleInit() {
    await this.initializeWorker();
  }

  async onModuleDestroy() {
    await this.terminateWorker();
  }

  // ========== CORE OCR METHODS ==========

  /**
   * Extract text from image
   */
  async extractTextFromImage(
    imageBuffer: Buffer,
    options: OcrOptions = {},
    userId?: string,
  ): Promise<OcrResult> {
    await this.ensureWorkerInitialized();

    const startTime = Date.now();

    try {
      // Apply OCR options
      if (options.language && options.language !== 'eng') {
        await this.worker!.reinitialize(options.language);
      }

      if (options.whitelist) {
        await this.worker!.setParameters({
          tessedit_char_whitelist: options.whitelist,
        });
      }

      if (options.psm) {
        await this.worker!.setParameters({
          tessedit_pageseg_mode: options.psm,
        });
      }

      // Perform OCR
      const result = await this.worker!.recognize(imageBuffer);
      const processingTime = Date.now() - startTime;

      // Check for fraud if enabled
      let fraudIndicators: string[] = [];
      if (options.checkFraud) {
        fraudIndicators = this.checkTextForFraudIndicators(result.data.text);
      }

      this.logger.debug(`OCR completed in ${processingTime}ms, confidence: ${result.data.confidence}`);

      return {
        text: result.data.text,
        confidence: result.data.confidence,
        language: options.language || 'eng',
        processingTime,
        version: '5.x.x', // Tesseract.version might not be available
        fraudIndicators,
      };
    } catch (error) {
      this.logger.error('OCR extraction failed:', error);
      throw new Error(`OCR extraction failed: ${error.message}`);
    } finally {
      // Reset to default settings if we changed language
      if (options.language && options.language !== 'eng') {
        await this.worker!.reinitialize('eng');
      }
    }
  }

  /**
   * Process UPI payment screenshot
   */
  async processUpiScreenshot(
    imageBuffer: Buffer,
    expectedData?: { amount?: number; upiId?: string },
    userId?: string,
  ): Promise<UpiScreenshotData> {
    const startTime = Date.now();
    
    // Extract text with UPI-optimized settings
    const ocrResult = await this.extractTextFromImage(imageBuffer, {
      whitelist: '0123456789₹@.ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:-/ ',
      psm: PSM.SPARSE_TEXT,
      checkFraud: true,
    }, userId);

    // Parse UPI data
    const extractedData = this.parseUpiScreenshotText(ocrResult.text);
    
    // Calculate fraud score
    const fraudAnalysis = this.analyzeUpiScreenshot(
      ocrResult.text,
      extractedData,
      expectedData,
    );

    const processingTime = Date.now() - startTime;
    
    this.logger.log(`UPI screenshot processed in ${processingTime}ms, Amount: ₹${extractedData.amount}, Fraud Score: ${fraudAnalysis.fraudScore}`);

    return {
      ...extractedData,
      rawText: ocrResult.text,
      confidence: ocrResult.confidence,
      ...fraudAnalysis,
    };
  }

  /**
   * Process restaurant receipt
   */
  async processReceipt(
    imageBuffer: Buffer,
    userId?: string,
  ): Promise<ReceiptData> {
    const startTime = Date.now();
    
    // First pass: Get all text
    const ocrResult = await this.extractTextFromImage(imageBuffer, {
      language: 'eng',
      checkFraud: true,
    }, userId);

    // Parse receipt data
    const receiptData = this.parseReceiptText(ocrResult.text);
    
    // Validate receipt
    const validation = this.validateReceipt(receiptData);
    
    const processingTime = Date.now() - startTime;

    this.logger.log(`Receipt processed in ${processingTime}ms, Total: ₹${receiptData.totalAmount}, Valid: ${validation.isValid}`);

    return {
      ...receiptData,
      rawText: ocrResult.text,
      confidence: ocrResult.confidence,
      fraudIndicators: validation.fraudIndicators,
      fraudScore: validation.fraudScore,
      isValid: validation.isValid,
    };
  }

  /**
   * Process base64 image
   */
  async processBase64Image(
    base64Image: string,
    type: 'upi' | 'receipt',
    expectedData?: { amount?: number; upiId?: string },
    userId?: string,
  ): Promise<UpiScreenshotData | ReceiptData> {
    const base64Data = base64Image.includes('base64,')
      ? base64Image.split('base64,')[1]
      : base64Image;

    const imageBuffer = Buffer.from(base64Data, 'base64');

    if (type === 'upi') {
      return this.processUpiScreenshot(imageBuffer, expectedData, userId);
    } else {
      return this.processReceipt(imageBuffer, userId);
    }
  }

  // ========== PARSING METHODS ==========

  private parseUpiScreenshotText(text: string): {
    amount: number;
    upiId: string;
    transactionId?: string;
    date?: Date;
    status: 'success' | 'failed' | 'pending';
    bank?: string;
    upiApp?: 'google_pay' | 'phonepe' | 'paytm' | 'bhim' | 'other';
  } {
    const normalizedText = text.toLowerCase();
    
    // Extract amount (find largest number that looks like an amount)
    const amountMatches = [...text.matchAll(/(?:₹|rs|inr|amount)[\s:]*([\d,]+\.?\d*)/gi)];
    let amount = 0;
    
    for (const match of amountMatches) {
      const matchAmount = parseFloat(match[1].replace(/,/g, ''));
      if (matchAmount > amount) {
        amount = matchAmount;
      }
    }

    // Extract UPI ID
    const upiMatches = [...text.matchAll(/([\w.\-_]+@[\w.]+)/gi)];
    const upiId = upiMatches[0]?.[1] || '';

    // Extract transaction ID
    const txnMatches = [...text.matchAll(/(?:ref|id|transaction|txn)[\s#:]*([A-Z0-9]{8,})/gi)];
    const transactionId = txnMatches[0]?.[1];

    // Extract date and time
    const dateMatch = text.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/);
    const timeMatch = text.match(/(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[ap]m)?)/gi);
    let date: Date | undefined;
    
    if (dateMatch && timeMatch) {
      try {
        date = new Date(`${dateMatch[1]} ${timeMatch[0]}`);
      } catch {
        date = new Date();
      }
    }

    // Determine status
    let status: 'success' | 'failed' | 'pending' = 'pending';
    if (normalizedText.includes('success') || normalizedText.includes('completed') || normalizedText.includes('paid')) {
      status = 'success';
    } else if (normalizedText.includes('failed') || normalizedText.includes('rejected') || normalizedText.includes('cancelled')) {
      status = 'failed';
    }

    // Determine bank
    const bankMatch = normalizedText.match(/(axis|hdfc|icici|sbi|yes|kotak|union)/i);
    const bank = bankMatch?.[1]?.toUpperCase();

    // Determine UPI app
    let upiApp: 'google_pay' | 'phonepe' | 'paytm' | 'bhim' | 'other' = 'other';
    if (normalizedText.includes('google pay')) upiApp = 'google_pay';
    else if (normalizedText.includes('phonepe')) upiApp = 'phonepe';
    else if (normalizedText.includes('paytm')) upiApp = 'paytm';
    else if (normalizedText.includes('bhim')) upiApp = 'bhim';

    return {
      amount,
      upiId,
      transactionId,
      date,
      status,
      bank,
      upiApp,
    };
  }

  private parseReceiptText(text: string): {
    merchant?: string;
    date?: Date;
    totalAmount: number;
    taxAmount?: number;
    items: ReceiptItem[];
    currency: string;
  } {
    const lines = text.split('\n').filter(line => line.trim());
    
    let merchant = '';
    let date: Date | undefined;
    let totalAmount = 0;
    let taxAmount = 0;
    const items: ReceiptItem[] = [];
    const currency = '₹';

    // Patterns
    const patterns = {
      merchant: /^(?:.*?RESTAURANT|CAFE|HOTEL|STORE|MART)/i,
      date: /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})|(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/,
      total: /(?:TOTAL|GRAND TOTAL|AMOUNT|FINAL)[\s:]*[₹]?\s*(\d+(?:\.\d{2})?)/i,
      tax: /(?:GST|TAX|VAT)[\s:]*[₹]?\s*(\d+(?:\.\d{2})?)/i,
      item: /^(.+?)\s+(\d+)?\s*[xX]?\s*[₹]?\s*(\d+(?:\.\d{2})?)\s*[₹]?\s*(\d+(?:\.\d{2})?)$/,
      simpleItem: /^(.+?)\s+[₹]?\s*(\d+(?:\.\d{2})?)$/,
    };

    for (const line of lines) {
      // Merchant
      if (!merchant && patterns.merchant.test(line)) {
        merchant = line;
      }

      // Date
      const dateMatch = line.match(patterns.date);
      if (dateMatch && !date) {
        try {
          date = new Date(dateMatch[1] || dateMatch[2]);
        } catch {}
      }

      // Total
      const totalMatch = line.match(patterns.total);
      if (totalMatch && totalAmount === 0) {
        totalAmount = parseFloat(totalMatch[1].replace(/,/g, ''));
      }

      // Tax
      const taxMatch = line.match(patterns.tax);
      if (taxMatch) {
        taxAmount = parseFloat(taxMatch[1].replace(/,/g, ''));
      }

      // Items
      const itemMatch = line.match(patterns.item);
      if (itemMatch) {
        const [, name, quantity, price, total] = itemMatch;
        items.push({
          name: name.trim(),
          quantity: quantity ? parseInt(quantity, 10) : 1,
          price: parseFloat(price),
          total: parseFloat(total),
        });
        continue;
      }

      // Simple items
      const simpleItemMatch = line.match(patterns.simpleItem);
      if (simpleItemMatch && !patterns.total.test(line) && !patterns.tax.test(line)) {
        const [, name, price] = simpleItemMatch;
        const priceNum = parseFloat(price);
        if (priceNum > 0 && priceNum < 10000) {
          items.push({
            name: name.trim(),
            quantity: 1,
            price: priceNum,
            total: priceNum,
          });
        }
      }
    }

    // Calculate total from items if not found
    if (totalAmount === 0 && items.length > 0) {
      totalAmount = items.reduce((sum, item) => sum + item.total, 0);
    }

    return { merchant, date, totalAmount, taxAmount, items, currency };
  }

  // ========== FRAUD DETECTION METHODS ==========

  private analyzeUpiScreenshot(
    text: string,
    extractedData: any,
    expectedData?: { amount?: number; upiId?: string },
  ): {
    fraudScore: number;
    fraudIndicators: string[];
    isSuspicious: boolean;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    suggestedAction: 'auto_verify' | 'manual_review' | 'require_additional_proof' | 'reject';
  } {
    const fraudIndicators: string[] = [];
    let fraudScore = 0;

    // 1. Check expected vs extracted
    if (expectedData) {
      // Amount check
      if (expectedData.amount && Math.abs(extractedData.amount - expectedData.amount) > 0.01) {
        const diff = Math.abs(extractedData.amount - expectedData.amount);
        const percentDiff = (diff / expectedData.amount) * 100;
        
        if (percentDiff > 10) {
          fraudScore += 40;
          fraudIndicators.push('CRITICAL_AMOUNT_MISMATCH');
        } else if (percentDiff > 5) {
          fraudScore += 25;
          fraudIndicators.push('SIGNIFICANT_AMOUNT_MISMATCH');
        } else if (percentDiff > 1) {
          fraudScore += 10;
          fraudIndicators.push('MINOR_AMOUNT_MISMATCH');
        }
      }

      // UPI ID check
      if (expectedData.upiId && extractedData.upiId.toLowerCase() !== expectedData.upiId.toLowerCase()) {
        fraudScore += 50;
        fraudIndicators.push('UPI_ID_MISMATCH');
      }
    }

    // 2. Check text patterns
    if (!this.containsUpiPatterns(text)) {
      fraudScore += 20;
      fraudIndicators.push('MISSING_UPI_PATTERNS');
    }

    // 3. Check for suspicious transaction ID
    if (this.isSuspiciousTransactionId(text)) {
      fraudScore += 30;
      fraudIndicators.push('SUSPICIOUS_TRANSACTION_ID');
    }

    // 4. Check for success indicators
    const successIndicators = ['success', 'completed', 'paid', 'credited'];
    const hasSuccess = successIndicators.some(indicator => text.toLowerCase().includes(indicator));
    if (!hasSuccess) {
      fraudScore += 15;
      fraudIndicators.push('MISSING_SUCCESS_INDICATOR');
    }

    // 5. Check for edited text patterns
    if (this.hasEditedTextPatterns(text)) {
      fraudScore += 25;
      fraudIndicators.push('POSSIBLE_EDITING');
    }

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let suggestedAction: 'auto_verify' | 'manual_review' | 'require_additional_proof' | 'reject' = 'auto_verify';

    if (fraudScore >= 70) {
      riskLevel = 'critical';
      suggestedAction = 'reject';
    } else if (fraudScore >= 50) {
      riskLevel = 'high';
      suggestedAction = 'manual_review';
    } else if (fraudScore >= 30) {
      riskLevel = 'medium';
      suggestedAction = 'require_additional_proof';
    } else {
      riskLevel = 'low';
      suggestedAction = 'auto_verify';
    }

    const isSuspicious = fraudScore >= 30;

    return {
      fraudScore: Math.min(fraudScore, 100),
      fraudIndicators,
      isSuspicious,
      riskLevel,
      suggestedAction,
    };
  }

  private validateReceipt(receipt: any): {
    isValid: boolean;
    fraudScore: number;
    fraudIndicators: string[];
  } {
    const fraudIndicators: string[] = [];
    let fraudScore = 0;

    // 1. Check total matches items
    const itemsTotal = receipt.items.reduce((sum: number, item: ReceiptItem) => sum + item.total, 0);
    const totalDiff = Math.abs(receipt.totalAmount - itemsTotal);
    
    if (totalDiff > 0.01) {
      const percentDiff = (totalDiff / receipt.totalAmount) * 100;
      if (percentDiff > 10) {
        fraudScore += 40;
        fraudIndicators.push('SIGNIFICANT_TOTAL_MISMATCH');
      } else if (percentDiff > 1) {
        fraudScore += 20;
        fraudIndicators.push('TOTAL_MISMATCH');
      }
    }

    // 2. Check for duplicate items
    const itemNames = receipt.items.map((item: ReceiptItem) => item.name.toLowerCase());
    const uniqueItems = new Set(itemNames);
    if (itemNames.length !== uniqueItems.size) {
      fraudScore += 15;
      fraudIndicators.push('POSSIBLE_DUPLICATE_ITEMS');
    }

    // 3. Check for suspicious prices
    const suspiciousItems = receipt.items.filter((item: ReceiptItem) => 
      item.price <= 0 || item.price > 10000 || item.total <= 0 || item.total > 10000
    );
    if (suspiciousItems.length > 0) {
      fraudScore += 20;
      fraudIndicators.push('SUSPICIOUS_ITEM_PRICES');
    }

    // 4. Check tax calculation
    if (receipt.taxAmount) {
      const expectedTax = receipt.totalAmount * 0.18; // Assume 18% GST
      const taxDiff = Math.abs(receipt.taxAmount - expectedTax);
      if (taxDiff > receipt.totalAmount * 0.05) { // 5% tolerance
        fraudScore += 10;
        fraudIndicators.push('UNUSUAL_TAX_AMOUNT');
      }
    }

    const isValid = fraudScore < 30;

    return {
      isValid,
      fraudScore: Math.min(fraudScore, 100),
      fraudIndicators,
    };
  }

  private checkTextForFraudIndicators(text: string): string[] {
    const indicators: string[] = [];
    
    // Common fraud patterns
    const patterns = {
      edited: /(?:edited|modified|changed|altered)/i,
      fake: /(?:fake|dummy|test|sample)/i,
      suspiciousAmount: /(?:₹|rs|inr)[\s]*([0-9]{6,})/i, // Very large amounts
      unusualFormat: /[0-9]{20,}/, // Very long numbers
      htmlTags: /<[^>]+>/i, // HTML tags in text
    };

    Object.entries(patterns).forEach(([type, pattern]) => {
      if (pattern.test(text)) {
        indicators.push(`SUSPICIOUS_${type.toUpperCase()}`);
      }
    });

    return indicators;
  }

  private containsUpiPatterns(text: string): boolean {
    const upiPatterns = [
      /payment/i,
      /amount.*₹?\s*\d+/i,
      /to:?\s*[\w.@]+/i,
      /(?:ref|id|transaction|txn)/i,
      /\d{1,2}[\/\-]\d{1,2}/,
      /(?:upi|bank)/i,
    ];

    const matches = upiPatterns.filter(pattern => pattern.test(text.toLowerCase()));
    return matches.length >= 4;
  }

  private isSuspiciousTransactionId(text: string): boolean {
    const txnIdMatch = text.match(/(?:ref|id|transaction|txn)[\s#:]*([A-Z0-9]{6,})/i);
    if (!txnIdMatch) return false;

    const txnId = txnIdMatch[1];
    const suspiciousPatterns = [
      /^TEST/i,
      /^SAMPLE/i,
      /^FAKE/i,
      /^DEMO/i,
      /^[0-9]{6}$/,
      /^[A-Z]{6}$/,
      /123456/,
      /abcdef/i,
    ];

    return suspiciousPatterns.some(pattern => pattern.test(txnId));
  }

  private hasEditedTextPatterns(text: string): boolean {
    // Patterns that suggest text editing
    const patterns = [
      /different\s+font/i,
      /misaligned\s+text/i,
      /uneven\s+spacing/i,
      /pixelated\s+text/i,
      /blurry\s+text/i,
      /color\s+mismatch/i,
    ];

    return patterns.some(pattern => pattern.test(text));
  }

  // ========== UTILITY METHODS ==========

  private async ensureWorkerInitialized(): Promise<void> {
    if (!this.isInitialized || !this.worker) {
      await this.initializeWorker();
    }
  }

 private async initializeWorker(): Promise<void> {
  try {
    this.logger.log('Initializing OCR worker...');
    
    // Simplified initialization for Tesseract.js v5
    this.worker = await createWorker('eng', OEM.LSTM_ONLY, {
      logger: (m) => this.logger.debug(`Tesseract: ${JSON.stringify(m)}`),
    });

    await this.worker.setParameters({
      tessedit_pageseg_mode: PSM.AUTO,
      preserve_interword_spaces: '1',
    });

    this.isInitialized = true;
    this.logger.log('OCR worker initialized successfully');
  } catch (error) {
    this.logger.error('Failed to initialize OCR worker:', error);
    throw error;
  }
}

  private async terminateWorker(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
      this.isInitialized = false;
      this.logger.log('OCR worker terminated');
    }
  }

  async healthCheck() {
    return {
      status: this.isInitialized ? 'healthy' : 'unhealthy',
      workerInitialized: this.isInitialized,
      version: '5.x.x',
      languages: this.defaultLanguages,
    };
  }
}