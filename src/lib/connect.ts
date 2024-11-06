import { Pool } from "pg";
let db: Pool | undefined;

export const connect = () => {
  if (!db) {
    db = new Pool({
      connectionString: process.env.DB_URL,
    });
  }
  return db;
};
