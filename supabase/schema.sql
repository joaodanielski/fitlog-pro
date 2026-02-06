-- Tabela de Treinos (Fichas)
create table workouts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Segurança (RLS) - Apenas o dono pode ver/editar seus treinos
alter table workouts enable row level security;

create policy "Users can manage their own workouts"
on workouts for all
using (auth.uid() = user_id);

-- Tabela de Exercícios
create table exercises (
  id uuid default gen_random_uuid() primary key,
  workout_id uuid references workouts on delete cascade not null,
  name text not null,
  sets int default 3,
  reps text default '12',
  weight text default '0',
  rest_seconds int default 60,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Segurança (RLS) - Apenas o dono do treino pode ver os exercícios
alter table exercises enable row level security;

create policy "Users can manage their own exercises"
on exercises for all
using (
  exists (
    select 1 from workouts
    where workouts.id = exercises.workout_id
    and workouts.user_id = auth.uid()
  )
);