/**
 * Controle de Orçamentos
 * Gerencia a criação, edição e persistência de orçamentos no Supabase
 */

let itensOrcamento = [];
let agendamentoSelecionado = null;
let orcamentoEmEdicaoId = null;

/**
 * Imprime o orçamento em formato profissional
 */
async function imprimirOrcamento(orcId) {
    try {
        showToast("Gerando visualização de impressão...", "info");
        
        // 1. Busca dados do orçamento, cliente e veículo
        const { data: orc, error: errOrc } = await db.from('orcamentos')
            .select('*, clientes(*), veiculos(*), orcamento_itens(*)')
            .eq('id', orcId)
            .single();

        if (errOrc) throw errOrc;

        // 2. Busca dados da oficina (Perfil)
        const { data: config } = await db.from('configuracoes_saas')
            .select('*')
            .eq('id', OFICINA_ATIVA_ID)
            .maybeSingle();

        const nomeOficina = config?.nome_oficina || 'GO Oficina';
        const cnpjOficina = config?.cnpj || '';
        const enderecoOficina = config?.['endereço'] || config?.endereco || '';
        const foneOficina = config?.telefone || '';
        const formasPagamento = config?.formas_pagamento || 'Pix, Cartão de Crédito/Débito, Dinheiro';

        // Cria container de impressão se não existir
        let printArea = document.getElementById('print-area-container');
        if (!printArea) {
            printArea = document.createElement('div');
            printArea.id = 'print-area-container';
            printArea.className = 'print-area';
            document.body.appendChild(printArea);
        }

        const dataOrc = new Date(orc.created_at).toLocaleDateString('pt-BR');
        const statusOrc = (orc.status || '').toLowerCase();
        
        let itensHtml = '';
        let totalPecas = 0;
        let totalServicos = 0;

        orc.orcamento_itens.forEach(item => {
            if (item.tipo === 'peça') totalPecas += item.valor_total;
            else totalServicos += item.valor_total;

            itensHtml += `
                <tr>
                    <td>${item.tipo.toUpperCase()}</td>
                    <td>${item.descricao}</td>
                    <td>${item.quantidade}</td>
                    <td>${formatarMoeda(item.valor_unitario)}</td>
                    <td class="col-total">${formatarMoeda(item.valor_total)}</td>
                </tr>
            `;
        });

        // Lógica de Rodapé Jurídico
        let rodapeJuridicoHtml = '';
        if (statusOrc === 'aprovado') {
            rodapeJuridicoHtml = `
                <div class="digital-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    Autenticado Digitalmente via GO Oficina
                </div>
            `;
        } else {
            rodapeJuridicoHtml = `
                <div class="signature-line"></div>
                <div class="signature-label">Assinatura do Cliente (Aceite de Orçamento)</div>
            `;
        }

        // Formatação do Ano e KM
        const anoTexto = orc.veiculos?.ano ? orc.veiculos.ano : '—';
        const kmTexto = orc.veiculos?.quilometragem ? `${orc.veiculos.quilometragem.toLocaleString('pt-BR')} KM` : '—';

        printArea.innerHTML = `
            <div class="print-header">
                <div class="print-logo">
                    <div class="workshop-name" style="font-size: 18px; font-weight: 600; color: #475569;">${nomeOficina}</div>
                    <div class="workshop-cnpj">CNPJ: ${cnpjOficina}</div>
                    <div class="workshop-address" style="font-size: 11px; color: #64748b; margin-top: 2px; font-weight: 500;">${enderecoOficina} ${foneOficina ? ' — ' + foneOficina : ''}</div>
                </div>
                <div class="print-title">
                    <h2 style="font-size: 28px; letter-spacing: 0.05em;">ORÇAMENTO</h2>
                    <div class="doc-number" style="font-weight:800; font-size:14px; color: #1e293b;">#${orc.id.toString().padStart(4, '0')} — ${dataOrc}</div>
                </div>
            </div>

            <div class="print-info-grid">
                <div class="print-info-box">
                    <h4>Dados do Cliente</h4>
                    <p><span>Nome:</span> ${orc.clientes?.nome || 'Não identificado'}</p>
                    <p><span>Telefone:</span> ${orc.clientes?.telefone || '—'}</p>
                    <p><span>Email:</span> ${orc.clientes?.email || '—'}</p>
                </div>
                <div class="print-info-box">
                    <h4>Dados do Veículo</h4>
                    <p><span>Veículo:</span> ${orc.veiculos?.marca || ''} ${orc.veiculos?.modelo || ''}</p>
                    <p><span>Placa:</span> ${orc.veiculos?.placa ? orc.veiculos.placa.toUpperCase() : '—'}</p>
                    <p><span>Ano:</span> ${anoTexto} &nbsp;&nbsp; <span>KM:</span> ${kmTexto}</p>
                </div>
            </div>

            <table class="print-table">
                <thead>
                    <tr>
                        <th style="width:80px;">Tipo</th>
                        <th>Descrição do Item/Serviço</th>
                        <th style="width:60px;">Qtd</th>
                        <th style="width:120px;">V. Unitário</th>
                        <th style="width:120px; text-align:right;">V. Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itensHtml}
                </tbody>
            </table>

            <div class="print-footer-container">
                <div class="print-totals-payment">
                    <div class="payment-methods-box">
                        <h5>Formas de Pagamento</h5>
                        <div class="payment-list">
                            ${formasPagamento.split(',').map(f => `<span class="payment-tag">${f.trim()}</span>`).join('')}
                        </div>
                        <p style="font-size: 11px; color: #94a3b8; margin-top: 15px; line-height: 1.4;">
                            * Orçamento válido por 5 dias. Os valores de peças podem sofrer alteração sem aviso prévio caso não haja o aceite imediato.
                        </p>
                    </div>
                    
                    <div class="totals-box">
                        <div class="total-row">
                            <span>Total em Peças:</span>
                            <span>${formatarMoeda(totalPecas)}</span>
                        </div>
                        <div class="total-row">
                            <span>Total em Serviços:</span>
                            <span>${formatarMoeda(totalServicos)}</span>
                        </div>
                        <div class="total-row grand-total">
                            <span>TOTAL GERAL:</span>
                            <span class="val">${formatarMoeda(orc.valor_total)}</span>
                        </div>
                    </div>
                </div>

                <div class="legal-footer">
                    ${rodapeJuridicoHtml}
                </div>
                
                <div style="margin-top: 40px; text-align: center; font-size: 10px; color: #cbd5e1; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;">
                    Gerado via GO Oficina — Sistema de Gestão Automotiva
                </div>
            </div>
        `;

        setTimeout(() => {
            window.print();
        }, 500);

    } catch (e) {
        console.error(e);
        showToast("Erro ao gerar impressão", "error");
    }
}

