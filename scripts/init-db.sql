-- Criar tabela users (se não existir)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'client',
  phone VARCHAR(20),
  cpf VARCHAR(14),
  cep VARCHAR(9),
  city VARCHAR(100),
  state VARCHAR(2),
  profile_photo TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela provider_profiles
CREATE TABLE IF NOT EXISTS provider_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cpf VARCHAR(20),
  profile_url TEXT,
  service_type VARCHAR(50),
  has_cnpj BOOLEAN DEFAULT FALSE,
  issues_invoice BOOLEAN DEFAULT FALSE,
  attends_other_cities BOOLEAN DEFAULT FALSE,
  service_radius INTEGER DEFAULT 15,
  experience VARCHAR(50),
  availability TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela provider_ads
CREATE TABLE IF NOT EXISTS provider_ads (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider_name VARCHAR(255),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  service_function VARCHAR(80),
  service_type VARCHAR(50),
  city VARCHAR(100),
  state VARCHAR(10),
  location GEOGRAPHY(POINT, 4326),
  service_radius INTEGER DEFAULT 0,
  payment_methods TEXT[],
  attendance_24h BOOLEAN DEFAULT FALSE,
  emits_invoice BOOLEAN DEFAULT FALSE,
  warranty BOOLEAN DEFAULT FALSE,
  own_equipment BOOLEAN DEFAULT FALSE,
  specialized_team BOOLEAN DEFAULT FALSE,
  availability TEXT[],
  photos TEXT[],
  views INTEGER DEFAULT 0,
  ratings_count INTEGER DEFAULT 0,
  ratings_avg NUMERIC(3,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela categories
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  group_name VARCHAR(100),
  provider_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_provider_profiles_user_id ON provider_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_provider_ads_user_id ON provider_ads(user_id);
CREATE INDEX IF NOT EXISTS idx_provider_ads_location ON provider_ads USING GIST(location);

