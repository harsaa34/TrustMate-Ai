import { Settlement, SettlementDocument } from '../../../settlement/settlement.schema';
import { SettlementDomain } from '../../../settlement/settlement.domain';
export declare class SettlementMapper {
    static toDomain(settlement: SettlementDocument): SettlementDomain | null;
    static toEntity(domain: SettlementDomain): Partial<Settlement>;
}
