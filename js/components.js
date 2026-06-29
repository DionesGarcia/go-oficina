/**
 * Componentes Dinâmicos de UI - GO Oficina
 * Responsável por renderizar Sidebar, Topbar e gerenciar estados de navegação
 */

const GO_OFICINA_THEME_STORAGE_KEY = 'go-oficina:theme';
const GO_OFICINA_PRODUCT_NAME = 'OFICINA';

function obterTemaGoOficina() {
    const temaSalvo = localStorage.getItem(GO_OFICINA_THEME_STORAGE_KEY);
    return temaSalvo === 'dark' ? 'dark' : 'light';
}

function aplicarTemaGoOficina(tema = obterTemaGoOficina()) {
    const temaNormalizado = tema === 'dark' ? 'dark' : 'light';
    const alvos = [document.documentElement, document.body].filter(Boolean);

    alvos.forEach(el => {
        el.classList.remove('theme-light', 'theme-dark');
        el.classList.add(`theme-${temaNormalizado}`);
    });

    document.querySelectorAll('[data-theme-option]').forEach(btn => {
        const ativo = btn.getAttribute('data-theme-option') === temaNormalizado;
        btn.classList.toggle('active', ativo);
        btn.setAttribute('aria-pressed', String(ativo));
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function definirTemaGoOficina(tema) {
    const temaNormalizado = tema === 'dark' ? 'dark' : 'light';
    localStorage.setItem(GO_OFICINA_THEME_STORAGE_KEY, temaNormalizado);
    aplicarTemaGoOficina(temaNormalizado);
}

function alternarTemaGoOficina() {
    const proximoTema = obterTemaGoOficina() === 'dark' ? 'light' : 'dark';
    definirTemaGoOficina(proximoTema);
}

aplicarTemaGoOficina();

function normalizarStatusGoOficina(status) {
    return String(status || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
}

function statusSistemaClasse(status) {
    const st = normalizarStatusGoOficina(status);

    if (['aguardando', 'a_confirmar'].includes(st)) {
        return 'status-aguardando';
    }

    if (['confirmado'].includes(st)) {
        return 'status-confirmado';
    }

    if (['compareceu', 'concluido', 'concluida'].includes(st)) {
        return 'status-compareceu';
    }

    if (['remarcado'].includes(st)) {
        return 'status-remarcado';
    }

    if (['cancelado', 'cancelada', 'desistencia', 'desistencia', 'faltou', 'nao_compareceu', 'nao_comparecido', 'nao_comparecimento'].includes(st)) {
        return 'status-cancelado';
    }

    if (['concluida', 'concluido', 'entregue', 'aprovado', 'aprovado_manual', 'finalizada', 'finalizado', 'faturado', 'recebido'].includes(st)) {
        return 'status-success';
    }

    if (['aguardando_peca', 'esperando_peca', 'pendente'].includes(st)) {
        return 'status-warning';
    }

    if (['aberta', 'aberto', 'em_aberto', 'em_execucao', 'execucao', 'em_andamento', 'enviado'].includes(st)) {
        return 'status-info';
    }

    if (['cancelada', 'cancelado', 'reprovada', 'reprovado'].includes(st)) {
        return 'status-danger';
    }

    return 'status-neutral';
}

function renderizarComponentesGlobais() {
    aplicarTemaGoOficina();

    const path = window.location.pathname;
    const page = path.split("/").pop() || "index.html";
    const isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';

    // --- 1. INJETA HTML IMEDIATAMENTE (COM PLACEHOLDERS) ---
    const sidebarHtml = `
    <aside class="sidebar ${isCollapsed ? 'collapsed' : ''}" id="main-sidebar">
        <div class="sidebar-top">
            <div class="brand-logo">
                <div class="sidebar-logo-panel" aria-label="Produto ${GO_OFICINA_PRODUCT_NAME}" id="sidebar-workshop-name">
                    <img src="Gemini_Generated_Image_6hobk36hobk36hob-removebg-preview.png"
                         alt="GO Oficina Logo"
                         class="sidebar-logo-img">
                </div>
                <button class="btn-sidebar-toggle" onclick="toggleSidebar()">
                    <i data-lucide="${isCollapsed ? 'chevron-right' : 'chevron-left'}"></i>
                </button>
            </div>
            <ul class="nav-menu">
                <li class="nav-section-label"><span>Operação</span></li>
                <li class="nav-item ${page === 'index.html' ? 'active' : ''}">
                    <a href="index.html?id=${OFICINA_ATIVA_ID}" title="Painel">
                        <div class="nav-item-content"><i data-lucide="layout-dashboard"></i><span>Painel</span></div>
                        <i class="nav-chevron" data-lucide="chevron-right"></i>
                    </a>
                </li>
                <li class="nav-item ${page === 'agenda.html' ? 'active' : ''}">
                    <a href="agenda.html?id=${OFICINA_ATIVA_ID}" title="Agenda">
                        <div class="nav-item-content"><i data-lucide="calendar"></i><span>Agenda</span></div>
                        <i class="nav-chevron" data-lucide="chevron-right"></i>
                    </a>
                </li>
                <li class="nav-item ${page === 'orcamentos.html' ? 'active' : ''}">
                    <a href="orcamentos.html?id=${OFICINA_ATIVA_ID}" title="Orçamentos">
                        <div class="nav-item-content"><i data-lucide="calculator"></i><span>Orçamentos</span></div>
                        <i class="nav-chevron" data-lucide="chevron-right"></i>
                    </a>
                </li>
                <li class="nav-item ${page === 'os.html' ? 'active' : ''}">
                    <a href="os.html?id=${OFICINA_ATIVA_ID}" title="Ordens de Serviço">
                        <div class="nav-item-content"><i data-lucide="clipboard-list"></i><span>Ordens de Serviço</span></div>
                        <i class="nav-chevron" data-lucide="chevron-right"></i>
                    </a>
                </li>
                <li class="nav-section-label"><span>Gestão</span></li>
                <li class="nav-item ${page === 'financeiro.html' ? 'active' : ''}">
                    <a href="financeiro.html?id=${OFICINA_ATIVA_ID}" title="Financeiro">
                        <div class="nav-item-content"><i data-lucide="wallet"></i><span>Financeiro</span></div>
                        <i class="nav-chevron" data-lucide="chevron-right"></i>
                    </a>
                </li>
                <li class="nav-section-label"><span>Cadastros</span></li>
                <li class="nav-item ${page === 'clientes.html' ? 'active' : ''}">
                    <a href="clientes.html?id=${OFICINA_ATIVA_ID}" title="Clientes">
                        <div class="nav-item-content"><i data-lucide="users"></i><span>Clientes</span></div>
                        <i class="nav-chevron" data-lucide="chevron-right"></i>
                    </a>
                </li>
                <li class="nav-item ${page === 'veiculos.html' ? 'active' : ''}">
                    <a href="veiculos.html?id=${OFICINA_ATIVA_ID}" title="Veículos">
                        <div class="nav-item-content"><i data-lucide="car"></i><span>Veículos</span></div>
                        <i class="nav-chevron" data-lucide="chevron-right"></i>
                    </a>
                </li>
                <li class="nav-item ${page === 'config.html' ? 'active' : ''}">
                    <a href="config.html?id=${OFICINA_ATIVA_ID}" title="Configurações">
                        <div class="nav-item-content"><i data-lucide="settings"></i><span>Configurações</span></div>
                        <i class="nav-chevron" data-lucide="chevron-right"></i>
                    </a>
                </li>
                <li class="nav-section-label"><span>Ajuda</span></li>
                <li class="nav-item nav-support">
                    <a href="https://wa.me/5500000000000" target="_blank" rel="noopener noreferrer" title="Suporte">
                        <div class="nav-item-content"><i data-lucide="headset"></i><span>Suporte</span></div>
                        <i class="nav-chevron" data-lucide="external-link"></i>
                    </a>
                </li>
                <li class="nav-item nav-logout">
                    <button type="button" onclick="confirmarLogoutSistema()" title="Sair / Trocar Usuario">
                        <div class="nav-item-content"><i data-lucide="log-out"></i><span>Sair</span></div>
                    </button>
                </li>
            </ul>
        </div>
        <div class="sidebar-bottom-meta">
            <button type="button" class="sidebar-utility-button" aria-label="Acessibilidade">
                <i data-lucide="accessibility"></i>
                <span>Acessibilidade</span>
            </button>
            <button type="button" class="sidebar-utility-button" onclick="alternarTemaGoOficina()" aria-label="Alternar tema">
                <i data-lucide="sun"></i>
                <span>Tema claro</span>
                <i class="sidebar-utility-chevron" data-lucide="chevron-down"></i>
            </button>
            <div class="sidebar-footer-divider"></div>
            <div class="sidebar-footer-text">
                <div class="sidebar-plan-line" id="sidebar-plan-label">GO Oficina v1.0 • Plano Premium</div>
                <div class="sidebar-credit">Desenvolvido por Garcia One</div>
            </div>
        </div>
    </aside>
    <div class="sidebar-overlay" id="mobile-overlay" onclick="toggleMobileMenu()"></div>
    `;

    const topbarHtml = `
    <header class="global-topbar">
        <div class="topbar-left">
            <button class="btn-mobile-menu" onclick="toggleMobileMenu()">
                <i data-lucide="menu"></i>
            </button>
            <button type="button" class="topbar-menu-button" onclick="toggleSidebar()" aria-label="Alternar menu lateral">
                <i data-lucide="menu"></i>
            </button>
            <div class="topbar-workshop-name" id="topbar-workshop-name">GO Oficina</div>
        </div>
        <div class="topbar-workspace-card" id="topbar-workspace-card">
            <div class="topbar-workspace-icon">
                <i data-lucide="warehouse"></i>
            </div>
            <div class="topbar-workspace-copy">
                <strong>GO Oficina</strong>
                <span id="topbar-plan-label">Plano Premium</span>
            </div>
            <i class="topbar-workspace-chevron" data-lucide="chevron-down"></i>
        </div>
        <div class="topbar-banner hidden md:block border border-slate-700/50 rounded-lg overflow-hidden" id="topbar-dynamic-banner">
            <img src="assets/banner-dinamico.svg"
                 alt="Banner Dinamico"
                 class="topbar-banner-img max-w-[468px] max-h-[50px]">
        </div>
        <div class="header-user-nav">
            <button type="button" class="topbar-icon-button" onclick="alternarTemaGoOficina()" aria-label="Alternar tema">
                <i data-lucide="sun"></i>
            </button>
            <button type="button" class="topbar-icon-button topbar-notification-button" aria-label="Notificacoes">
                <i data-lucide="bell"></i>
                <span>3</span>
            </button>
            <div class="topbar-avatar" aria-hidden="true">U</div>
            <div class="user-info">
                <div class="user-name" id="header-user-name">Usuario</div>
                <div class="user-status" id="header-user-email">usuario@email.com</div>
            </div>
            <button type="button" class="topbar-user-chevron" aria-label="Abrir menu do usuario">
                <i data-lucide="chevron-down"></i>
            </button>
        </div>
    </header>
    `;

    document.body.insertAdjacentHTML('afterbegin', sidebarHtml);
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.insertAdjacentHTML('afterbegin', topbarHtml);
    }

    aplicarTemaGoOficina();

    // --- 2. BUSCA DADOS ASSÍNCRONOS E ATUALIZA ---
    carregarDadosDinamicos();
}

async function carregarDadosDinamicos() {
    try {
        // Workshop Name (Navbar only)
        const { data: config } = await db.from('configuracoes_saas').select('*').eq('id', OFICINA_ATIVA_ID).maybeSingle();
        if (config?.nome_oficina) {
            let nome = config.nome_oficina;

            // Se o nome vier em caixa alta do banco, formatamos para ficar mais elegante (Title Case)
            if (nome === nome.toUpperCase()) {
                nome = nome.toLowerCase().replace(/(^\w|\s\w)/g, m => m.toUpperCase());
            }

            const topbarName = document.getElementById('topbar-workshop-name');
            if (topbarName) topbarName.innerText = nome;
        }

        const planLabel = document.getElementById('sidebar-plan-label');
        const topbarPlanLabel = document.getElementById('topbar-plan-label');
        if (planLabel) {
            const plano = config?.plano || config?.plano_atual || config?.tipo_plano || 'Premium';
            const planoFormatado = String(plano).charAt(0).toUpperCase() + String(plano).slice(1);
            planLabel.innerText = `GO Oficina v1.0 • Plano ${planoFormatado}`;
            if (topbarPlanLabel) topbarPlanLabel.innerText = `Plano ${planoFormatado}`;
        }

        const bannerImg = document.querySelector('#topbar-dynamic-banner img');
        const bannerSrc = config?.banner_topo_url || config?.banner_head_url || config?.banner_url;
        if (bannerImg && bannerSrc) bannerImg.src = bannerSrc;

        // User Data
        const { data: { user } } = await db.auth.getUser();
        if (user) {
            const userName = document.getElementById('header-user-name');
            const userEmail = document.getElementById('header-user-email');
            const userAvatar = document.querySelector('.topbar-avatar');
            if (userName) userName.innerText = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario';
            if (userEmail) userEmail.innerText = user.email || '';
            if (userAvatar) {
                userAvatar.innerText = String(user.user_metadata?.full_name || user.email || 'U').trim().charAt(0).toUpperCase();
            }
        }
    } catch (e) {
        console.warn("Erro ao carregar dados dinâmicos da UI:", e);
    }
}

/**
 * Alterna o estado da sidebar (Expandida/Colapsada)
 */
function toggleSidebar() {
    const sidebar = document.getElementById('main-sidebar');
    if (!sidebar) return;

    const isCollapsed = sidebar.classList.toggle('collapsed');
    localStorage.setItem('sidebar-collapsed', isCollapsed);

    // Atualiza o ícone do botão: se está colapsado, mostra seta pra direita (abrir). Se não, seta pra esquerda (fechar).
    const icon = sidebar.querySelector('.btn-sidebar-toggle i');
    if (icon) {
        icon.setAttribute('data-lucide', isCollapsed ? 'chevron-right' : 'chevron-left');
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
}

/**
 * Abre/Fecha o menu mobile (Drawer)
 */
function toggleMobileMenu() {
    const sidebar = document.getElementById('main-sidebar');
    const overlay = document.getElementById('mobile-overlay');
    if (sidebar && overlay) {
        sidebar.classList.toggle('mobile-active');
        overlay.classList.toggle('active');
    }
}

/**
 * Realiza o logout do sistema
 */
async function fazerLogout() {
    if (!confirm("Deseja realmente sair do sistema?")) return;

    try {
        const { error } = await db.auth.signOut();
        if (error) throw error;
        window.location.href = 'login.html';
    } catch (e) {
        console.error("Erro ao deslogar:", e);
        if (typeof showToast === 'function') showToast("Erro ao deslogar", "error");
    }
}

function confirmarLogoutSistema() {
    if (!confirm('Deseja mesmo sair do sistema?')) return;
    fazerLogout();
}

document.addEventListener('click', function(event) {
    const clicouNoDisparador = event.target.closest([
        '.agenda-menu-button',
        '.btn-acoes',
        '.dropdown-toggle',
        '[data-menu-trigger]',
        '[aria-haspopup="menu"]',
        'button[onclick*="toggleAgendaMenu"]',
        'button[onclick*="toggle"][onclick*="Menu"]'
    ].join(','));
    const clicouNoMenu = event.target.closest('.dropdown-menu, .agenda-context-menu, .menu-acoes, [id*="menu-"]');

    if (clicouNoDisparador || clicouNoMenu) return;

    document.querySelectorAll('.dropdown-menu, .menu-acoes, .agenda-context-menu, [id*="menu-"]').forEach(menu => {
        menu.classList.remove('active', 'show');
        menu.closest('.table-row')?.classList.remove('menu-open');
        if (menu.style.display === 'block') {
            menu.style.display = 'none';
        }
    });
});

// Inicia a renderização global
document.addEventListener('DOMContentLoaded', renderizarComponentesGlobais);
window.obterTemaGoOficina = obterTemaGoOficina;
window.aplicarTemaGoOficina = aplicarTemaGoOficina;
window.definirTemaGoOficina = definirTemaGoOficina;
window.alternarTemaGoOficina = alternarTemaGoOficina;
window.normalizarStatusGoOficina = normalizarStatusGoOficina;
window.statusSistemaClasse = statusSistemaClasse;
window.confirmarLogoutSistema = confirmarLogoutSistema;
