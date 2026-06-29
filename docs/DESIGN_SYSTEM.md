# GO Oficina Design System

A tela Painel e o Radar Operacional sao a referencia visual do produto.

## Tokens

### Border Radius

| Token | Valor | Uso |
| --- | ---: | --- |
| `--radius-xs` | `6px` | badges e tags |
| `--radius-sm` | `10px` | botoes, inputs, selects e filtros |
| `--radius-md` | `14px` | cards, tabelas, widgets e sidebar |
| `--radius-lg` | `18px` | modais e drawers |

Status sempre usa pill completo: `999px`.

### Espacamento

Use apenas a escala:

`4, 8, 12, 16, 24, 32`

Tokens:

`--space-1` a `--space-6`.

### Sombras

Use apenas:

`--shadow-sm`, `--shadow-md`, `--shadow-lg`

Evite sombras customizadas por tela.

## Status

Todo status deve usar:

```html
<span class="status-badge status-success">Aprovado</span>
```

Variacoes oficiais:

| Classe | Cor | Uso |
| --- | --- | --- |
| `status-success` | verde | concluida, entregue, aprovado, finalizada |
| `status-warning` | amarelo | aguardando peca, pendente |
| `status-info` | azul | aberta, em aberto, enviado |
| `status-danger` | vermelho | cancelada, reprovada |
| `status-neutral` | cinza | rascunho e estados indefinidos |

O componente e sempre transparente, com borda de 1px e texto colorido.

## Botoes

| Tipo | Classe | Uso |
| --- | --- | --- |
| Primary | `btn-primary` | acao principal, verde |
| Secondary | `btn-secondary` | acao secundaria, borda verde |
| Danger | `btn-danger` | acao destrutiva, vermelho |

## Titulos

| Nivel | Uso |
| --- | --- |
| `h1` ou `.page-title` | titulo da pagina |
| `h2` ou `.section-title` | titulo de secao |
| `h3` ou `.card-title` | titulo de card |

## Regras

- Novas telas devem carregar `css/global.css` e `css/design-system.css`.
- Nao criar estilos locais para `.status-badge`.
- Nao usar valores aleatorios de radius, sombra ou espacamento.
- O Painel continua sendo a referencia visual para novas composicoes.
