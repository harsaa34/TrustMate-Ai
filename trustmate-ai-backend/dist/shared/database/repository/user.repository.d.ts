import { Model, FilterQuery } from 'mongoose';
import { UserDocument } from '../../../user/schemas/user.schema';
import { UserDomain } from '../../../user/user.domain';
export declare class UserRepository {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    findByEmail(email: string): Promise<UserDomain | null>;
    findById(id: string): Promise<UserDomain>;
    save(user: UserDomain): Promise<UserDomain>;
    existsByEmail(email: string): Promise<boolean>;
    create(user: UserDomain): Promise<UserDomain>;
    findOne(conditions: FilterQuery<UserDocument>): Promise<UserDocument | null>;
    findAll(): Promise<UserDomain[]>;
    deactivate(id: string): Promise<UserDomain>;
    update(id: string, updateData: Partial<UserDomain>): Promise<UserDomain>;
}