/**
 * Carrega dados de um orçamento para edição
 */
async function editarOrcamento(orcId) {
    try {
        showToast("Carregando dados para edição...", "info");
        
        const { data: orc, error: errOrc } = await db.from('orcamentos')
            .select('*, clientes(nome, telefone), veiculos(marca, modelo, placa, ano), orcamento_itens(*)')
            .eq('id', orcId)
            .single();

        if (errOrc) throw errOrc;

        orcamentoEmEdicaoId = orc.id;
        agendamentoSelecionado = {
            id: orc.agendamento_id,
            cliente_id: orc.cliente_id,
            veiculo_id: orc.veiculo_id,
            clientes: orc.clientes,
            veiculos: orc.veiculos
        };

        // Popula itens
        itensOrcamento = orc.orcamento_itens.map(item => ({
            id_temp: Date.now() + Math.random(),
            tipo: item.tipo,
            descricao: item.descricao,
            quantidade: item.quantidade,
            valor_unitario: item.valor_unitario,
            valor_total: item.valor_total
        }));

        // Atualiza UI do Modal
        document.getElementById('orc-resumo-cliente').innerText = orc.clientes?.nome || 'Não identificado';
        document.getElementById('orc-resumo-veiculo').innerText = orc.veiculos ? `${orc.veiculos.marca} ${orc.veiculos.modelo} [${orc.veiculos.placa.toUpperCase()}]` : 'Veículo não informado';
        document.getElementById('orc-obs').value = orc.observacoes || '';

        // Muda título do modal e texto do botão
        const modalHeader = document.querySelector('.modal-header h3');
        const saveBtn = document.querySelector('.btn-save-orcamento');
        if (modalHeader) modalHeader.innerText = `Editando Orçamento #${orc.id}`;
        if (saveBtn) saveBtn.innerHTML = '<i data-lucide="save"></i> Atualizar Orçamento';

        // Abre modal
        const modal = document.getElementById('modal-novo-orcamento');
        if (modal) modal.classList.add('active');

        renderizarItensOrcamento();
        atualizarTotaisOrcamento();
        if (typeof lucide !== 'undefined') lucide.createIcons();

    } catch (e) {
        console.error(e);
        showToast("Erro ao carregar orçamento", "error");
    }
}

