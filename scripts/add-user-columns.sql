-- Adicionar colunas necessárias na tabela users para completude do perfil

-- Adicionar coluna de telefone
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- Adicionar coluna de CPF
ALTER TABLE users ADD COLUMN IF NOT EXISTS cpf VARCHAR(14);

-- Adicionar coluna de CEP
ALTER TABLE users ADD COLUMN IF NOT EXISTS cep VARCHAR(9);

-- Adicionar coluna de cidade
ALTER TABLE users ADD COLUMN IF NOT EXISTS city VARCHAR(100);

-- Adicionar coluna de estado
ALTER TABLE users ADD COLUMN IF NOT EXISTS state VARCHAR(2);

-- Adicionar coluna de foto de perfil
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_photo TEXT;

-- Verificar estrutura atualizada
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users'
ORDER BY ordinal_position;
