import { TrustScoreService } from './trustscore.service';
import { CreateTrustScoreDto, UpdateTrustScoreDto, TrustScoreResponseDto } from './trustscore.dto';
export declare class TrustScoreController {
    private readonly trustScoreService;
    constructor(trustScoreService: TrustScoreService);
    create(createTrustScoreDto: CreateTrustScoreDto): Promise<TrustScoreResponseDto>;
    getUserItems(page?: number, limit?: number): Promise<TrustScoreResponseDto[]>;
    getById(id: string): Promise<TrustScoreResponseDto>;
    update(id: string, updateTrustScoreDto: UpdateTrustScoreDto): Promise<TrustScoreResponseDto>;
    delete(id: string): Promise<void>;
}
