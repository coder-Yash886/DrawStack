import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  earlyAccess: true,
  schema: path.join(__dirname, "prisma/schema.prisma"),
  migrate: {
    async adapter() {
      const { PrismaPg } = await import("@prisma/adapter-pg");
      return new PrismaPg({ connectionString: process.env.DATABASE_URL });
    },
  },
});