import { Group, GroupDocument } from '../../../group/group.schema';
import { GroupDomain } from '../../../group/group.domain';
export declare class GroupMapper {
    static toDomain(group: GroupDocument): GroupDomain | null;
    static toEntity(domain: GroupDomain): Partial<Group>;
}
