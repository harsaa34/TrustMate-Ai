import { Model } from 'mongoose';
import { TrustScore } from './trustscore.schema';
import { CreateTrustScoreDto, UpdateTrustScoreDto, TrustScoreResponseDto } from './trustscore.dto';
export declare class TrustScoreService {
    private readonly trustScoreModel;
    constructor(trustScoreModel: Model<TrustScore>);
    create(createTrustScoreDto: CreateTrustScoreDto, userId: string): Promise<TrustScoreResponseDto>;
    getUserItems(userId: string, page: number, limit: number): Promise<TrustScoreResponseDto[]>;
    getById(id: string, userId: string): Promise<TrustScoreResponseDto>;
    update(id: string, updateTrustScoreDto: UpdateTrustScoreDto, userId: string): Promise<TrustScoreResponseDto>;
    delete(id: string, userId: string): Promise<void>;
    private mapToResponseDto;
}
