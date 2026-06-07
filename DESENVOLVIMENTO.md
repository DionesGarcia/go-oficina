# Desenvolvimento - GO Oficina

Este documento define convencoes para futuras alteracoes no projeto GO Oficina. Ele deve ser lido junto com `ARQUITETURA.md` antes de qualquer mudanca no codigo.

## Convencoes de nomenclatura

### Arquivos

- Paginas devem usar nomes em minusculo, sem acentos, no formato `modulo.html`.
- Scripts compartilhados ficam em `js/`.
- Estilos compartilhados ficam em `css/`.
- Nao criar nova pagina quando uma tela existente puder ser ajustada de forma pequena e segura.

Exemplos existentes:

- `index.html`
- `agenda.html`
- `orcamentos.html`
- `os.html`
- `financeiro.html`
- `js/config.js`
- `js/components.js`
- `js/utils.js`

### JavaScript

- Funcoes usam `camelCase`.
- Variaveis usam `camelCase`.
- Constantes globais usam `UPPER_SNAKE_CASE`.
- IDs de elementos HTML usam kebab-case.
- Classes CSS usam kebab-case.

Exemplos:

- `OFICINA_ATIVA_ID`
- `carregarDadosAdmin()`
- `renderizarComponentesGlobais()`
- `showToast()`
- `main-content`
- `tabela-oficinas-corpo`

### Supabase

- Tabelas usam `snake_case`.
- Consultas devem usar o cliente global `db`.
- Sempre preservar filtro por `oficina_id = OFICINA_ATIVA_ID` quando a tela for multi-oficina.
- Relacionamentos aninhados devem seguir o padrao Supabase, como `clientes(nome)` e `veiculos(marca, modelo, placa)`.

## Padrao de paginas

As paginas internas geralmente seguem esta estrutura:

1. `<!DOCTYPE html>` e `<html lang="pt-BR">`.
2. Metas basicas.
3. Titulo com GO Oficina.
4. Fontes e icones.
5. Supabase JS v2 via CDN.
6. `js/config.js`.
7. `js/utils.js`, quando usar toasts ou formatadores.
8. `js/components.js`, quando a pagina deve receber sidebar/topbar globais.
9. Script especifico da pagina, quando existir.
10. `css/global.css`.
11. Estilos inline apenas quando forem especificos da pagina e nao houver alternativa segura.
12. `<main class="main-content">` nas telas internas que usam componentes globais.

Ordem recomendada de scripts para paginas internas:

```html
<script src="https://unpkg.com/lucide@latest"></script>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js"></script>
<script src="js/config.js"></script>
<script src="js/utils.js"></script>
<script src="js/components.js"></script>
<script src="js/script-da-pagina.js"></script>
```

Observacoes:

- `admin.html` tem gatekeeper proprio e layout proprio; nao inserir `js/components.js` nele sem autorizacao, pois isso altera o layout.
- `agendar.html` e uma pagina publica e tem padrao proprio. Nao alterar sem permissao explicita.
- `login.html` e `recuperar.html` nao usam sidebar/topbar globais.

## Padrao CSS

### Fonte principal

- Usar `Inter` como fonte principal nas telas atuais.
- Evitar introduzir novas fontes.

### Arquivo preferencial

- Preferir `css/global.css` para estilos compartilhados.
- Usar estilos inline ou `<style>` por pagina somente para ajustes locais e pequenos.
- Nao duplicar classes globais se ja houver componente equivalente.

### Tema atual

Usar as variaveis de `css/global.css`:

- `--bg-main`
- `--bg-sidebar`
- `--bg-card`
- `--border-color`
- `--brand-orange`
- `--brand-yellow`
- `--brand-blue`
- `--brand-green`
- `--brand-whatsapp`
- `--brand-highlight`
- `--text-main`
- `--text-bright`
- `--text-muted`

### Componentes CSS comuns

Preferir classes existentes:

- `.main-content`
- `.sidebar`
- `.global-topbar`
- `.panel-card`
- `.panel-card-header`
- `.panel-card-body`
- `.row-item`
- `.badge`
- `.kpi-grid`
- `.kpi-card`
- `.form-group`
- `.form-control`
- `.modal-overlay`
- `.modal-card`
- `.toast`

### CSS legado

Arquivos como `theme.css`, `buttons.css`, `forms.css`, `cards.css` e `layout.css` existem, mas representam um padrao modular/legado. Evitar ampliar esse padrao sem necessidade.

## Padrao de JS

### Scripts compartilhados

