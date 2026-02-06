FitLog Pro

PWA (Progressive Web App) para gestão de treinos de musculação, focado em performance mobile-first e acompanhamento de carga.

Live Demo: Acesse o Projeto
Funcionalidades

    Autenticação: Login via Google (OAuth) com Supabase.

    Gestão de Fichas: Criação e edição de treinos personalizados.

    Execução de Treino: Interface com cronômetro de descanso integrado.

    Evolução: Gráficos de progressão de carga e histórico automático.

    PWA: Instalável em dispositivos iOS e Android.

    Dark Mode: Interface otimizada para baixo consumo de bateria.

Tecnologias

    Frontend: React (Vite) e Tailwind CSS v4.

    Navegação: React Router DOM.

    Gráficos/Ícones: Recharts e Lucide React.

    Backend: Supabase (PostgreSQL, Auth e RLS).

    Deploy: Vercel.

Configuração Local

    Clone e Instale:
    Bash

    git clone https://github.com/SEU-USUARIO/fitlog-pro.git
    cd fitlog-pro
    npm install

    Variáveis de Ambiente: Crie um arquivo .env.local:
    Snippet de código

    VITE_SUPABASE_URL=sua_url
    VITE_SUPABASE_ANON_KEY=sua_chave

    Execute:
    Bash

    npm run dev

Estrutura de Dados (SQL)

Execute no editor SQL do Supabase para criar as tabelas necessárias:
SQL

create table workouts (
id uuid default gen_random_uuid() primary key,
user_id uuid references auth.users not null,
name text not null,
created_at timestamptz default now()
);

create table exercises (
id uuid default gen_random_uuid() primary key,
workout_id uuid references workouts on delete cascade not null,
name text not null,
sets int default 3,
reps text,
weight text
);

create table workout_history (
id uuid default gen_random_uuid() primary key,
user_id uuid references auth.users not null,
workout_name text not null,
finished_at timestamptz default now()
);

create table exercise_history (
id uuid default gen_random_uuid() primary key,
user_id uuid references auth.users not null,
exercise_name text not null,
weight text,
sets int,
reps text,
created_at timestamptz default now()
);

    Nota: Ative o RLS (Row Level Security) em todas as tabelas para garantir a privacidade dos dados.
