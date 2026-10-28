-- Initial schema: profiles aggregate (4 tables) + auth accounts.
-- Idempotent: safe to re-run via `pnpm db:migrate`.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

DO $$ BEGIN
  CREATE TYPE user_gender_enum AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE account_role_enum AS ENUM ('ADMIN', 'EDITOR', 'VIEWER');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS user_infos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth TEXT NOT NULL,
  occupation TEXT NOT NULL,
  gender user_gender_enum NOT NULL,
  profile_photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT user_infos_dob_past CHECK (date_of_birth::date <= CURRENT_DATE),
  CONSTRAINT user_infos_photo_url CHECK (profile_photo_url IS NULL OR profile_photo_url ~* '^https?://')
);

CREATE TABLE IF NOT EXISTS user_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES user_infos(id) ON DELETE CASCADE,
  email CITEXT NOT NULL UNIQUE,
  phone_number TEXT NOT NULL,
  fax TEXT,
  linkedin_url TEXT,
  CONSTRAINT user_contacts_linkedin_url CHECK (linkedin_url IS NULL OR linkedin_url ~* '^https?://')
);

CREATE TABLE IF NOT EXISTS user_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES user_infos(id) ON DELETE CASCADE,
  address_line TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL,
  zip_code TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_academics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_infos(id) ON DELETE CASCADE,
  school_name TEXT NOT NULL,
  degree TEXT,
  field_of_study TEXT,
  start_date TEXT,
  end_date TEXT,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  CONSTRAINT user_academics_dates CHECK (
    end_date IS NULL OR start_date IS NULL OR end_date::date >= start_date::date
  )
);

CREATE TABLE IF NOT EXISTS auth_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email CITEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role account_role_enum NOT NULL DEFAULT 'VIEWER',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS user_infos_created_at_idx ON user_infos (created_at DESC);
CREATE INDEX IF NOT EXISTS user_infos_name_idx ON user_infos (last_name, first_name);
CREATE INDEX IF NOT EXISTS user_academics_user_sort_idx ON user_academics (user_id, sort_order);
