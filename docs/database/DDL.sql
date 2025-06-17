CREATE SCHEMA content_flow AUTHORIZATION "postgres";;

CREATE TABLE content_flow.users (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    cpf VARCHAR(14) NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    role VARCHAR(10) NOT NULL CHECK (role IN ('admin', 'member')),
    avatar VARCHAR(500),
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE content_flow.authentications (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES content_flow.users(id) ON DELETE CASCADE,
    provider VARCHAR(20) NOT NULL CHECK (provider IN ('local', 'google', 'github')),
    password_hash VARCHAR(255),
    refresh_token TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_provider UNIQUE (user_id, provider)
);

CREATE TABLE content_flow.content (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES content_flow.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    format VARCHAR(20) NOT NULL CHECK (format IN ('blog', 'social', 'email')),
    topic VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE content_flow.editorial_calendar (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES content_flow.users(id) ON DELETE CASCADE,
    month SMALLINT NOT NULL CHECK (month >= 1 AND month <= 12),
 year INTEGER NOT NULL CHECK (year >= 2000),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE content_flow.integration (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES content_flow.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('wordpress', 'facebook', 'instagram', 'linkedin', 'google-analytics')),
    access_token TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE content_flow.metric (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES content_flow.users(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES content_flow.content(id) ON DELETE CASCADE,
    views INTEGER NOT NULL DEFAULT 0 CHECK (views >= 0),
    likes INTEGER NOT NULL DEFAULT 0 CHECK (likes >= 0),
    comments INTEGER NOT NULL DEFAULT 0 CHECK (comments >= 0),
    shares INTEGER NOT NULL DEFAULT 0 CHECK (shares >= 0),
    collected_at TIMESTAMP NOT NULL
);

CREATE TABLE content_flow.notification (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES content_flow.users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('reminder', 'suggestion')),
    message TEXT NOT NULL,
    sent_at TIMESTAMP NOT NULL,
    read BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE content_flow.publication (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES content_flow.users(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES content_flow.content(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    scheduled_at TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('scheduled', 'published', 'failed')),
    published_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE content_flow.plan (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    price DECIMAL(10,2) NOT NULL,
    trial_days INTEGER NOT NULL DEFAULT 7,
    description TEXT,
    features JSONB, --- utilizado para armazenar os recursos do plano, ex: limite de usuários, limit de requisições etc
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE content_flow.subscription (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES content_flow.users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES content_flow.plan(id),
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'inactive', 'canceled', 'expired')),
    renewal_date TIMESTAMP NOT NULL,
    auto_renew BOOLEAN NOT NULL DEFAULT FALSE,
    trial_start TIMESTAMP,
    trial_end TIMESTAMP,
    is_trail BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE content_flow.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    plan_id UUID NOT NULL,
    subscription_id UUID,
    amount NUMERIC(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    method VARCHAR(30) NOT NULL,
    gateway_payment_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    paid_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,

    CONSTRAINT fk_payments_user
        FOREIGN KEY(user_id) REFERENCES content_flow.users(id),
    CONSTRAINT fk_payments_plan
        FOREIGN KEY(plan_id) REFERENCES content_flow.plan(id),
    CONSTRAINT fk_payments_subscription
        FOREIGN KEY(subscription_id) REFERENCES content_flow.subscription(id)
);

CREATE TABLE content_flow.team (
    id UUID PRIMARY KEY,
    owner_id UUID NOT NULL REFERENCES content_flow.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE content_flow.team_member (
    id UUID PRIMARY KEY,
    team_id UUID NOT NULL REFERENCES content_flow.team(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES content_flow.users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
    invited_at TIMESTAMP NOT NULL,
    joined_at TIMESTAMP,
    UNIQUE (team_id, user_id)
);


CREATE TABLE content_flow.topic_suggestion (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES content_flow.users(id) ON DELETE CASCADE,
    topic VARCHAR(255) NOT NULL,
    source VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE content_flow.permission (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE content_flow.team_member_permission (
    team_member_id UUID NOT NULL REFERENCES content_flow.team_member(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES content_flow.permission(id) ON DELETE CASCADE,
    PRIMARY KEY (team_member_id, permission_id)
);

CREATE TABLE content_flow.subscription_stripe_data (
    id SERIAL PRIMARY KEY,
    subscription_id UUID NOT NULL REFERENCES content_flow.subscription(id),
    stripe_subscription_id VARCHAR(255) NOT NULL,
    stripe_customer_id VARCHAR(255) NOT NULL,
    stripe_price_id VARCHAR(255),
    stripe_invoice_id VARCHAR(255),
    stripe_status VARCHAR(50),
    cancellation_reason VARCHAR(255),
    last_stripe_event VARCHAR(255),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO content_flow.plan (
  id, name, price, trial_days, description, features, created_at, updated_at
) VALUES
  (
    gen_random_uuid(),
    'Básico',
    49.00,
    7,
    'Plano básico para quem está começando.',
    '{
      "posts_per_month": "Até 5",
      "content_formats": ["Blog", "Redes Sociais"],
      "editorial_calendar": ["Mensal"],
      "metrics": ["Básicas"],
      "integrations": [],
      "support": ["E-mail"],
      "users": 1
    }',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Padrão',
    99.00,
    7,
    'Plano padrão para equipes pequenas.',
    '{
      "posts_per_month": "Até 20",
      "content_formats": ["Blog", "Redes Sociais", "E-mail"],
      "editorial_calendar": ["Mensal", "Semanal"],
      "metrics": ["Avançadas"],
      "integrations": ["WordPress", "Redes Sociais"],
      "support": ["E-mail", "Chat"],
      "users": 3
    }',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Premium',
    249.00,
    7,
    'Plano premium para grandes equipes e demandas ilimitadas.',
    '{
      "posts_per_month": "Ilimitados",
      "content_formats": ["Todos"],
      "editorial_calendar": ["Mensal", "Semanal", "Diário"],
      "metrics": ["Avançadas", "ROI"],
      "integrations": ["Todas"],
      "support": ["E-mail", "Chat", "Telefone"],
      "users": "Ilimitados"
    }',
    NOW(),
    NOW()
  );