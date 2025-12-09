import { UserDocument } from '../../../user/schemas/user.schema';
import { UserDomain } from '../../../user/user.domain';
import { UserResponseDto } from '../../../user/user.dto';
export declare class UserMapper {
    static toDomain(userDoc: UserDocument | null): UserDomain | null;
    static toResponseDto(user: UserDomain): UserResponseDto;
    static toDomains(userDocs: UserDocument[]): UserDomain[];
    static toEntity(user: UserDomain): any;
}
