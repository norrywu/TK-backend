import "dotenv/config";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/index.ts";
import * as authSchema from "../db/schemas/auth-schema.ts";

const trustedOrigins = process.env.BETTER_AUTH_TRUSTED_ORIGINS
  ? process.env.BETTER_AUTH_TRUSTED_ORIGINS.split(",").map((origin) => origin.trim())
  : ["http://localhost:3000", "http://127.0.0.1:3000"];

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3001",
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema: {
      user: authSchema.user,
      session: authSchema.session,
      account: authSchema.account,
      verification: authSchema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins,
});