/**
 * Abre o drawer de orçamento e popula dados básicos
 */
async function abrirDrawerOrcamento(agendamentoId) {
    try {
        const { data, error } = await db.from('agendamentos')
            .select('*, clientes(nome, telefone), veiculos(marca, modelo, placa, ano)')
            .eq('id', agendamentoId)
            .single();

        if (error) throw error;

        agendamentoSelecionado = data;
        itensOrcamento = []; // Reseta itens

        // Preenche resumo do cliente/veículo
        document.getElementById('orc-resumo-cliente').innerText = data.clientes?.nome || data.cliente_nome || 'Não identificado';
        document.getElementById('orc-resumo-veiculo').innerText = data.veiculos ? `${data.veiculos.marca} ${data.veiculos.modelo} [${data.veiculos.placa.toUpperCase()}]` : 'Veículo não informado';

        // Abre o drawer (se existir)
        const overlay = document.getElementById('overlay-drawer-orcamento');
        const drawer = document.querySelector('.drawer-orcamento');
        if (overlay) {
            overlay.style.visibility = 'visible';
            overlay.style.opacity = '1';
        }
        if (drawer) {
            drawer.style.right = '0';
        }

        renderizarItensOrcamento();
        atualizarTotaisOrcamento();

    } catch (e) {
        console.error(e);
        showToast("Erro ao carregar dados do agendamento", "error");
    }
}

/**
 * Fecha o drawer de orçamento
 */
function fecharDrawerOrcamento() {
    const overlay = document.getElementById('overlay-drawer-orcamento');
    const drawer = document.querySelector('.drawer-orcamento');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => { overlay.style.visibility = 'hidden'; }, 300);
    }
    if (drawer) {
        drawer.style.right = '-600px';
    }
    agendamentoSelecionado = null;
    itensOrcamento = [];
}

/**
 * Adiciona um novo item (Peça ou Serviço)
 */
function adicionarItemOrcamento() {
    const tipo = document.getElementById('orc-item-tipo').value;
    const desc = document.getElementById('orc-item-desc').value.trim();
    const qtd = parseFloat(document.getElementById('orc-item-qtd').value) || 1;
    const valor = parseFloat(document.getElementById('orc-item-valor').value) || 0;

    if (!desc) {
        showToast("Informe a descrição do item", "error");
        return;
    }

    const novoItem = {
        id_temp: Date.now(),
        tipo: tipo,
        descricao: desc,
        quantidade: qtd,
        valor_unitario: valor,
        valor_total: qtd * valor
    };

    itensOrcamento.push(novoItem);
    
    // Limpa campos
    document.getElementById('orc-item-desc').value = '';
    document.getElementById('orc-item-valor').value = '';
    document.getElementById('orc-item-qtd').value = '1';

    renderizarItensOrcamento();
    atualizarTotaisOrcamento();
}

/**
 * Remove um item da lista
 */
function removerItemOrcamento(idTemp) {
    itensOrcamento = itensOrcamento.filter(item => item.id_temp !== idTemp);
    renderizarItensOrcamento();
    atualizarTotaisOrcamento();
}

/**
 * Renderiza a tabela de itens
 */
