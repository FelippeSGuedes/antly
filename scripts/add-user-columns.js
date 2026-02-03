import pool from "../src/lib/db";

async function addUserColumns() {
  try {
    console.log("Adicionando colunas na tabela users...");

    // Adicionar coluna de telefone
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
    `);
    console.log("✓ Coluna phone adicionada");

    // Adicionar coluna de CPF
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS cpf VARCHAR(14);
    `);
    console.log("✓ Coluna cpf adicionada");

    // Adicionar coluna de CEP
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS cep VARCHAR(9);
    `);
    console.log("✓ Coluna cep adicionada");

    // Adicionar coluna de cidade
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS city VARCHAR(100);
    `);
    console.log("✓ Coluna city adicionada");

    // Adicionar coluna de estado
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS state VARCHAR(2);
    `);
    console.log("✓ Coluna state adicionada");

    // Adicionar coluna de foto de perfil
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_photo TEXT;
    `);
    console.log("✓ Coluna profile_photo adicionada");

    // Verificar estrutura
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);

    console.log("\nEstrutura atual da tabela users:");
    console.table(result.rows);

    console.log("\n✓ Migração concluída com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("Erro ao adicionar colunas:", error);
    process.exit(1);
  }
}

addUserColumns();