- `js/config.js`: configuracao Supabase e `OFICINA_ATIVA_ID`.
- `js/utils.js`: formatadores e `showToast()`.
- `js/components.js`: sidebar/topbar globais.
- `js/dashboard.js`: dashboard.
- `js/orcamento.js`: logica compartilhada de orcamentos.
- `js/admin.js`: logica administrativa SaaS.

### Eventos

- Inicializar paginas com `DOMContentLoaded`.
- Evitar executar consultas antes de `js/config.js` carregar.
- Recriar icones com `lucide.createIcons()` apos renderizar HTML dinamico.

### Notificacoes

- Usar `showToast(mensagem, tipo)`.
- Evitar `alert()` nativo em novas alteracoes.
- Se existir `alert()` legado, nao trocar fora do escopo da tarefa.

### Escopo de alteracoes

- Preferir alteracoes pequenas e localizadas.
- Nao reescrever pagina inteira.
- Nao misturar refatoracao com correcao funcional.
- Se uma pagina tem JS inline, alterar somente o trecho necessario.
- Se um script externo ja existe para a pagina, preferir ajustar o script externo antes de mexer no HTML.

## Padrao Supabase

### Cliente

- Usar sempre o cliente global `db`.
- O cliente e criado em `js/config.js`.
- Nao criar novo `supabase.createClient()` em paginas individuais.

### Oficina ativa

- Usar `OFICINA_ATIVA_ID` para filtrar dados por oficina.
- Preservar `?id=` na navegacao entre paginas internas.

### Consultas

- Manter os nomes de tabelas existentes.
- Nao alterar tabelas Supabase sem explicar antes.
- Nao trocar uma tabela oficial por uma legada.
- Preferir `select()` explicito quando a tela nao precisa de todos os campos.
- Em telas com relacionamentos, manter joins aninhados quando ja existirem.

Exemplo:

```js
const { data, error } = await db
    .from('ordens_servico')
    .select('*, clientes(nome), veiculos(marca, modelo, placa)')
    .eq('oficina_id', OFICINA_ATIVA_ID);
```

### Autenticacao

- Login usa `db.auth.signInWithPassword()`.
- Recuperacao usa `db.auth.resetPasswordForEmail()`.
- Logout usa `db.auth.signOut()`.
- `js/components.js` usa `db.auth.getUser()` para preencher o usuario da topbar.

## Tabelas oficiais

Estas tabelas devem ser consideradas o padrao principal do projeto atual:

- `configuracoes_saas`
- `usuarios_oficina`
- `clientes`
- `veiculos`
- `agendamentos`
- `orcamentos`
- `orcamento_itens`
- `ordens_servico`
- `ordem_servico_itens`
- `recebimentos`
- `checklists_entrada`
- `checklist_fotos`

## Tabelas legadas ou inconsistentes

Estas tabelas aparecem no codigo, mas devem ser tratadas com cuidado por divergirem do padrao dominante:

- `ordem_servico`
- `os_itens`
- `checklist-fotos`

Regras para tabelas legadas:

- Nao ampliar uso sem autorizacao.
- Nao migrar fluxo para elas sem confirmar schema e impacto.
- Em novas correcoes de O.S., preferir `ordens_servico` e `ordem_servico_itens`.
- Em novas correcoes de fotos de checklist, preferir `checklist_fotos`, salvo se for confirmado que `checklist-fotos` e bucket/storage.

## Regras para futuras alteracoes

Antes de alterar qualquer arquivo:

1. Ler `ARQUITETURA.md`.
2. Entender a pagina e o script afetados.
3. Identificar se a alteracao toca Supabase.
4. Explicar antes se houver mudanca em tabela, coluna, query ou fluxo de autenticacao.
5. Trabalhar em tarefa pequena.

Durante a alteracao:

- Preservar layout existente.
- Preservar padroes de CSS e JS.
- Nao recriar paginas do zero sem autorizacao.
- Nao alterar tabelas Supabase sem autorizacao.
- Nao trocar nomes de IDs/classes sem verificar os scripts que dependem deles.
- Nao remover gatekeepers, protecoes ou fluxos existentes sem autorizacao.
- Nao misturar correcao com melhoria visual.
- Nao alterar `agendar.html` sem permissao explicita.

Ao finalizar, informar:

- Arquivos alterados.
- O que mudou.
- Riscos possiveis.
- Como testar.

## Checklist rapido antes de salvar

- A pagina ainda carrega `js/config.js` antes de usar `db`?
- O script usa IDs que existem no HTML?
- Alguma query perdeu `oficina_id`?
- Alguma tabela oficial foi trocada por tabela legada?
- O layout foi preservado?
- `showToast()` foi usado em vez de novo `alert()`?
- `lucide.createIcons()` e chamado apos HTML dinamico com icones?
- A alteracao ficou restrita ao escopo pedido?
