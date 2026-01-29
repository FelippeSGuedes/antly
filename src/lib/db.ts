import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não configurada.");
}

declare global {
  // eslint-disable-next-line no-var
  var pgPool: Pool | undefined;
}

const pool = global.pgPool ?? new Pool({ connectionString });

if (process.env.NODE_ENV !== "production") {
  global.pgPool = pool;
}

export default pool;
