import { defineConfig } from "@prisma/config";
import dotenv from "dotenv";

dotenv.config();  // <-- LOAD .env MANUALLY

export default defineConfig({
  schema: "./prisma/schema.prisma",

  datasource: {
    adapter: "mysql",
    url: process.env.DATABASE_URL,
  },
});
