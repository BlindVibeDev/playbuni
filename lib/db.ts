import { Pool } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-serverless"

// Create a database connection pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// Create a drizzle client
export const db = drizzle(pool)

// Also export the pool as default for backward compatibility
export default pool
