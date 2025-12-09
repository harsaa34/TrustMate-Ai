import { FraudCheckService } from './fraudcheck.service';
import { CreateFraudCheckDto, UpdateFraudCheckDto, FraudCheckResponseDto, AnalyzeTransactionDto, FraudAnalysisResponseDto } from './fraudcheck.dto';
export declare class FraudCheckController {
    private readonly fraudCheckService;
    constructor(fraudCheckService: FraudCheckService);
    create(createFraudCheckDto: CreateFraudCheckDto): Promise<FraudCheckResponseDto>;
    getUserItems(page?: number, limit?: number, status?: string, riskLevel?: string): Promise<FraudCheckResponseDto[]>;
    getById(id: string): Promise<FraudCheckResponseDto>;
    update(id: string, updateFraudCheckDto: UpdateFraudCheckDto): Promise<FraudCheckResponseDto>;
    delete(id: string): Promise<void>;
    analyzeTransaction(analyzeDto: AnalyzeTransactionDto): Promise<FraudAnalysisResponseDto>;
    getStatistics(): Promise<any>;
}
