# Roadmap - GO Oficina

Este roadmap consolida o estado atual do projeto com base em `ARQUITETURA.md`, `DESENVOLVIMENTO.md` e leitura dos arquivos existentes. Ele deve orientar proximas tarefas pequenas, preservando os padroes atuais.

## Alta prioridade

### Funcionalidades prontas

- Dashboard principal em `index.html` com KPIs e listas resumidas via `js/dashboard.js`.
- Login administrativo em `login.html` usando Supabase Auth.
- Recuperacao de senha em `recuperar.html` usando Supabase Auth.
- Cadastro/listagem de clientes em `clientes.html`.
- Cadastro/listagem de veiculos em `veiculos.html`.
- Agenda interna em `agenda.html`.
- Agendamento publico em `agendar.html`.
- Gestao de orcamentos em `orcamentos.html` com apoio de `js/orcamento.js`.
- Gestao de O.S. em `os.html` usando `ordens_servico` e `ordem_servico_itens`.
- Financeiro simples em `financeiro.html` usando `recebimentos` e `ordens_servico`.
- Checklists de entrada em `checklists.html`.
- Configuracoes da oficina em `config.html`.
- Componentes globais de sidebar/topbar em `js/components.js`.
- Utilitarios globais em `js/utils.js`.
- Cliente Supabase centralizado em `js/config.js`.

### Funcionalidades incompletas

- Impressao de O.S. em `os.html` ainda aparece como "sera implementada na proxima etapa".
- Admin SaaS ainda tem fluxo misto: `admin.html` possui logica inline e tambem usa `js/admin.js`.
- Dados de ultimo pagamento e ultimo login no Admin ainda aparecem como valores fixos ou `N/A`.
- Contagem de usuarios no Admin permanece como mock legado protegido em `js/admin.js`.
- Integracao N8N/WhatsApp esta prevista nas diretrizes, mas nao aparece como camada central consolidada.

### Bugs conhecidos

- `agenda.html` ainda cria O.S. usando tabelas legadas `ordem_servico` e `os_itens`, enquanto o padrao oficial e `ordens_servico` e `ordem_servico_itens`.
- `checklists.html` usa tanto `checklist-fotos` quanto `checklist_fotos`, o que indica inconsistencia entre tabela/bucket/storage.
- Nao ha guard global claro de autenticacao para impedir acesso direto as telas internas sem sessao.
- `admin.html` ainda usa `prompt()` e `alert()` no gatekeeper, apesar do padrao geral recomendar `showToast()`.
- `config.html` ainda usa `alert()` no fluxo de mudanca de plano.
- `agendar.html` tem fallbacks com `alert()` quando `showToast()` nao existe.

### Pendencias tecnicas

- Definir oficialmente se `checklist-fotos` e tabela, bucket de storage ou legado.
- Migrar ou isolar fluxos legados de O.S. em `agenda.html`.
- Criar estrategia de protecao de rotas/telas internas com Supabase Auth.
- Revisar RLS no Supabase, pois o frontend usa chave anon publica.
- Reduzir divergencia entre logica inline de `admin.html` e `js/admin.js`.

### Melhorias futuras

- Criar fluxo unico e documentado para abertura de O.S. a partir de agenda, orcamento e checklist.
- Centralizar integracoes de WhatsApp/N8N em funcoes compartilhadas.
- Criar verificacao manual padronizada para login, agenda, orcamento, O.S. e financeiro.

## Media prioridade

### Funcionalidades prontas

- Navegacao interna preservando `?id=${OFICINA_ATIVA_ID}` nas telas que usam `js/components.js`.
- Renderizacao de icones Lucide nas telas internas.
- Toasts centralizados via `showToast()`.
- Configuracao multi-oficina via `configuracoes_saas`.
- Filtros e renderizacoes locais em clientes, veiculos, orcamentos, O.S. e financeiro.

### Funcionalidades incompletas

- `admin.html` possui gatekeeper local, mas nao esta integrado ao fluxo padrao de autenticacao/permissao.
- Modulos de assinatura/plano aparecem em `config.html` e Admin, mas sem checkout real consolidado.
- Dashboard mostra informacoes operacionais, mas ainda nao ha camada formal de alertas reais.
- Historico financeiro depende dos campos disponiveis nas O.S. e recebimentos; precisa validacao de schema.

### Bugs conhecidos

- Existem estilos globais e legados convivendo: `global.css` e arquivos modulares antigos.
- Algumas paginas tem muito CSS inline, o que dificulta padronizacao.
- Algumas paginas tem JavaScript inline extenso, dificultando manutencao.
- `default.php` parece pagina legada de hospedagem e nao pertence ao fluxo principal.

### Pendencias tecnicas

- Documentar schema real do Supabase com campos obrigatorios por tabela.
- Confirmar campos oficiais de `configuracoes_saas` para Admin, Configuracoes e pagina publica.
- Padronizar nomes de status entre agenda, orcamentos e O.S.
- Validar colunas de data usadas em metricas, como `created_at`, `criado_em`, `concluido_em` e `servico_data`.
- Definir quais telas devem carregar `js/components.js` e quais devem permanecer independentes.

### Melhorias futuras

- Mover gradualmente scripts inline para arquivos em `js/`.
- Mover estilos repetidos para `css/global.css` quando houver seguranca.
- Criar helpers compartilhados para formatacao de status, telefone, placa e datas.
- Melhorar feedback visual de estados vazios e erros de sincronizacao.

## Baixa prioridade

### Funcionalidades prontas

- Documentacao inicial em `ARQUITETURA.md`.
- Guia de desenvolvimento em `DESENVOLVIMENTO.md`.
- Identidade visual escura com Inter e Lucide na maior parte das telas.
- Sidebar colapsavel com estado em `localStorage`.

### Funcionalidades incompletas

- Admin SaaS ainda possui dados de exemplo/fallback no HTML.
- Alguns botaoes e acoes administrativas nao possuem fluxo completo.
- Informacoes comerciais de planos ainda parecem demonstrativas.

### Bugs conhecidos

- Alguns textos e comentarios aparecem com problemas de codificacao em arquivos existentes.
- `package-lock.json` existe, mas nao ha dependencias npm efetivas ou scripts de build/teste.
- Alguns titulos/textos usam variacoes de marca como `GOOFICINA` e `GO Oficina`.

### Pendencias tecnicas

- Decidir se o projeto continuara 100% estatico ou se tera build/testes.
- Padronizar codificacao dos arquivos para evitar caracteres quebrados.
- Revisar arquivos CSS legados e decidir o que deve permanecer.
- Avaliar se `default.php` deve ser removido, arquivado ou ignorado.

### Melhorias futuras

- Criar checklist de QA manual por modulo.
- Criar documentacao de deploy/hospedagem.
- Criar changelog simples para registrar correcoes.
- Padronizar textos de interface e marca.
- Criar testes de smoke para scripts principais, se o projeto adotar runtime local.

## Ordem sugerida de execucao

1. Corrigir inconsistencias de tabelas oficiais versus legadas em fluxos criticos.
2. Implementar guard de autenticacao para telas internas.
3. Consolidar Admin SaaS, mantendo o layout atual.
4. Validar schema Supabase e documentar campos oficiais.
5. Reduzir JavaScript inline nos modulos mais sensiveis.
6. Padronizar CSS gradualmente sem redesenhar telas.
7. Formalizar integracoes WhatsApp/N8N.
8. Criar rotina de testes manuais por tela.
