import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin as adminPlugins, username } from "better-auth/plugins";
import { env } from "~~/shared/env";
import { ac, admin, user } from "~~/shared/permission";
import { db } from "../database";

export const auth = betterAuth({
  trustedOrigins: [
    "https://kompak98.com",
    "https://*.kompak98.com",
    "https://kompak98.vercel.app",
  ],
  baseURL: env.BETTER_AUTH_URL || "http://localhost:3000",
  basePath: "/api/auth",
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 7,
  },
  advanced: {
    database: {
      generateId: false,
      useNumberId: true,
    },
  },
  user: {
    modelName: "userTable",
  },
  plugins: [
    username(),
    adminPlugins({
      ac,
      roles: {
        admin,
        user,
      },
    }),
  ],
});

export type UserWithId = Omit<typeof auth.$Infer.Session.user, "id"> & {
  id: number;
};
