import type { UpdateUserSchema } from "./model";
import { UserRepo } from "./repo";

export abstract class UserService {
  static async updateUser(userId: number, payload: UpdateUserSchema) {
    let uploadedKey: string | undefined;
    if (payload.file.length) {
      const file = payload.file[0]!;

      uploadedKey = (
        await uploadFile(
          "user-image",
          file.filename!,
          file.data,
          file.type!,
        )
      ).key;
    }

    try {
      return await UserRepo.updateUser(userId, payload, uploadedKey);
    }
    catch (error) {
      if (uploadedKey) {
        await deleteFile(uploadedKey);
      }

      throw error;
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

  static async getAllUserOption() {
    return UserRepo.getAllUserOption();
  }
}
