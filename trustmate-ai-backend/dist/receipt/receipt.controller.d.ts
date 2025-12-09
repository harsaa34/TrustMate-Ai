import { ReceiptService } from './receipt.service';
import { CreateReceiptDto, UpdateReceiptDto, ReceiptResponseDto, ProcessReceiptDto, ReceiptAnalysisResultDto, ReceiptListResponseDto } from './receipt.dto';
export declare class ReceiptController {
    private readonly receiptService;
    constructor(receiptService: ReceiptService);
    create(createReceiptDto: CreateReceiptDto): Promise<ReceiptResponseDto>;
    uploadAndProcess(file: Express.Multer.File, processDto: ProcessReceiptDto): Promise<ReceiptResponseDto>;
    getUserItems(page?: number, limit?: number, status?: string, merchantName?: string, fromDate?: string, toDate?: string): Promise<ReceiptListResponseDto>;
    getById(id: string): Promise<ReceiptResponseDto>;
    update(id: string, updateReceiptDto: UpdateReceiptDto): Promise<ReceiptResponseDto>;
    delete(id: string): Promise<void>;
    analyzeReceipt(id: string): Promise<ReceiptAnalysisResultDto>;
    getStatistics(): Promise<any>;
}
