import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';

export interface UpiLinkData {
  amount: number;
  receiverUpiId: string;
  receiverName: string;
  note?: string;
  transactionId?: string;
  settlementId?: string;
}

export interface UpiLinkResponse {
  upiLink: string;
  qrCode?: string;
  transactionId: string;
  expiryTime?: Date;
}

export interface UpiVerificationResult {
  isValid: boolean;
  amountMatch: boolean;
  upiIdMatch: boolean;
  extractedAmount?: number;
  extractedUpiId?: string;
  transactionId?: string;
  timestamp?: Date;
  discrepancies?: string[];
  confidence: number; // 0-100
}

@Injectable()
export class UpiService {
  private readonly logger = new Logger(UpiService.name);
  private readonly UPI_PATTERNS = {
    amount: /(?:₹|rs|inr|amount:?\s*)([\d,]+\.?\d*)/gi,
    upiId: /([a-zA-Z0-9.\-_]+@[a-zA-Z]+(?:\.\w+)?)/gi,
    transactionId: /(?:ref|transaction|txn|id)[\s:]*([A-Z0-9]{8,})/gi,
    date: /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/g,
    time: /(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[ap]m)?)/gi,
    status: /(?:success|completed|paid|credited)/gi,
  };

  constructor(private configService: ConfigService) {}

  /**
   * Generate UPI payment deep link with all options
   */
  generatePaymentLink(data: UpiLinkData): UpiLinkResponse {
    const { amount, receiverUpiId, receiverName, note, transactionId } = data;
    
    // Validate inputs
    this.validateUpiInputs(amount, receiverUpiId);

    // Build UPI parameters
    const params = this.buildUpiParams({
      receiverUpiId,
      receiverName,
      amount,
      note: note || `Payment via TrustMate`,
      transactionId: transactionId || this.generateTransactionId(),
    });

    const upiLink = `upi://pay?${params.toString()}`;
    
    const response: UpiLinkResponse = {
      upiLink,
      transactionId: params.get('tid') || this.generateTransactionId(),
      expiryTime: this.getExpiryTime(),
    };

    // Optional: Generate QR code data URL
    if (this.configService.get('UPI_GENERATE_QR', true)) {
      response.qrCode = this.generateQRCodeDataUrl(upiLink);
    }

    this.logger.log(`Generated UPI link for transaction: ${response.transactionId}`);
    return response;
  }

  /**
   * Generate UPI link for specific settlement
   */
  generateSettlementLink(
    settlementId: string,
    amount: number,
    receiverUpiId: string,
    receiverName: string
  ): UpiLinkResponse {
    return this.generatePaymentLink({
      amount,
      receiverUpiId,
      receiverName,
      note: `Settlement ${settlementId}`,
      settlementId,
      transactionId: `SETTLE_${settlementId}_${Date.now()}`,
    });
  }

  /**
   * Verify payment from OCR text (from screenshot)
   */
  verifyPaymentFromText(
    ocrText: string,
    expectedAmount: number,
    expectedUpiId: string
  ): UpiVerificationResult {
    try {
      const extractedData = this.extractUpiData(ocrText);
      const verification = this.verifyExtractedData(extractedData, {
        amount: expectedAmount,
        upiId: expectedUpiId,
      });

      // Calculate confidence score
      const confidence = this.calculateConfidenceScore(verification, extractedData);

      return {
        ...verification,
        ...extractedData,
        confidence,
      };
    } catch (error) {
      this.logger.error('Payment verification failed:', error);
      return {
        isValid: false,
        amountMatch: false,
        upiIdMatch: false,
        confidence: 0,
        discrepancies: ['Failed to process verification'],
      };
    }
  }

  /**
   * Validate UPI ID format and check for common providers
   */
  validateUpiId(upiId: string): { isValid: boolean; provider?: string; issues?: string[] } {
    const issues: string[] = [];
    
    // Basic format check
    const upiRegex = /^[a-zA-Z0-9.\-_]+@[a-zA-Z]+(?:\.\w+)?$/;
    if (!upiRegex.test(upiId)) {
      issues.push('Invalid UPI ID format. Should be username@provider');
      return { isValid: false, issues };
    }

    // Check for common providers
    const providers = {
      'okaxis': 'Axis Bank',
      'okhdfcbank': 'HDFC Bank',
      'okicici': 'ICICI Bank',
      'oksbi': 'State Bank of India',
      'ybl': 'Yes Bank',
      'axl': 'Airtel Payments Bank',
      'paytm': 'Paytm Payments Bank',
    };

    const provider = Object.keys(providers).find(p => upiId.toLowerCase().includes(`@${p}`));
    
    if (!provider) {
      issues.push('Unrecognized UPI provider. Payment might fail.');
    }

    return {
      isValid: issues.length === 0,
      provider: provider ? providers[provider] : undefined,
      issues: issues.length > 0 ? issues : undefined,
    };
  }

  /**
   * Generate alternative UPI apps links
   */
  generateAppSpecificLinks(baseUpiLink: string): Record<string, string> {
    const apps = {
      googlePay: `tez://upi/pay?${baseUpiLink.split('?')[1]}`,
      phonePe: `phonepe://pay?${baseUpiLink.split('?')[1]}`,
      paytm: `paytmmp://pay?${baseUpiLink.split('?')[1]}`,
      bhim: `bhim://pay?${baseUpiLink.split('?')[1]}`,
    };

    return apps;
  }

  /**
   * Parse UPI callback URL (for webhook integration)
   */
  parseUpiCallback(url: string): {
    status: 'success' | 'failure' | 'pending';
    transactionId?: string;
    amount?: number;
    upiId?: string;
    rawData: Record<string, string>;
  } {
    const urlObj = new URL(url);
    const params = Object.fromEntries(urlObj.searchParams.entries());
    
    let status: 'success' | 'failure' | 'pending' = 'pending';
    if (params.status?.toLowerCase().includes('success')) status = 'success';
    if (params.status?.toLowerCase().includes('fail')) status = 'failure';

    return {
      status,
      transactionId: params.txnId || params.transactionId,
      amount: params.amount ? parseFloat(params.amount) : undefined,
      upiId: params.pa,
      rawData: params,
    };
  }

  // ========== PRIVATE METHODS ==========

  private validateUpiInputs(amount: number, upiId: string): void {
    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    if (amount > 100000) {
      throw new Error('Amount exceeds UPI limit (₹1,00,000)');
    }

    const validation = this.validateUpiId(upiId);
    if (!validation.isValid) {
      throw new Error(`Invalid UPI ID: ${validation.issues?.join(', ')}`);
    }
  }

  private buildUpiParams(data: {
    receiverUpiId: string;
    receiverName: string;
    amount: number;
    note: string;
    transactionId: string;
  }): URLSearchParams {
    const params = new URLSearchParams({
      pa: data.receiverUpiId,
      pn: data.receiverName,
      am: data.amount.toFixed(2),
      cu: 'INR',
      tn: data.note.substring(0, 50), // UPI limit
      tid: data.transactionId,
      tr: this.generateTransactionRef(),
    });

    // Optional app parameters
    params.append('url', this.configService.get('APP_URL', 'https://trustmate.ai'));
    params.append('mc', '5499'); // MCC for financial services

    return params;
  }

  private extractUpiData(text: string): {
    amount: number;
    upiId: string;
    transactionId: string;
    timestamp: Date;
  } {
    const normalizedText = text.toLowerCase();
    
    // Extract amount (find best match)
    const amountMatches = [...normalizedText.matchAll(this.UPI_PATTERNS.amount)];
    let bestAmount: number | null = null;
    
    for (const match of amountMatches) {
      const amount = parseFloat(match[1].replace(/,/g, ''));
      if (amount > 0 && (!bestAmount || amount > bestAmount)) {
        bestAmount = amount;
      }
    }

    if (!bestAmount) {
      throw new Error('No valid amount found in screenshot');
    }

    // Extract UPI ID
    const upiMatches = [...text.matchAll(this.UPI_PATTERNS.upiId)];
    const upiId = upiMatches[0]?.[1];
    
    if (!upiId) {
      throw new Error('No UPI ID found in screenshot');
    }

    // Extract transaction ID
    const txnMatches = [...text.matchAll(this.UPI_PATTERNS.transactionId)];
    const transactionId = txnMatches[0]?.[1] || `UNKNOWN_${Date.now()}`;

    // Extract timestamp
    const dateMatch = text.match(this.UPI_PATTERNS.date);
    const timeMatch = text.match(this.UPI_PATTERNS.time);
    let timestamp = new Date();
    
    if (dateMatch && timeMatch) {
      try {
        timestamp = new Date(`${dateMatch[1]} ${timeMatch[1]}`);
      } catch {
        // Use current time if parsing fails
      }
    }

    return {
      amount: bestAmount,
      upiId: upiId.toLowerCase(),
      transactionId,
      timestamp,
    };
  }

  private verifyExtractedData(
    extracted: { amount: number; upiId: string },
    expected: { amount: number; upiId: string }
  ): {
    isValid: boolean;
    amountMatch: boolean;
    upiIdMatch: boolean;
    discrepancies?: string[];
  } {
    const discrepancies: string[] = [];
    
    // Amount verification with tolerance
    const amountTolerance = expected.amount * 0.02; // 2% tolerance
    const amountDiff = Math.abs(extracted.amount - expected.amount);
    const amountMatch = amountDiff <= amountTolerance;
    
    if (!amountMatch) {
      discrepancies.push(
        `Amount mismatch: Expected ₹${expected.amount}, Found ₹${extracted.amount} (Difference: ₹${amountDiff.toFixed(2)})`
      );
    }

    // UPI ID verification (flexible for case and whitespace)
    const normalizeUpiId = (id: string) => id.toLowerCase().replace(/\s/g, '');
    const upiIdMatch = normalizeUpiId(extracted.upiId) === normalizeUpiId(expected.upiId);
    
    if (!upiIdMatch) {
      discrepancies.push(
        `UPI ID mismatch: Expected ${expected.upiId}, Found ${extracted.upiId}`
      );
    }

    // Additional checks
    if (extracted.amount <= 0) {
      discrepancies.push('Invalid amount extracted (zero or negative)');
    }

    if (!this.validateUpiId(extracted.upiId).isValid) {
      discrepancies.push('Extracted UPI ID appears invalid');
    }

    return {
      isValid: amountMatch && upiIdMatch && discrepancies.length === 0,
      amountMatch,
      upiIdMatch,
      discrepancies: discrepancies.length > 0 ? discrepancies : undefined,
    };
  }

  private calculateConfidenceScore(
    verification: { amountMatch: boolean; upiIdMatch: boolean },
    extracted: { transactionId?: string }
  ): number {
    let score = 0;
    
    if (verification.amountMatch) score += 40;
    if (verification.upiIdMatch) score += 40;
    if (extracted.transactionId && extracted.transactionId !== 'UNKNOWN') score += 20;
    
    return Math.min(score, 100);
  }

  private generateTransactionId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `TRUST_${timestamp}_${random}`.toUpperCase();
  }

  private generateTransactionRef(): string {
    return createHash('sha256')
      .update(Date.now().toString() + Math.random().toString())
      .digest('hex')
      .substring(0, 16)
      .toUpperCase();
  }

  private getExpiryTime(): Date {
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 24); // 24 hours expiry
    return expiry;
  }

  private generateQRCodeDataUrl(upiLink: string): string {
    // In production, use a QR code library like 'qrcode'
    // This is a simplified version
    try {
      // Return placeholder - frontend should generate actual QR
      return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg">QR Code for: ${encodeURIComponent(upiLink)}</svg>`;
    } catch {
      return '';
    }
  }
}