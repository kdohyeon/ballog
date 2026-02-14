-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum Types
CREATE TYPE game_status AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'FINISHED', 'CANCELED', 'SUSPENDED');

-- 1. Team Table
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(50) NOT NULL,
    code VARCHAR(10) NOT NULL UNIQUE,
    logo_url TEXT,
    primary_color VARCHAR(7),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Stadium Table
CREATE TABLE IF NOT EXISTS stadiums (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    weather_keyword VARCHAR(50), -- e.g., 'seoul', 'busan' for weather API mapping
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Game Table
CREATE TABLE IF NOT EXISTS games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_date_time TIMESTAMPTZ NOT NULL,
    game_id VARCHAR(100), -- External ID (e.g. Naver Game ID)
    home_team_id UUID NOT NULL REFERENCES teams(id),
    away_team_id UUID NOT NULL REFERENCES teams(id),
    stadium_id UUID NOT NULL REFERENCES stadiums(id),
    home_score INTEGER DEFAULT 0,
    away_score INTEGER DEFAULT 0,
    status game_status DEFAULT 'SCHEDULED',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_game_schedule UNIQUE (game_date_time, home_team_id, away_team_id)
);

-- 4. Member Table
CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uid VARCHAR(255) NOT NULL UNIQUE, -- User ID from auth provider (e.g. Firebase/Supabase Auth)
    nickname VARCHAR(50),
    preferred_team_id UUID REFERENCES teams(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Record Table (Intuition Record)
CREATE TABLE IF NOT EXISTS records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    game_id UUID NOT NULL REFERENCES games(id),
    supported_team_id UUID REFERENCES teams(id),
    result_snapshot VARCHAR(20), -- 'WIN', 'LOSE', 'DRAW', 'CANCELED' snapshot at record time
    seat_info VARCHAR(255),
    content TEXT,
    ticket_image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_member_game_record UNIQUE (member_id, game_id)
);

-- Indexes for performance
CREATE INDEX idx_games_date ON games(game_date_time);
CREATE INDEX idx_records_member ON records(member_id);
