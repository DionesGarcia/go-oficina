# Arquitetura - GO Oficina

Este documento descreve a arquitetura atual do projeto GO Oficina a partir dos arquivos existentes no repositório. Ele é apenas documental e não altera nenhuma funcionalidade.

## Visão geral

O projeto é uma aplicação web estática, composta por páginas HTML independentes, estilos CSS compartilhados e scripts JavaScript carregados diretamente no navegador. A persistência e autenticação são feitas via Supabase usando o SDK UMD em CDN.

Principais características:

- Frontend em HTML, CSS e JavaScript puro.
- Supabase inicializado em `js/config.js`.
- Componentes globais de navegação injetados por `js/components.js`.
- Tema escuro, fonte Inter na maioria das telas internas e ícones Lucide.
- Identificação da oficina ativa por parâmetro de URL `?id=`, com fallback para `1`.

## Estrutura de pastas

```text
GO oficina/
├── admin.html
├── agenda.html
├── agendar.html
├── ai-context.md
├── ARQUITETURA.md
├── checklists.html
├── clientes.html
├── config.html
├── default.php
├── financeiro.html
├── index.html
├── login.html
├── orcamentos.html
├── os.html
├── package-lock.json
├── recuperar.html
├── veiculos.html
├── css/
│   ├── buttons.css
│   ├── cards.css
│   ├── forms.css
│   ├── global.css
│   ├── layout.css
│   └── theme.css
└── js/
    ├── admin.js
    ├── components.js
    ├── config.js
    ├── dashboard.js
    ├── orcamento.js
    └── utils.js
```

## Páginas existentes

| Arquivo | Função principal |
| --- | --- |
| `index.html` | Painel de controle com KPIs, agendamentos do dia, orçamentos, O.S. abertas e itens para faturar. Usa `js/dashboard.js`. |
| `login.html` | Login administrativo via Supabase Auth com e-mail e senha. |
| `recuperar.html` | Recuperação de senha via Supabase Auth. |
| `agenda.html` | Gestão interna de agendamentos, criação de clientes, transição de status, criação de orçamento e O.S. a partir da agenda. |
| `agendar.html` | Página pública de agendamento online. Usa Supabase, máscaras com IMask e lógica própria embutida. |
| `clientes.html` | Cadastro/listagem de clientes e consulta de veículos/passagens vinculados. |
| `veiculos.html` | Cadastro/listagem de veículos vinculados a clientes. |
| `orcamentos.html` | Gestão, envio, aprovação e conversão de orçamentos em O.S. Usa também `js/orcamento.js`. |
| `os.html` | Gestão de ordens de serviço e itens de O.S. |
| `financeiro.html` | Gestão financeira simples baseada em recebimentos e O.S. |
| `checklists.html` | Checklist de entrada, fotos e associação com clientes, veículos e O.S. |
| `config.html` | Configurações da oficina/tenant e usuários da oficina. |
| `admin.html` | Administração SaaS das oficinas cadastradas. Usa `js/admin.js` e também contém lógica inline. |
| `default.php` | Página padrão/legada de hospedagem, aparentemente fora do fluxo principal da aplicação. |

## Scripts JavaScript

| Arquivo | Responsabilidade |
| --- | --- |
| `js/config.js` | Define `SUPABASE_URL`, `SUPABASE_KEY`, cria o cliente `db` com `supabase.createClient()` e define `OFICINA_ATIVA_ID` a partir de `?id=`. |
| `js/utils.js` | Funções compartilhadas de formatação de data, data atual, moeda e sistema centralizado de toast (`showToast`). |
| `js/components.js` | Injeta sidebar, topbar, overlay mobile, estado colapsado da sidebar, nome da oficina, usuário logado e logout. |
| `js/dashboard.js` | Controla o dashboard: KPIs, listas resumidas e sincronização com Supabase. |
| `js/orcamento.js` | Lógica compartilhada de orçamento, incluindo carregamento, impressão, edição, salvamento e itens. |
| `js/admin.js` | Lógica da página de administração SaaS: lista oficinas/tenants e navega para painel/configuração. |

