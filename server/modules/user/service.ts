import type { UpdateUserSchema } from "./model";
import { UserRepo } from "./repo";

export abstract class TagihanService {
  static async updateUser(userId: number, payload: UpdateUserSchema) {
    const result = await UserRepo.updateUser(userId, payload);
    if (result.length === 0) {
      throw createError({
        statusCode: 404,
        message: "User tidak ditemukan",
        data: {
          code: "USER_MISSING",
        },
      });
    }
  }

  static async getUserProfile(userId: number) {
    const result = await UserRepo.getUserProfile(userId);
    if (!result) {
      throw createError({
        statusCode: 404,
        message: "User tidak ditemukan",
        data: {
          code: "USER_MISSING",
        },
      });
    }

    return result;
  };
}
