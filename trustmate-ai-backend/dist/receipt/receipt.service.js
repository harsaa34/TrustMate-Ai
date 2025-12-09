"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiptService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const receipt_schema_1 = require("./receipt.schema");
let ReceiptService = class ReceiptService {
    receiptModel;
    constructor(receiptModel) {
        this.receiptModel = receiptModel;
    }
    async create(createReceiptDto, userId) {
        try {
            if (!mongoose_2.Types.ObjectId.isValid(userId)) {
                throw new common_1.BadRequestException('Invalid user ID');
            }
            const receipt = new this.receiptModel({
                ...createReceiptDto,
                createdBy: new mongoose_2.Types.ObjectId(userId),
                isActive: true,
                status: receipt_schema_1.ReceiptStatus.PENDING,
            });
            if (createReceiptDto.imageUrl) {
                await this.simulateOCRProcessing(receipt);
            }
            const savedReceipt = await receipt.save();
            return this.mapToResponseDto(savedReceipt);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to create receipt');
        }
    }
    async processReceiptImage(file, processDto, userId) {
        try {
            if (!mongoose_2.Types.ObjectId.isValid(userId)) {
                throw new common_1.BadRequestException('Invalid user ID');
            }
            if (!file) {
                throw new common_1.BadRequestException('No file uploaded');
            }
            const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
            const receipt = new this.receiptModel({
                merchantName: processDto.merchantName,
                amount: processDto.amount,
                imageUrl: base64Image,
                fileName: file.originalname,
                fileSize: file.size,
                mimeType: file.mimetype,
                createdBy: new mongoose_2.Types.ObjectId(userId),
                isActive: true,
                status: receipt_schema_1.ReceiptStatus.PROCESSING,
            });
            await this.simulateOCRProcessing(receipt);
            const savedReceipt = await receipt.save();
            return this.mapToResponseDto(savedReceipt);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to process receipt image');
        }
    }
    async getUserItems(userId, page, limit, filters) {
        try {
            if (!mongoose_2.Types.ObjectId.isValid(userId)) {
                throw new common_1.BadRequestException('Invalid user ID');
            }
            const skip = (page - 1) * limit;
            const query = {
                createdBy: new mongoose_2.Types.ObjectId(userId),
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
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to fetch receipts');
        }
    }
    async getById(id, userId) {
        try {
            if (!mongoose_2.Types.ObjectId.isValid(id)) {
                throw new common_1.BadRequestException('Invalid receipt ID');
            }
            if (!mongoose_2.Types.ObjectId.isValid(userId)) {
                throw new common_1.BadRequestException('Invalid user ID');
            }
            const receipt = await this.receiptModel
                .findOne({ _id: new mongoose_2.Types.ObjectId(id), isActive: true })
                .exec();
            if (!receipt) {
                throw new common_1.NotFoundException('Receipt not found');
            }
            if (!receipt.createdBy.equals(new mongoose_2.Types.ObjectId(userId))) {
                throw new common_1.ForbiddenException('Access denied');
            }
            return this.mapToResponseDto(receipt);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to fetch receipt');
        }
    }
    async update(id, updateReceiptDto, userId) {
        try {
            if (!mongoose_2.Types.ObjectId.isValid(id)) {
                throw new common_1.BadRequestException('Invalid receipt ID');
            }
            if (!mongoose_2.Types.ObjectId.isValid(userId)) {
                throw new common_1.BadRequestException('Invalid user ID');
            }
            const receipt = await this.receiptModel
                .findOne({ _id: new mongoose_2.Types.ObjectId(id), isActive: true })
                .exec();
            if (!receipt) {
                throw new common_1.NotFoundException('Receipt not found');
            }
            if (!receipt.createdBy.equals(new mongoose_2.Types.ObjectId(userId))) {
                throw new common_1.ForbiddenException('Access denied');
            }
            Object.assign(receipt, updateReceiptDto);
            const updatedReceipt = await receipt.save();
            return this.mapToResponseDto(updatedReceipt);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to update receipt');
        }
    }
    async delete(id, userId) {
        try {
            if (!mongoose_2.Types.ObjectId.isValid(id)) {
                throw new common_1.BadRequestException('Invalid receipt ID');
            }
            if (!mongoose_2.Types.ObjectId.isValid(userId)) {
                throw new common_1.BadRequestException('Invalid user ID');
            }
            const receipt = await this.receiptModel
                .findOne({ _id: new mongoose_2.Types.ObjectId(id), isActive: true })
                .exec();
            if (!receipt) {
                throw new common_1.NotFoundException('Receipt not found');
            }
            if (!receipt.createdBy.equals(new mongoose_2.Types.ObjectId(userId))) {
                throw new common_1.ForbiddenException('Access denied');
            }
            receipt.isActive = false;
            await receipt.save();
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to delete receipt');
        }
    }
    async analyzeReceipt(id, userId) {
        try {
            if (!mongoose_2.Types.ObjectId.isValid(id)) {
                throw new common_1.BadRequestException('Invalid receipt ID');
            }
            if (!mongoose_2.Types.ObjectId.isValid(userId)) {
                throw new common_1.BadRequestException('Invalid user ID');
            }
            const receipt = await this.receiptModel
                .findOne({ _id: new mongoose_2.Types.ObjectId(id), isActive: true })
                .exec();
            if (!receipt) {
                throw new common_1.NotFoundException('Receipt not found');
            }
            if (!receipt.createdBy.equals(new mongoose_2.Types.ObjectId(userId))) {
                throw new common_1.ForbiddenException('Access denied');
            }
            const analysisResult = this.performReceiptAnalysis(receipt);
            receipt.analysisResult = analysisResult;
            receipt.status = receipt_schema_1.ReceiptStatus.PROCESSED;
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
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to analyze receipt');
        }
    }
    async getStatistics(userId) {
        try {
            if (!mongoose_2.Types.ObjectId.isValid(userId)) {
                throw new common_1.BadRequestException('Invalid user ID');
            }
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const stats = await this.receiptModel.aggregate([
                {
                    $match: {
                        createdBy: new mongoose_2.Types.ObjectId(userId),
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
                                $cond: [{ $eq: ['$status', receipt_schema_1.ReceiptStatus.PROCESSED] }, 1, 0],
                            },
                        },
                        pendingCount: {
                            $sum: {
                                $cond: [{ $eq: ['$status', receipt_schema_1.ReceiptStatus.PENDING] }, 1, 0],
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
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to fetch statistics');
        }
    }
    async simulateOCRProcessing(receipt) {
        await new Promise(resolve => setTimeout(resolve, 1000));
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
        receipt.status = receipt_schema_1.ReceiptStatus.PROCESSED;
        receipt.processedAt = new Date();
        receipt.confidenceScore = 85 + Math.random() * 15;
    }
    performReceiptAnalysis(receipt) {
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
    mapToResponseDto(receipt) {
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
};
exports.ReceiptService = ReceiptService;
exports.ReceiptService = ReceiptService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(receipt_schema_1.Receipt.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ReceiptService);
//# sourceMappingURL=receipt.service.js.map