-- Policies completas para a tabela public.agendamentos.
--
-- Sintoma corrigido:
-- - SELECT funciona, mas UPDATE retorna 200 [] porque o RLS nao tem policy de alteracao.
-- - Se RLS for habilitado sem policy de SELECT, a agenda passa a listar vazio.
--
-- Execute este arquivo no SQL Editor do Supabase.

alter table public.agendamentos enable row level security;

drop policy if exists "agendamentos_select_public" on public.agendamentos;
drop policy if exists "agendamentos_insert_public" on public.agendamentos;
drop policy if exists "agendamentos_update_authenticated" on public.agendamentos;
drop policy if exists "agendamentos_update_public_app" on public.agendamentos;

create policy "agendamentos_select_public"
on public.agendamentos
for select
to anon, authenticated
using (oficina_id is not null);

create policy "agendamentos_insert_public"
on public.agendamentos
for insert
to anon, authenticated
with check (oficina_id is not null);

create policy "agendamentos_update_public_app"
on public.agendamentos
for update
to anon, authenticated
using (oficina_id is not null)
with check (oficina_id is not null);