function renderizarItensOrcamento() {
    const tbody = document.getElementById('tbody-orc-itens');
    tbody.innerHTML = '';

    if (itensOrcamento.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px; color:var(--text-muted);">Nenhum item adicionado</td></tr>';
        return;
    }

    itensOrcamento.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td><span class="badge-tipo ${item.tipo}">${item.tipo === 'peça' ? 'P' : 'S'}</span></td>
                <td>${item.descricao}</td>
                <td>${item.quantidade}</td>
                <td>${formatarMoeda(item.valor_unitario)}</td>
                <td>${formatarMoeda(item.valor_total)}</td>
                <td style="text-align:right;">
                    <button class="btn-remove-item" onclick="removerItemOrcamento(${item.id_temp})">
                        <i data-lucide="trash-2" style="width:14px; height:14px;"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

/**
 * Calcula e exibe os totais
 */
function atualizarTotaisOrcamento() {
    let pecas = 0;
    let servicos = 0;

    itensOrcamento.forEach(item => {
        if (item.tipo === 'peça') pecas += item.valor_total;
        else servicos += item.valor_total;
    });

    const total = pecas + servicos;

    document.getElementById('orc-total-pecas').innerText = formatarMoeda(pecas);
    document.getElementById('orc-total-servicos').innerText = formatarMoeda(servicos);
    document.getElementById('orc-total-geral').innerText = formatarMoeda(total);
}

/**
 * Salva o orçamento no Supabase (Suporta INSERT e UPDATE)
 */
async function salvarOrcamento() {
    if (!agendamentoSelecionado) {
        showToast("Contexto de agendamento não encontrado", "error");
        return;
    }

    if (itensOrcamento.length === 0) {
        showToast("Adicione pelo menos um item ao orçamento", "error");
        return;
    }

    try {
        const isUpdate = orcamentoEmEdicaoId !== null;
        showToast(isUpdate ? "Atualizando orçamento..." : "Salvando orçamento...", "info");

        let pecasTotal = 0;
        let servicosTotal = 0;
        itensOrcamento.forEach(i => {
            if(i.tipo === 'peça') pecasTotal += i.valor_total;
            else servicosTotal += i.valor_total;
        });

        const orcamentoPayload = {
            oficina_id: OFICINA_ATIVA_ID,
            cliente_id: agendamentoSelecionado.cliente_id,
            veiculo_id: agendamentoSelecionado.veiculo_id,
            agendamento_id: agendamentoSelecionado.id,
            valor_pecas: pecasTotal,
            valor_servicos: servicosTotal,
            valor_total: pecasTotal + servicosTotal,
            status: isUpdate ? undefined : 'Rascunho', // Não muda status no update por padrão
            observacoes: document.getElementById('orc-obs').value.trim()
        };

        let orcId = orcamentoEmEdicaoId;

        if (isUpdate) {
            const { error: errUpdate } = await db.from('orcamentos')
                .update(orcamentoPayload)
                .eq('id', orcamentoEmEdicaoId);
            if (errUpdate) throw errUpdate;

            // Para itens, a estratégia mais simples é deletar os antigos e inserir os novos
            const { error: errDelItens } = await db.from('orcamento_itens')
                .delete()
                .eq('orcamento_id', orcamentoEmEdicaoId);
            if (errDelItens) throw errDelItens;
        } else {
            // Gerar UUID para token_aprovacao apenas no INSERT
            const tokenAprovacao = (typeof crypto !== 'undefined' && crypto.randomUUID) 
                ? crypto.randomUUID() 
                : 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, () => (Math.random() * 16 | 0).toString(16));
            
            orcamentoPayload.token_aprovacao = tokenAprovacao;

            const { data: newOrc, error: errOrc } = await db.from('orcamentos')
                .insert([orcamentoPayload])
                .select()
                .single();

            if (errOrc) throw errOrc;
            orcId = newOrc.id;
        }

        // 2. Insere os Itens em lote (Bulk Insert)
        const itensPayload = itensOrcamento.map(item => ({
            orcamento_id: orcId,
            tipo: item.tipo,
            descricao: item.descricao,
            quantidade: item.quantidade,
            valor_unitario: item.valor_unitario,
            valor_total: item.valor_total
        }));

        const { error: errItens } = await db.from('orcamento_itens').insert(itensPayload);
        if (errItens) throw errItens;

        // 3. Atualiza status do agendamento para 'Orçamento'
        await db.from('agendamentos').update({ status: 'Orçamento' }).eq('id', agendamentoSelecionado.id);

        showToast(isUpdate ? "Orçamento atualizado com sucesso!" : "Orçamento salvo com sucesso!");
        fecharDrawerOrcamento();
        
        // Recarrega a listagem conforme contexto da página
        if (typeof renderizarAgendaExtrato === 'function') {
            renderizarAgendaExtrato();
        }

    } catch (e) {
        console.error("Erro ao processar orçamento:", e);
        showToast("Erro: " + (e.message || "Erro desconhecido"), "error");
    }
}