## Tabelas Supabase utilizadas

As tabelas abaixo aparecem em chamadas `db.from(...)` ao longo das páginas e scripts:

| Tabela | Uso observado |
| --- | --- |
| `configuracoes_saas` | Dados da oficina/tenant, nome exibido na topbar, configurações gerais, listagem administrativa SaaS. |
| `usuarios_oficina` | Gestão de usuários vinculados à oficina em `config.html`. |
| `clientes` | Cadastro, consulta e relacionamento com veículos, agendamentos, checklists, orçamentos e O.S. |
| `veiculos` | Cadastro, consulta e relacionamento com clientes, agendamentos, checklists, orçamentos e O.S. |
| `agendamentos` | Agenda interna, agendamento público, dashboard, histórico de clientes e origem de orçamentos/O.S. |
| `orcamentos` | Gestão de orçamentos, status, envio, aprovação e conversão em O.S. |
| `orcamento_itens` | Itens vinculados a orçamentos. |
| `ordens_servico` | O.S. principal usada no dashboard, financeiro, checklists, orçamentos e `os.html`. |
| `ordem_servico_itens` | Itens vinculados a O.S. em `os.html` e conversão de orçamento. |
| `recebimentos` | Lançamentos financeiros e vínculo com O.S. |
| `checklists_entrada` | Registro dos checklists de entrada. |
| `checklist_fotos` | Metadados de fotos de checklist. |
| `checklist-fotos` | Também aparece em `checklists.html` como origem de dados; o nome com hífen sugere tabela ou possível confusão com bucket/storage. |
| `ordem_servico` | Aparece em `agenda.html` ao criar O.S. a partir de orçamento. Difere de `ordens_servico` e pode indicar fluxo legado ou inconsistência. |
| `os_itens` | Aparece em `agenda.html` junto com `ordem_servico`. Difere de `ordem_servico_itens` e pode indicar fluxo legado ou inconsistência. |

Observações importantes:

- O padrão dominante para O.S. é `ordens_servico` + `ordem_servico_itens`.
- `agenda.html` também usa `ordem_servico` + `os_itens`, nomes diferentes do restante do projeto.
- A maioria das consultas filtra por `oficina_id = OFICINA_ATIVA_ID`, reforçando o modelo multi-oficina/tenant.
- Há uso frequente de joins aninhados do Supabase, como `clientes(nome)` e `veiculos(marca, modelo, placa)`.

## Fluxo de autenticação

O fluxo de autenticação é baseado em Supabase Auth.

1. `js/config.js` carrega o SDK global `supabase`, cria o cliente `db` e deixa esse cliente disponível para as páginas.
2. `login.html` chama `db.auth.signInWithPassword({ email, password })`.
3. Em caso de sucesso, o usuário é redirecionado para `index.html?id=1`.
4. `recuperar.html` chama `db.auth.resetPasswordForEmail(email, { redirectTo })` para iniciar recuperação de senha.
5. `js/components.js` chama `db.auth.getUser()` para exibir o usuário logado na topbar.
6. O logout é feito por `db.auth.signOut()` em `fazerLogout()`, redirecionando para `login.html`.

Pontos observados:

- Não há, nos arquivos analisados, um guard global explícito impedindo acesso às páginas internas sem sessão.
- A sidebar/topbar assumem a existência de `db`, `OFICINA_ATIVA_ID` e, nas telas internas, `.main-content`.
- `fazerLogout()` usa `confirm()` nativo antes de sair.

## Componentes compartilhados

### Sidebar e topbar globais

Implementados em `js/components.js` e injetados no `DOMContentLoaded`.

Incluem:

- Sidebar lateral com links para Painel, Agenda, Orçamentos, Ordens de Serviço, Financeiro, Clientes, Veículos, Admin SaaS e Configurações.
- Estado colapsado persistido em `localStorage` na chave `sidebar-collapsed`.
- Overlay e menu mobile.
- Topbar dentro de `.main-content`.
- Nome da oficina carregado de `configuracoes_saas.nome_oficina`.
- Nome do usuário carregado via `db.auth.getUser()`.
- Botão de logout.

