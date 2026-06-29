-- GO Oficina - Agenda timeline support
-- Execute no SQL Editor do Supabase.

-- 1) Indices para filtros da agenda e historico por cliente.
create index if not exists idx_agendamentos_oficina_data_status
  on public.agendamentos (oficina_id, servico_data, status);

create index if not exists idx_agendamentos_oficina_cliente
  on public.agendamentos (oficina_id, cliente_id);

create index if not exists idx_orcamentos_agendamento_oficina
  on public.orcamentos (agendamento_id, oficina_id);

create index if not exists idx_ordens_servico_agendamento_oficina
  on public.ordens_servico (agendamento_id, oficina_id);

-- Evita duplicidade quando o usuario clicar mais de uma vez em "Abrir Orcamento" ou "Abrir O.S.".
create unique index if not exists uq_orcamentos_agendamento_oficina
  on public.orcamentos (agendamento_id, oficina_id)
  where agendamento_id is not null;

create unique index if not exists uq_ordens_servico_agendamento_oficina
  on public.ordens_servico (agendamento_id, oficina_id)
  where agendamento_id is not null;

-- 2) Funcao para virada do dia:
-- Marca como NAO_COMPARECEU todos os agendamentos antigos que ficaram AGUARDANDO.
create or replace function public.marcar_agendamentos_nao_compareceu()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  linhas_atualizadas integer;
begin
  update public.agendamentos
     set status = 'NAO_COMPARECEU'
   where servico_data < current_date
     and upper(coalesce(status, '')) in ('AGUARDANDO', 'A CONFIRMAR');

  get diagnostics linhas_atualizadas = row_count;
  return linhas_atualizadas;
end;
$$;

-- 3) Agendamento opcional com pg_cron, se a extensao estiver habilitada no projeto.
-- create extension if not exists pg_cron;
-- select cron.schedule(
--   'go-oficina-agendamentos-nao-compareceu',
--   '0 0 * * *',
--   $$select public.marcar_agendamentos_nao_compareceu();$$
-- );
