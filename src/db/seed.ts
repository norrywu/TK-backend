import "dotenv/config";
import { auth } from "../lib/auth.ts";
import { db } from "./index.ts";
import { user } from "./schemas/auth-schema.ts";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding user login data...");

  const testUsers = [
    {
      name: "Admin TK",
      email: "admin@example.com",
      password: "password1234",
    },
    {
      name: "User TK",
      email: "user@example.com",
      password: "password1234",
    },
  ];

  try {
    for (const testUser of testUsers) {
      const existingUser = await db
        .select()
        .from(user)
        .where(eq(user.email, testUser.email))
        .limit(1);

      if (existingUser.length > 0) {
        console.log(`ℹ️ User with email "${testUser.email}" already exists (skipped).`);
        continue;
      }

      await auth.api.signUpEmail({
        body: {
          name: testUser.name,
          email: testUser.email,
          password: testUser.password,
        },
      });

      console.log(`✅ User "${testUser.email}" created successfully!`);
    }

    console.log("\n✨ Seeding completed successfully!");
    console.log("📋 Available Credentials:");
    testUsers.forEach((u) => {
      console.log(`   - Email: ${u.email} | Password: ${u.password} (${u.name})`);
    });
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to seed user:", error);
    process.exit(1);
  }
}

seed();
