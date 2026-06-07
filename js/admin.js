/**
 * Logica da Pagina de Administracao SaaS - GO Oficina
 */

document.addEventListener('DOMContentLoaded', () => {
    carregarDadosAdmin();
});

async function carregarDadosAdmin() {
    try {
        // 1. Busca todas as oficinas (tenants)
        const { data: workshops, error: errWorkshops } = await db
            .from('configuracoes_saas')
            .select('*')
            .order('id', { ascending: true });

        if (errWorkshops) throw errWorkshops;

        const listaWorkshops = workshops || [];

        // 2. Atualiza contadores usando os IDs existentes no admin.html
        const cardAtivas = document.getElementById('card-ativas');
        if (cardAtivas) cardAtivas.innerText = listaWorkshops.length;

        const totalUsersEl = document.getElementById('count-total-users');
        if (totalUsersEl) totalUsersEl.innerText = listaWorkshops.length * 2; // Mock legado protegido

        const cardPremium = document.getElementById('card-premium');
        if (cardPremium) {
            cardPremium.innerText = listaWorkshops.filter(w => w.plano === 'Turbinado' || w.plano === 'Premium' || !w.plano).length;
        }

        // 3. Renderiza tabela usando o tbody existente no admin.html
        const tableBody = document.getElementById('tabela-oficinas-corpo');
        if (!tableBody) return;

        if (listaWorkshops.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 40px; color: var(--text-muted);">Nenhuma oficina cadastrada.</td></tr>';
            return;
        }

        tableBody.innerHTML = listaWorkshops.map(w => `
            <tr>
                <td>#${w.id}</td>
                <td><strong style="color: #fff;">${w.nome_oficina || 'Oficina sem nome'}</strong></td>
                <td>${w.responsavel || w.email_contato || 'N/A'}<br><span style="color: #6c7a9c; font-size: 11px;">${w.whatsapp || 'Sem telefone'}</span></td>
                <td><span class="badge-plan">${w.plano || 'Premium'}</span></td>
                <td>${w.created_at ? new Date(w.created_at).toLocaleDateString('pt-BR') : 'N/A'}</td>
                <td>N/A</td>
                <td>N/A</td>
                <td><span class="status-dot active"></span> <span style="color: #00b074; font-weight: 600;">Ativo</span></td>
                <td style="text-align: right;">
                    <div style="display: flex; gap: 8px; justify-content: flex-end;">
                        <button onclick="acessarOficina(${w.id})" title="Acessar Painel" style="background:none; border:none; cursor:pointer; color:#6c7a9c;">
                            <i data-lucide="external-link" style="width: 16px; height: 16px;"></i>
                        </button>
                        <button onclick="editarOficina(${w.id})" title="Configuracoes" style="background:none; border:none; cursor:pointer; color:#6c7a9c;">
                            <i data-lucide="settings" style="width: 16px; height: 16px;"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        if (typeof lucide !== 'undefined') lucide.createIcons();

    } catch (e) {
        console.error("Erro ao carregar dados administrativos:", e);
        const tableBody = document.getElementById('tabela-oficinas-corpo');
        if (tableBody) {
            tableBody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 40px; color: #ef4444;">Erro ao carregar dados: ${e.message}</td></tr>`;
        }
    }
}

function acessarOficina(id) {
    window.location.href = `index.html?id=${id}`;
}

function editarOficina(id) {
    window.location.href = `config.html?id=${id}`;
}

function abrirModalNovaOficina() {
    const modal = document.getElementById('modal-nova-oficina');
    if (modal) modal.classList.add('active');
}

function fecharModal() {
    const modal = document.getElementById('modal-nova-oficina');
    if (modal) modal.classList.remove('active');
}