### Utilitários globais

Implementados em `js/utils.js`:

- `formatarDataBR(dataStr)`
- `obterDataString(diasDeDiferenca)`
- `formatarMoeda(valor)`
- `showToast(mensagem, tipo)`

### Componentes CSS comuns

Em `css/global.css`:

- `.sidebar`, `.global-topbar`, `.main-content`
- `.panel-card`, `.panel-card-header`, `.panel-card-body`
- `.row-item`, `.badge`
- `.kpi-grid`, `.kpi-card`, `.kpi-value`, `.kpi-label`
- `.form-group`, `.form-control`
- `.modal-overlay`, `.modal-card`
- `.toast-container`, `.toast`

Em arquivos legados/modulares:

- `css/buttons.css`: `.btn`, `.btn-primary`, `.btn-secondary`, badges administrativos.
- `css/forms.css`: `.form-label`, `.input-saas`, `.input-wrap`.
- `css/cards.css`: cards SaaS, métricas, calendário horizontal e tickets.
- `css/layout.css`: layout público e layout de configuração.
- `css/theme.css`: tokens de tema alternativo/legado.

## Padrões CSS utilizados

### Tema global atual

O padrão mais usado nas páginas internas é `css/global.css`, com:

- Tema escuro.
- Variáveis CSS em `:root`.
- Fonte `Inter`.
- Cores principais:
  - Fundo: `--bg-main`, `--bg-sidebar`, `--bg-card`
  - Borda: `--border-color`
  - Destaques: `--brand-orange`, `--brand-yellow`, `--brand-blue`, `--brand-green`
  - Texto: `--text-main`, `--text-bright`, `--text-muted`
- Layout principal com `body` em `display: flex`.
- Conteúdo interno em `.main-content`.
- Cards e painéis com borda fina, raio pequeno/médio e fundos escuros.
- Responsividade mobile via `@media (max-width: 768px)`.

### Tema legado/modular

Também existe um conjunto modular com `theme.css`, `buttons.css`, `forms.css`, `cards.css` e `layout.css`.

Esse conjunto usa:

- Fonte `Barlow`.
- Variáveis como `--bg-main`, `--bg-surface`, `--bg-input`, `--orange`, `--green-tech`, `--radius-md`.
- Classes com sufixo SaaS, como `.card-saas`, `.metrics-saas-grid`, `.input-saas`, `.card-ticket-saas`.

### Estilos inline por página

Várias páginas possuem blocos `<style>` próprios além do `css/global.css`. Esses estilos definem ajustes específicos de tela, como:

- Layout de tabelas e painéis.
- Modais/drawers específicos.
- Grades de cards.
- Ajustes de `.main-content`.
- Estados visuais de status.

## Convenções arquiteturais atuais

- Cada página HTML contém seu próprio markup e, em muitos casos, sua própria lógica inline.
- Scripts compartilhados são carregados por `<script>` em cada página.
- Telas internas geralmente carregam nesta ordem: Lucide, Supabase SDK, `js/config.js`, `js/utils.js`, `js/components.js` e depois scripts específicos.
- A navegação entre telas preserva o tenant com `?id=${OFICINA_ATIVA_ID}`.
- Toasts são o mecanismo compartilhado de notificação.
- Ícones são renderizados via Lucide com `data-lucide`.
- Consultas Supabase usam o cliente global `db`.

## Pontos de atenção técnicos

- Há nomes divergentes para tabelas de O.S.: `ordens_servico`/`ordem_servico_itens` e `ordem_servico`/`os_itens`.
- `checklists.html` usa tanto `checklist_fotos` quanto `checklist-fotos`.
- Nem todas as telas parecem ter proteção explícita de autenticação antes de executar consultas.
- Existem estilos globais e legados convivendo, com tokens diferentes.
- Algumas telas concentram JavaScript inline extenso, enquanto outras usam arquivos dedicados em `js/`.
