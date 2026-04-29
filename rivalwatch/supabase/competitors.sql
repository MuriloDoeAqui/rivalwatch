-- RivalWatch MVP: tabela base de concorrentes
-- Requisitos: id, user_id, name, website, created_at
-- Observação: este arquivo não aplica nada automaticamente; copie e rode no SQL Editor do Supabase.

create table if not exists public.competitors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  website text not null,
  created_at timestamptz not null default now()
);

-- Row Level Security
alter table public.competitors enable row level security;

-- Políticas: cada usuário só enxerga seus registros
create policy "competitors_select_own"
on public.competitors
for select
using (auth.uid() = user_id);

create policy "competitors_insert_own"
on public.competitors
for insert
with check (auth.uid() = user_id);

create policy "competitors_delete_own"
on public.competitors
for delete
using (auth.uid() = user_id);

create policy "competitors_update_own"
on public.competitors
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

