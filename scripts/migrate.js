const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env');
try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const dbUrlMatch = envContent.match(/DATABASE_URL=["']?(.*?)["']?$/m); // Improved regex for quotes

    if (!dbUrlMatch) {
        console.error("DATABASE_URL not found in .env");
        process.exit(1);
    }

    const connectionString = dbUrlMatch[1].trim();
    console.log("Connecting to DB..."); // Don't log the URL for security

    const pool = new Pool({ connectionString });

    async function run() {
        try {
            await pool.query(`
                ALTER TABLE provider_profiles
                ADD COLUMN IF NOT EXISTS cpf VARCHAR(20),
                ADD COLUMN IF NOT EXISTS profile_url TEXT,
                ADD COLUMN IF NOT EXISTS service_type VARCHAR(50),
                ADD COLUMN IF NOT EXISTS has_cnpj BOOLEAN DEFAULT FALSE,
                ADD COLUMN IF NOT EXISTS issues_invoice BOOLEAN DEFAULT FALSE,
                ADD COLUMN IF NOT EXISTS attends_other_cities BOOLEAN DEFAULT FALSE,
                ADD COLUMN IF NOT EXISTS service_radius INTEGER DEFAULT 15,
                ADD COLUMN IF NOT EXISTS experience VARCHAR(50),
                ADD COLUMN IF NOT EXISTS availability TEXT[];
            `);
            await pool.query(`
                ALTER TABLE provider_ads
                ADD COLUMN IF NOT EXISTS service_function VARCHAR(80),
                ADD COLUMN IF NOT EXISTS service_type VARCHAR(50),
                ADD COLUMN IF NOT EXISTS city VARCHAR(100),
                ADD COLUMN IF NOT EXISTS state VARCHAR(10),
                ADD COLUMN IF NOT EXISTS service_radius INTEGER DEFAULT 0,
                ADD COLUMN IF NOT EXISTS payment_methods TEXT[],
                ADD COLUMN IF NOT EXISTS attendance_24h BOOLEAN DEFAULT FALSE,
                ADD COLUMN IF NOT EXISTS emits_invoice BOOLEAN DEFAULT FALSE,
                ADD COLUMN IF NOT EXISTS warranty BOOLEAN DEFAULT FALSE,
                ADD COLUMN IF NOT EXISTS own_equipment BOOLEAN DEFAULT FALSE,
                ADD COLUMN IF NOT EXISTS specialized_team BOOLEAN DEFAULT FALSE,
                ADD COLUMN IF NOT EXISTS availability TEXT[],
                ADD COLUMN IF NOT EXISTS photos TEXT[],
                ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0,
                ADD COLUMN IF NOT EXISTS ratings_count INTEGER DEFAULT 0,
                ADD COLUMN IF NOT EXISTS ratings_avg NUMERIC(3,2) DEFAULT 0;
            `);
            console.log("Migration successful");
        } catch (e) {
            console.error("Migration failed:", e);
        } finally {
            await pool.end();
        }
    }

    run();
} catch (err) {
    console.error("Error reading .env:", err);
}
