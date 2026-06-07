# PRD & Diretrizes de Desenvolvimento - GO Oficina v1.0

## 1. Visão Geral e Identidade
* **Empresa Mãe:** Garcia One
* **Produto:** GO Oficina
* **Slogan:** Menos sistema. Mais oficina.
* **Marca nas Telas:** Sempre utilizar o nome "GO Oficina" na logo, títulos e rodapés.
* **Identidade Visual:** Tema escuro (Dark Mode), contrastes em laranja premium, fonte Inter e ícones da biblioteca Lucide. Estilos centralizados estritamente em `css/global.css`.

## 2. Escopo do MVP (Foco Atual)
A IA deve focar única e exclusivamente nas funcionalidades do MVP. Não criar telas ou lógicas das Versões 2, 3 ou PRO sem ordem expressa.
* **Módulos do MVP:** Agendamento, Clientes, Veículos, Checklist Fotográfico/Jurídico, Ordem de Serviço (O.S.), Financeiro Simples, Notificações via WhatsApp (Integração N8N).

## 3. Arquitetura Técnica e Banco de Dados (Supabase)
Para evitar quebras de lógica, siga à risca a estrutura de dados:
* **Tabela `clientes`:** `id`, `nome`, `cpf_cnpj`, `whatsapp`, `telefone`, `endereco`.
* **Tabela `veiculos`:** `id`, `marca`, `modelo`, `ano`, `placa`, `cor`, `quilometragem`, `cliente_id` (Foreign Key -> `clientes.id`).
* **Relacionamentos (JOINs):** Toda listagem de veículos ou O.S. na Dashboard deve OBRIGATORIAMENTE trazer os dados aninhados do cliente. Nunca exibir "Cliente não identificado". Exemplo: `supabase.from('veiculos').select('*, clientes(nome)')`.
* **Contadores da Dashboard:** Os 4 cards principais (Agendamentos Hoje, Em Orçamento, O.S. Abertas, Finalizados) devem iniciar em 0 e buscar dados reais do Supabase. Proibido colocar valores fictícios (hardcoded) no HTML.

## 4. Integrações e Automações (N8N / WhatsApp)
* O sistema não envia mensagens diretamente. Ele deve disparar Webhooks para o **N8N**, que atuará como o motor de automação para o WhatsApp.
* **Eventos disparadores de Webhook:** Novo agendamento, Veículo recebido (Check-in), Orçamento enviado/aprovado, O.S. aberta/concluída, Pagamento recebido, Estoque baixo.

## 5. Restrições Críticas
* **PROIBIDO** alterar o arquivo `agendar.html` ou sua lógica de agendamentos sem permissão.
* **PROIBIDO** o uso de `alert()` nativo do navegador. Utilize exclusivamente o sistema de Toasts centralizado: `showToast("Mensagem", "success/error/info")` localizado em `js/utils.js`.
* O menu lateral (Sidebar) deve ser injetado dinamicamente em todas as telas através do script `js/components.js`.