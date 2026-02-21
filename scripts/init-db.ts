import { Pool } from "pg";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL não está definida em .env.local");
  process.exit(1);
}

const pool = new Pool({ connectionString });

async function initializeDatabase() {
  const client = await pool.connect();
  try {
    console.log("🔄 Inicializando banco de dados...");

    // Verificar e adicionar coluna password_hash se não existir
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
    `);
    console.log("✓ Coluna password_hash verificada/adicionada");

    // Adicionar outras colunas ausentes na tabela users
    const userColumns = [
      "phone VARCHAR(20)",
      "cpf VARCHAR(14)",
      "cep VARCHAR(9)",
      "city VARCHAR(100)",
      "state VARCHAR(2)",
      "profile_photo TEXT"
    ];

    for (const col of userColumns) {
      const colName = col.split(" ")[0];
      await client.query(`
        ALTER TABLE users ADD COLUMN IF NOT EXISTS ${col};
      `);
    }
    console.log("✓ Colunas adicionais da tabela users verificadas");

    // Adicionar coluna provider_name e user_id em provider_ads se não existirem
    const adsColumns = [
      "user_id INTEGER REFERENCES users(id) ON DELETE CASCADE",
      "provider_name VARCHAR(255)",
      "city VARCHAR(100)",
      "state VARCHAR(10)",
      "service_type VARCHAR(50)",
      "service_function VARCHAR(80)",
      "neighborhood VARCHAR(120)",
      "latitude DOUBLE PRECISION",
      "longitude DOUBLE PRECISION",
      "service_radius INTEGER DEFAULT 0",
      "payment_methods TEXT[]",
      "attendance_24h BOOLEAN DEFAULT FALSE",
      "emits_invoice BOOLEAN DEFAULT FALSE",
      "warranty BOOLEAN DEFAULT FALSE",
      "own_equipment BOOLEAN DEFAULT FALSE",
      "specialized_team BOOLEAN DEFAULT FALSE",
      "availability TEXT[]",
      "photos TEXT[]",
      "views INTEGER DEFAULT 0",
      "ratings_count INTEGER DEFAULT 0",
      "ratings_avg NUMERIC(3,2) DEFAULT 0"
    ];

    for (const col of adsColumns) {
      const colName = col.split(" ")[0];
      try {
        await client.query(`
          ALTER TABLE provider_ads ADD COLUMN IF NOT EXISTS ${col};
        `);
      } catch (err: any) {
        if (!err.message.includes("already exists")) {
          console.log(`⚠️  Aviso ao adicionar ${colName}:`, err.message.split('\n')[0]);
        }
      }
    }
    console.log("✓ Colunas adicionais da tabela provider_ads verificadas");

    // Criar tabela categories se não existir
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        group_name VARCHAR(100),
        provider_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✓ Tabela categories verificada");

    // Criar índices se não existirem
    try {
      await client.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_provider_ads_user_id ON provider_ads(user_id);`);
      console.log("✓ Índices criados");
    } catch (err) {
      console.log("ℹ️  Índices já existem");
    }

    // Verificar estrutura final
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log("\n✓ Tabelas no banco:");
    tables.rows.forEach((row) => console.log(`  - ${row.table_name}`));

    console.log("\n✅ Banco de dados inicializado com sucesso!\n");
  } catch (err) {
    console.error("❌ Erro ao inicializar banco:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

initializeDatabase();

