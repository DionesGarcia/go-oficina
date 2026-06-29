# Fluxo Visual da Ordem de Servico

## Objetivo

Documentar uma linha do tempo visual para a Ordem de Servico, permitindo que a oficina entenda rapidamente em qual etapa operacional cada atendimento esta e qual o percentual aproximado de progresso.

Este documento descreve apenas UX e regras visuais. Nao implementar ainda.

## Etapas da Linha do Tempo

A Ordem de Servico deve seguir a seguinte sequencia visual:

1. Recebido
2. Diagnostico
3. Orcamento enviado
4. Aguardando aprovacao
5. Em execucao
6. Testado
7. Cliente avisado
8. Entregue

## Conceito Visual

A linha do tempo deve representar o caminho da O.S. do recebimento ate a entrega. A leitura principal deve ser visual, com uma sequencia horizontal de etapas conectadas por uma linha discreta.

Cada etapa deve conter:

- um marcador visual, como circulo ou ponto;
- nome da etapa;
- estado visual por cor;
- opcionalmente, icone simples relacionado a etapa.

Em telas menores, a linha pode quebrar em mais de uma linha ou permitir rolagem horizontal, desde que a ordem das etapas continue clara.

## Regras de Cores

- Verde: etapa concluida.
- Amarelo: etapa atual.
- Cinza: etapa pendente.

As cores devem ser usadas como sinal operacional, nao como decoracao. O contraste precisa funcionar nos temas claro e escuro.

## Estados Visuais

### Concluido

Uma etapa concluida representa que a O.S. ja passou por aquele ponto do fluxo.

Regras visuais:

- marcador em verde;
- linha anterior em verde;
- texto com destaque moderado;
- icone, se houver, tambem em verde ou neutro com acento verde.

### Atual

A etapa atual representa onde a O.S. esta agora.

Regras visuais:

- marcador em amarelo;
- maior destaque visual que as etapas pendentes;
- texto com peso maior;
- pode ter uma borda, brilho leve ou fundo sutil;
- nao deve parecer alerta de erro.

### Pendente

Uma etapa pendente representa o que ainda falta acontecer.

Regras visuais:

- marcador em cinza;
- linha posterior em cinza;
- texto secundario;
- sem brilho ou destaque forte.

## Percentual de Progresso

O percentual de progresso deve representar o avanco da O.S. dentro das 8 etapas.

Regra conceitual:

```text
percentual = (indice_da_etapa_atual / total_de_etapas) * 100
```

Considerando as etapas numeradas de 1 a 8:

| Etapa | Percentual sugerido |
| --- | ---: |
| Recebido | 12.5% |
| Diagnostico | 25% |
| Orcamento enviado | 37.5% |
| Aguardando aprovacao | 50% |
| Em execucao | 62.5% |
| Testado | 75% |
| Cliente avisado | 87.5% |
| Entregue | 100% |

O percentual pode ser exibido como:

- barra fina de progresso acima ou abaixo da linha do tempo;
- texto discreto, por exemplo `62% concluido`;
- preenchimento parcial da linha conectora.

O numero nao deve competir com a etapa atual. Ele serve como apoio rapido para leitura gerencial.

## Comportamento Esperado

Ao abrir uma O.S., a tela deve mostrar:

- etapa atual em amarelo;
- etapas anteriores em verde;
- etapas futuras em cinza;
- percentual calculado conforme a etapa atual;
- visual limpo, sem excesso de cards.

Exemplo:

Se a O.S. estiver em `Em execucao`:

- Recebido, Diagnostico, Orcamento enviado e Aguardando aprovacao ficam verdes;
- Em execucao fica amarelo;
- Testado, Cliente avisado e Entregue ficam cinza;
- progresso sugerido: 62.5%.

## Observacoes de UX

- A linha do tempo deve priorizar clareza operacional.
- O usuario deve entender o gargalo sem ler textos longos.
- A etapa atual deve ser o ponto mais evidente.
- O componente deve funcionar em tema claro e escuro.
- Evitar aparencia de funil financeiro ou dashboard de vendas.
- Evitar cores muito saturadas em grandes areas.
- Em mobile, preservar legibilidade dos nomes das etapas.

## Pendencias para Implementacao Futura

- Mapear cada etapa visual para status reais existentes da O.S.
- Validar se todos os status necessarios existem no schema atual.
- Definir se `Orcamento enviado` e `Aguardando aprovacao` serao etapas separadas por status ou por eventos ja existentes.
- Definir se `Cliente avisado` sera manual, automatico ou integrado a WhatsApp/n8n.
- Definir onde o percentual sera exibido na tela de O.S.
- Garantir que nenhuma nova tabela ou campo seja criado sem aprovacao previa.
