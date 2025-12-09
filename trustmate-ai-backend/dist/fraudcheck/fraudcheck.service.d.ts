import { Model } from 'mongoose';
import { FraudCheck } from './fraudcheck.schema';
import { CreateFraudCheckDto, UpdateFraudCheckDto, FraudCheckResponseDto, AnalyzeTransactionDto, FraudAnalysisResponseDto } from './fraudcheck.dto';
export declare class FraudCheckService {
    private readonly fraudCheckModel;
    constructor(fraudCheckModel: Model<FraudCheck>);
    create(createFraudCheckDto: CreateFraudCheckDto, userId: string): Promise<FraudCheckResponseDto>;
    getUserItems(userId: string, page: number, limit: number, filters?: {
        status?: string;
        riskLevel?: string;
    }): Promise<FraudCheckResponseDto[]>;
    getById(id: string, userId: string): Promise<FraudCheckResponseDto>;
    update(id: string, updateFraudCheckDto: UpdateFraudCheckDto, userId: string): Promise<FraudCheckResponseDto>;
    delete(id: string, userId: string): Promise<void>;
    analyzeTransaction(analyzeDto: AnalyzeTransactionDto, userId: string): Promise<FraudAnalysisResponseDto>;
    getStatistics(userId: string): Promise<any>;
    private calculateRiskScore;
    private detectFraudFlags;
    private mapToResponseDto;
}
