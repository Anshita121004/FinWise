import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.jsx",
  out: "./drizzle",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_ExRiaguj40JC@ep-old-bonus-a5tiybp7-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require", // Ensure it's not undefined
  },
});
