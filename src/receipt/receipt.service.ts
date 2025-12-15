import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Receipt, ReceiptStatus } from './receipt.schema';
import {
  CreateReceiptDto,
  UpdateReceiptDto,
  ReceiptResponseDto,
  ProcessReceiptDto,
  ReceiptAnalysisResultDto,
  ReceiptListResponseDto,
} from './receipt.dto';

@Injectable()
export class ReceiptService {
  constructor(
    @InjectModel(Receipt.name)
    private readonly receiptModel: Model<Receipt>,
  ) {}

  async create(
    createReceiptDto: CreateReceiptDto,
    userId: string,
  ): Promise<ReceiptResponseDto> {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid user ID');
      }

      const receipt = new this.receiptModel({
        ...createReceiptDto,
        createdBy: new Types.ObjectId(userId),
        isActive: true,
        status: ReceiptStatus.PENDING,
      });

      // If imageUrl is provided, simulate OCR processing
      if (createReceiptDto.imageUrl) {
        await this.simulateOCRProcessing(receipt);
      }

      const savedReceipt = await receipt.save();
      return this.mapToResponseDto(savedReceipt);
    } catch (error) {
      throw new BadRequestException('Failed to create receipt');
    }
  }

  async processReceiptImage(
    file: any,
    processDto: ProcessReceiptDto,
    userId: string,
  ): Promise<ReceiptResponseDto> {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid user ID');
      }

      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      // Convert file to base64 for storage
      const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

      const receipt = new this.receiptModel({
        merchantName: processDto.merchantName,
        amount: processDto.amount,
        imageUrl: base64Image,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        createdBy: new Types.ObjectId(userId),
        isActive: true,
        status: ReceiptStatus.PROCESSING,
      });

      // Simulate OCR processing
      await this.simulateOCRProcessing(receipt);
      
      const savedReceipt = await receipt.save();
      return this.mapToResponseDto(savedReceipt);
    } catch (error) {
      throw new BadRequestException('Failed to process receipt image');
    }
  }

  async getUserItems(
    userId: string,
    page: number,
    limit: number,
    filters?: {
      status?: string;
      merchantName?: string;
      fromDate?: string;
      toDate?: string;
    },
  ): Promise<ReceiptListResponseDto> {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid user ID');
      }

      const skip = (page - 1) * limit;
      const query: any = { 
        createdBy: new Types.ObjectId(userId), 
        isActive: true 
      };

      if (filters?.status) {
        query.status = filters.status;
      }
      if (filters?.merchantName) {
        query.merchantName = { $regex: filters.merchantName, $options: 'i' };
      }
      if (filters?.fromDate || filters?.toDate) {
        query.createdAt = {};
        if (filters.fromDate) {
          query.createdAt.$gte = new Date(filters.fromDate);
        }
        if (filters.toDate) {
          query.createdAt.$lte = new Date(filters.toDate);
        }
      }
      
      const [receipts, total] = await Promise.all([
        this.receiptModel
          .find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.receiptModel.countDocuments(query),
      ]);

      return {
        receipts: receipts.map((receipt) => this.mapToResponseDto(receipt)),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch receipts');
    }
  }

  async getById(
    id: string,
    userId: string,
  ): Promise<ReceiptResponseDto> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid receipt ID');
      }

      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid user ID');
      }

      const receipt = await this.receiptModel
        .findOne({ _id: new Types.ObjectId(id), isActive: true })
        .exec();

      if (!receipt) {
        throw new NotFoundException('Receipt not found');
      }

      if (!receipt.createdBy.equals(new Types.ObjectId(userId))) {
        throw new ForbiddenException('Access denied');
      }

      return this.mapToResponseDto(receipt);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch receipt');
    }
  }

  async update(
    id: string,
    updateReceiptDto: UpdateReceiptDto,
    userId: string,
  ): Promise<ReceiptResponseDto> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid receipt ID');
      }

      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid user ID');
      }

      const receipt = await this.receiptModel
        .findOne({ _id: new Types.ObjectId(id), isActive: true })
        .exec();

      if (!receipt) {
        throw new NotFoundException('Receipt not found');
      }

      if (!receipt.createdBy.equals(new Types.ObjectId(userId))) {
        throw new ForbiddenException('Access denied');
      }

      Object.assign(receipt, updateReceiptDto);
      const updatedReceipt = await receipt.save();

      return this.mapToResponseDto(updatedReceipt);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException('Failed to update receipt');
    }
  }

  async delete(id: string, userId: string): Promise<void> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid receipt ID');
      }

      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid user ID');
      }

      const receipt = await this.receiptModel
        .findOne({ _id: new Types.ObjectId(id), isActive: true })
        .exec();

      if (!receipt) {
        throw new NotFoundException('Receipt not found');
      }

      if (!receipt.createdBy.equals(new Types.ObjectId(userId))) {
        throw new ForbiddenException('Access denied');
      }

      receipt.isActive = false;
      await receipt.save();
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete receipt');
    }
  }

  async analyzeReceipt(
    id: string,
    userId: string,
  ): Promise<ReceiptAnalysisResultDto> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid receipt ID');
      }

      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid user ID');
      }

      const receipt = await this.receiptModel
        .findOne({ _id: new Types.ObjectId(id), isActive: true })
        .exec();

      if (!receipt) {
        throw new NotFoundException('Receipt not found');
      }

      if (!receipt.createdBy.equals(new Types.ObjectId(userId))) {
        throw new ForbiddenException('Access denied');
      }

      // Mock analysis logic
      const analysisResult = this.performReceiptAnalysis(receipt);
      
      // Update receipt with analysis result
      receipt.analysisResult = analysisResult;
      receipt.status = ReceiptStatus.PROCESSED;
      await receipt.save();

      return {
        receiptId: receipt._id.toString(),
        merchantName: receipt.merchantName,
        totalAmount: receipt.amount,
        currency: receipt.currency || 'INR',
        transactionDate: receipt.transactionDate || receipt.createdAt,
        category: analysisResult.category,
        subcategory: analysisResult.subcategory,
        items: analysisResult.items,
        confidence: analysisResult.confidence,
        expenseType: analysisResult.expenseType,
        taxAmount: analysisResult.taxAmount,
        tipAmount: analysisResult.tipAmount,
        isBusinessExpense: analysisResult.isBusinessExpense,
        insights: analysisResult.insights,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException('Failed to analyze receipt');
    }
  }

  async getStatistics(userId: string): Promise<any> {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid user ID');
      }

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const stats = await this.receiptModel.aggregate([
        {
          $match: {
            createdBy: new Types.ObjectId(userId),
            isActive: true,
            createdAt: { $gte: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: null,
            totalReceipts: { $sum: 1 },
            totalAmount: { $sum: '$amount' },
            avgAmount: { $avg: '$amount' },
            processedCount: {
              $sum: {
                $cond: [{ $eq: ['$status', ReceiptStatus.PROCESSED] }, 1, 0],
              },
            },
            pendingCount: {
              $sum: {
                $cond: [{ $eq: ['$status', ReceiptStatus.PENDING] }, 1, 0],
              },
            },
            byMerchant: {
              $push: {
                merchant: '$merchantName',
                amount: '$amount',
              },
            },
            byCategory: {
              $push: {
                category: '$analysisResult.category',
                amount: '$amount',
              },
            },
          },
        },
        {
          $project: {
            totalReceipts: 1,
            totalAmount: 1,
            avgAmount: 1,
            processedCount: 1,
            pendingCount: 1,
            processingRate: {
              $multiply: [
                { $divide: ['$processedCount', '$totalReceipts'] },
                100,
              ],
            },
            topMerchants: {
              $slice: [
                {
                  $sortArray: {
                    input: {
                      $reduce: {
                        input: '$byMerchant',
                        initialValue: [],
                        in: {
                          $concatArrays: [
                            '$$value',
                            [
                              {
                                merchant: '$$this.merchant',
                                amount: '$$this.amount',
                              },
                            ],
                          ],
                        },
                      },
                    },
                    sortBy: { amount: -1 },
                  },
                },
                5,
              ],
            },
            categoryDistribution: {
              $arrayToObject: {
                $map: {
                  input: {
                    $reduce: {
                      input: '$byCategory',
                      initialValue: [],
                      in: {
                        $concatArrays: [
                          '$$value',
                          [{
                            category: '$$this.category',
                            amount: '$$this.amount',
                          }],
                        ],
                      },
                    },
                  },
                  as: 'item',
                  in: {
                    k: { $ifNull: ['$$item.category', 'Unknown'] },
                    v: '$$item.amount',
                  },
                },
              },
            },
          },
        },
      ]);

      return stats[0] || {
        totalReceipts: 0,
        totalAmount: 0,
        avgAmount: 0,
        processedCount: 0,
        pendingCount: 0,
        processingRate: 0,
        topMerchants: [],
        categoryDistribution: {},
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch statistics');
    }
  }

  private async simulateOCRProcessing(receipt: Receipt): Promise<void> {
    // Mock OCR processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock extracted data
    const mockData = {
      merchantName: receipt.merchantName || 'Mock Merchant',
      amount: receipt.amount || Math.random() * 1000,
      currency: 'INR',
      transactionDate: new Date(),
      items: [
        { name: 'Item 1', quantity: 1, price: receipt.amount / 2 || 50 },
        { name: 'Item 2', quantity: 1, price: receipt.amount / 2 || 50 },
      ],
      taxAmount: receipt.amount * 0.18 || 0,
      tipAmount: 0,
      paymentMethod: 'Card',
    };

    receipt.ocrData = mockData;
    receipt.status = ReceiptStatus.PROCESSED;
    receipt.processedAt = new Date();
    receipt.confidenceScore = 85 + Math.random() * 15; // 85-100%
  }

  private performReceiptAnalysis(receipt: any): any {
    const categories = [
      { name: 'Food & Dining', subcategories: ['Restaurant', 'Cafe', 'Fast Food'] },
      { name: 'Shopping', subcategories: ['Clothing', 'Electronics', 'Groceries'] },
      { name: 'Transportation', subcategories: ['Fuel', 'Public Transport', 'Taxi'] },
      { name: 'Entertainment', subcategories: ['Movies', 'Concerts', 'Sports'] },
      { name: 'Utilities', subcategories: ['Electricity', 'Internet', 'Mobile'] },
    ];

    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomSubcategory = randomCategory.subcategories[Math.floor(Math.random() * randomCategory.subcategories.length)];

    return {
      category: randomCategory.name,
      subcategory: randomSubcategory,
      items: receipt.ocrData?.items || [
        { name: 'Main Item', quantity: 1, price: receipt.amount, total: receipt.amount },
      ],
      confidence: 85 + Math.random() * 15,
      expenseType: Math.random() > 0.5 ? 'Business' : 'Personal',
      taxAmount: receipt.amount * 0.18,
      tipAmount: receipt.amount * 0.1,
      isBusinessExpense: Math.random() > 0.7,
      insights: [
        'Similar purchases detected',
        'Price is within normal range',
        'Merchant is trusted',
      ],
    };
  }

  private mapToResponseDto(receipt: any): ReceiptResponseDto {
    return {
      id: receipt._id ? receipt._id.toString() : receipt.id,
      merchantName: receipt.merchantName,
      amount: receipt.amount,
      currency: receipt.currency,
      transactionDate: receipt.transactionDate,
      imageUrl: receipt.imageUrl,
      fileName: receipt.fileName,
      fileSize: receipt.fileSize,
      mimeType: receipt.mimeType,
      ocrData: receipt.ocrData,
      analysisResult: receipt.analysisResult,
      status: receipt.status,
      confidenceScore: receipt.confidenceScore,
      processedAt: receipt.processedAt,
      isActive: receipt.isActive,
      createdBy: receipt.createdBy.toString(),
      createdAt: receipt.createdAt,
      updatedAt: receipt.updatedAt,
    };
  }
}