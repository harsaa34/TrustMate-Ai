import { Model } from 'mongoose';
import { Receipt } from './receipt.schema';
import { CreateReceiptDto, UpdateReceiptDto, ReceiptResponseDto, ProcessReceiptDto, ReceiptAnalysisResultDto, ReceiptListResponseDto } from './receipt.dto';
export declare class ReceiptService {
    private readonly receiptModel;
    constructor(receiptModel: Model<Receipt>);
    create(createReceiptDto: CreateReceiptDto, userId: string): Promise<ReceiptResponseDto>;
    processReceiptImage(file: any, processDto: ProcessReceiptDto, userId: string): Promise<ReceiptResponseDto>;
    getUserItems(userId: string, page: number, limit: number, filters?: {
        status?: string;
        merchantName?: string;
        fromDate?: string;
        toDate?: string;
    }): Promise<ReceiptListResponseDto>;
    getById(id: string, userId: string): Promise<ReceiptResponseDto>;
    update(id: string, updateReceiptDto: UpdateReceiptDto, userId: string): Promise<ReceiptResponseDto>;
    delete(id: string, userId: string): Promise<void>;
    analyzeReceipt(id: string, userId: string): Promise<ReceiptAnalysisResultDto>;
    getStatistics(userId: string): Promise<any>;
    private simulateOCRProcessing;
    private performReceiptAnalysis;
    private mapToResponseDto;
}
