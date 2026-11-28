import type { UserEntity } from "../../../domain/entities/user.entity.js";
import type {
  CreateUserInput,
  IUserRepository,
} from "../../../domain/interfaces/user-repository.interface.js";
import { UserModel, type UserDocument } from "./user.model.js";

export class MongoUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<UserEntity | null> {
    const doc = await UserModel.findOne({ email });
    return doc ? this.toEntity(doc) : null;
  }
  async findById(id: string): Promise<UserEntity | null> {
    const doc = await UserModel.findById(id);
    return doc ? this.toEntity(doc) : null;
  }
  async create(data: CreateUserInput): Promise<UserEntity> {
    const doc = await UserModel.create(data);
    return this.toEntity(doc);
  }
  private toEntity(doc: UserDocument): UserEntity {
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      passwordHash: doc.passwordHash,
      role: doc.role,
      createdAt: doc.createdAt,
    };
  }
}
