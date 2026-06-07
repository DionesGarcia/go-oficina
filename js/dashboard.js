/**
 * Controle do Painel de Controle (Dashboard)
 * GO Oficina - MVP
 */

document.addEventListener("DOMContentLoaded", () => {
    inicializarPainel();
});

async function inicializarPainel() {
    try {
        await Promise.all([
            configurarAtalhosDashboard(),
            renderizarContadores(),
            carregarJornadaOficina(),
            carregarUltimasOrdensServico(),
            carregarAgendaHoje(),
            carregarAlertasReais()
        ]);

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    } catch (error) {
        console.error("Erro geral na inicialização do painel:", error);

        if (typeof showToast === 'function') {
            showToast("Erro ao sincronizar dados com o Supabase", "error");
        }
    }
}

function hojeISO() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

function dataISO(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

function statusLower(status) {
    return String(status || '').toLowerCase();
}

function escaparHTML(valor) {
    return String(valor ?? '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }[char]));
}

function montarVeiculo(veiculo) {
    if (!veiculo) return 'Veículo não informado';

    const modelo = [veiculo.marca, veiculo.modelo].filter(Boolean).join(' ');
    const placa = veiculo.placa ? ` • ${String(veiculo.placa).toUpperCase()}` : '';
    return `${modelo || 'Veículo'}${placa}`;
}

function statusOSLabel(status) {
    const statusMap = {
        aberta: 'Em andamento',
        concluido: 'Concluída',
        faturado: 'Entregue'
    };

    return statusMap[statusLower(status)] || status || 'Sem status';
}

function statusClasse(status) {
    return statusLower(status)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9-]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'sem-status';
}

function configurarAtalhosDashboard() {
    document.querySelectorAll('[data-dashboard-link]').forEach(link => {
        const destino = link.getAttribute('data-dashboard-link');
        const paginas = {
            agenda: 'agenda.html',
            orcamentos: 'orcamentos.html',
            os: 'os.html'
        };

        if (paginas[destino]) {
            link.href = `${paginas[destino]}?id=${OFICINA_ATIVA_ID}`;
        }
    });
}

function ehAgendamentoAtivo(status) {
    const st = statusLower(status);
    return !st.includes('cancel') && !st.includes('faltou') && !st.includes('não compareceu') && !st.includes('remarc');
}

function ehComparecimento(status) {
    const st = statusLower(status);
    return ehAgendamentoAtivo(status) && !st.includes('aguard');
}

function setTexto(id, valor) {
    const el = document.getElementById(id);
    if (el) el.innerText = valor;
}

/* =========================
   KPIs DO TOPO
========================= */

async function renderizarContadores() {
    const hojeStr = hojeISO();

    try {
        const { data: agendamentos, error: errAgend } = await db
            .from('agendamentos')
            .select('id, status, servico_data, horario')
            .eq('oficina_id', OFICINA_ATIVA_ID)
            .eq('servico_data', hojeStr);

        if (errAgend) throw errAgend;

        const agora = new Date();
        const horaAtual = `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;
        const countAgenda = (agendamentos || []).filter(a => {
            const st = statusLower(a.status);
            const ativo = !st.includes('cancel') && !st.includes('não compareceu') && !st.includes('faltou');
            const proximo = !a.horario || String(a.horario).substring(0, 5) >= horaAtual;
            return ativo && proximo;
        }).length;

        const { data: orcamentos, error: errOrc } = await db
            .from('orcamentos')
            .select('id')
            .eq('oficina_id', OFICINA_ATIVA_ID)
            .in('status', ['Rascunho', 'Enviado', 'Em Análise']);

        if (errOrc) throw errOrc;

        const { data: osEmAndamento, error: errOS } = await db
            .from('ordens_servico')
            .select('id')
            .eq('oficina_id', OFICINA_ATIVA_ID)
            .eq('status', 'aberta');

        if (errOS) throw errOS;

        const { data: osConcluidasHoje, error: errFin } = await db
            .from('agendamentos')
            .select('id, status')
            .eq('oficina_id', OFICINA_ATIVA_ID)
            .eq('servico_data', hojeStr);

        if (errFin) throw errFin;

        // "No Pátio" não possui campo dedicado no schema; usa os status operacionais já gravados em agendamentos.status.
        const countPatio = (osConcluidasHoje || []).filter(a => {
            const st = statusLower(a.status);
            return st.includes('execução') || st.includes('pátio') || st.includes('aberta');
        }).length;

        setTexto('count-agendamentos', countAgenda);
        setTexto('count-orcamentos', orcamentos ? orcamentos.length : 0);
        setTexto('count-os-abertas', osEmAndamento ? osEmAndamento.length : 0);
        setTexto('count-finalizados', countPatio);
    } catch (e) {
        console.error("Erro ao renderizar contadores:", e);
    }
}

/* =========================
   JORNADA DA OFICINA
========================= */

async function carregarJornadaOficina() {
    const hojeStr = hojeISO();
    const amanhaStr = dataISO(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1));

    try {
        const [agendamentosResp, orcamentosPendentesResp, orcamentosAprovadosResp, osExecucaoResp, entreguesResp] = await Promise.all([
            db
                .from('agendamentos')
                .select('id, status')
                .eq('oficina_id', OFICINA_ATIVA_ID)
                .eq('servico_data', hojeStr),
            db
                .from('orcamentos')
                .select('id')
                .eq('oficina_id', OFICINA_ATIVA_ID)
                .in('status', ['Rascunho', 'Enviado', 'Em Análise']),
            db
                .from('orcamentos')
                .select('id')
                .eq('oficina_id', OFICINA_ATIVA_ID)
                .in('status', ['Aprovado', 'APROVADO_MANUAL']),
            db
                .from('ordens_servico')
                .select('id')
                .eq('oficina_id', OFICINA_ATIVA_ID)
                .eq('status', 'aberta'),
            db
                .from('ordens_servico')
                .select('id')
                .eq('oficina_id', OFICINA_ATIVA_ID)
                .in('status', ['concluido', 'faturado'])
                .gte('concluido_em', hojeStr)
                .lt('concluido_em', amanhaStr)
        ]);

        const respostas = [agendamentosResp, orcamentosPendentesResp, orcamentosAprovadosResp, osExecucaoResp, entreguesResp];
        const erro = respostas.find(resp => resp.error)?.error;
        if (erro) throw erro;

        const agendamentos = agendamentosResp.data || [];
        setTexto('journey-agendado', agendamentos.filter(a => statusLower(a.status) === 'aguardando').length);
        // "Recepcionado" não possui campo próprio; considera agendamentos de hoje que já saíram de Aguardando.
        setTexto('journey-recepcionado', agendamentos.filter(a => {
            const st = statusLower(a.status);
            return ehComparecimento(a.status) && !st.includes('execução') && !st.includes('orçamento') && !st.includes('análise');
        }).length);
        setTexto('journey-orcamento', orcamentosPendentesResp.data?.length || 0);
        // Status de aprovação usados pelos fluxos existentes de orçamento.
        setTexto('journey-aprovado', orcamentosAprovadosResp.data?.length || 0);
        setTexto('journey-execucao', osExecucaoResp.data?.length || 0);
        // Pendente: SUPABASE_SCHEMA.md não confirma campo/status específico para "Esperando Peça".
        setTexto('journey-peca', 0);
        setTexto('journey-entregue', entreguesResp.data?.length || 0);
    } catch (e) {
        console.error("Erro ao carregar jornada da oficina:", e);
    }
}

/* =========================
   ULTIMAS ORDENS DE SERVICO
========================= */

async function carregarUltimasOrdensServico() {
    const tbody = document.getElementById('tbody-ultimas-os');
    if (!tbody) return;

    try {
        const { data: ordens, error } = await db
            .from('ordens_servico')
            .select(`
                id,
                numero_os,
                status,
                criado_em,
                clientes(nome),
                veiculos(marca, modelo, placa)
            `)
            .eq('oficina_id', OFICINA_ATIVA_ID)
            .order('criado_em', { ascending: false })
            .limit(8);

        if (error) throw error;

        if (!ordens || ordens.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="dashboard-empty-cell">Nenhuma ordem de serviço cadastrada.</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = ordens.map(os => {
            const status = statusClasse(os.status);
            const numero = os.numero_os || `#${os.id}`;

            return `
                <tr>
                    <td>${escaparHTML(numero)}</td>
                    <td>${escaparHTML(os.clientes?.nome || 'Cliente não informado')}</td>
                    <td>${escaparHTML(montarVeiculo(os.veiculos))}</td>
                    <td>
                        <span class="dashboard-status-badge status-${escaparHTML(status || 'sem-status')}">
                            ${escaparHTML(statusOSLabel(os.status))}
                        </span>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (e) {
        console.error("Erro ao carregar últimas O.S.:", e);
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="dashboard-empty-cell">Erro ao carregar ordens.</td>
            </tr>
        `;
    }
}

/* =========================
   AGENDA DE HOJE
========================= */

async function carregarAgendaHoje() {
    const container = document.getElementById('box-agenda-hoje');
    if (!container) return;

    try {
        const { data: agendamentos, error } = await db
            .from('agendamentos')
            .select(`
                id,
                status,
                horario,
                servico_tipo,
                clientes(nome),
                veiculos(marca, modelo, placa)
            `)
            .eq('oficina_id', OFICINA_ATIVA_ID)
            .eq('servico_data', hojeISO())
            .order('horario', { ascending: true });

        if (error) throw error;

        const agora = new Date();
        const horaAtual = `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;

        const lista = (agendamentos || []).filter(a => {
            const st = statusLower(a.status);
            const naoCancelado = !st.includes('cancel') && !st.includes('não compareceu');
            const aindaVaiAcontecer = !a.horario || String(a.horario).substring(0, 5) >= horaAtual;
            return naoCancelado && aindaVaiAcontecer;
        });

        if (lista.length === 0) {
            container.innerHTML = `
                <p class="dashboard-empty-message">
                    Nenhum próximo agendamento para hoje.
                </p>
            `;
            return;
        }

        container.innerHTML = lista.slice(0, 6).map(item => {
            const nomeCli = item.clientes?.nome || 'Cliente não informado';
            const veiculo = montarVeiculo(item.veiculos);
            const servicoCurto = item.servico_tipo || 'Serviço';

            return `
                <div class="agenda-row-item">
                    <div class="dashboard-agenda-info">
                        <span class="dashboard-agenda-title">${escaparHTML(nomeCli)}</span>
                        <span class="dashboard-agenda-subtitle">${escaparHTML(veiculo)}</span>
                    </div>

                    <div class="dashboard-agenda-time">
                        <span class="agenda-time-display">
                            ${item.horario ? escaparHTML(item.horario.substring(0, 5)) : '--:--'}
                        </span>
                        <span class="service-tag">
                            ${escaparHTML(servicoCurto)}
                        </span>
                    </div>
                </div>
            `;
        }).join('');
    } catch (e) {
        console.error("Erro agenda:", e);
        container.innerHTML = `
            <p class="dashboard-empty-message">
                Erro ao carregar agenda.
            </p>
        `;
    }
}

/* =========================
   ALERTAS REAIS
========================= */

async function carregarAlertasReais() {
    const card = document.getElementById('card-alertas');
    const container = document.getElementById('box-alertas');
    if (!card || !container) return;

    try {
        const [agendamentosResp, orcamentosResp] = await Promise.all([
            db
                .from('agendamentos')
                .select('id, status')
                .eq('oficina_id', OFICINA_ATIVA_ID)
                .eq('servico_data', hojeISO()),
            db
                .from('orcamentos')
                .select('id')
                .eq('oficina_id', OFICINA_ATIVA_ID)
                .eq('status', 'Enviado')
        ]);

        if (agendamentosResp.error) throw agendamentosResp.error;
        if (orcamentosResp.error) throw orcamentosResp.error;

        const alertas = [];
        const agendamentos = agendamentosResp.data || [];
        const orcamentosEnviados = orcamentosResp.data || [];
        const faltas = agendamentos.filter(a => {
            const st = statusLower(a.status);
            return st.includes('faltou') || st.includes('não compareceu');
        });

        if (faltas.length > 0) {
            alertas.push({
                titulo: 'Agendamentos sem comparecimento',
                detalhe: `${faltas.length} registro(s) de hoje precisam de atenção.`
            });
        }

        if (orcamentosEnviados.length > 0) {
            alertas.push({
                titulo: 'Orçamentos enviados em aberto',
                detalhe: `${orcamentosEnviados.length} orçamento(s) aguardando retorno do cliente.`
            });
        }

        if (alertas.length === 0) {
            card.style.display = 'none';
            container.innerHTML = '';
            return;
        }

        card.style.display = '';
        container.innerHTML = alertas.map(alerta => `
            <div class="dashboard-alert-item">
                <span class="dashboard-alert-title">${escaparHTML(alerta.titulo)}</span>
                <span class="dashboard-alert-detail">${escaparHTML(alerta.detalhe)}</span>
            </div>
        `).join('');
    } catch (e) {
        console.error("Erro ao carregar alertas:", e);
        card.style.display = 'none';
        container.innerHTML = '';
    }
}
