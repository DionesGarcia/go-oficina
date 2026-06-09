/**
 * Componentes Dinâmicos de UI - GO Oficina
 * Responsável por renderizar Sidebar, Topbar e gerenciar estados de navegação
 */

function renderizarComponentesGlobais() {
    const path = window.location.pathname;
    const page = path.split("/").pop() || "index.html";
    const isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';

    // --- 1. INJETA HTML IMEDIATAMENTE (COM PLACEHOLDERS) ---
    const sidebarHtml = `
    <aside class="sidebar ${isCollapsed ? 'collapsed' : ''}" id="main-sidebar">
        <div class="sidebar-top">
            <div class="brand-logo">
                <div class="brand-lockup" aria-label="GO Oficina">
                    <div class="brand-mark" aria-hidden="true">
                        <img class="brand-mark-img" src="favicon-go.svg" alt="">
                    </div>
                    <div class="brand-wordmark" id="sidebar-workshop-name">
                        <span class="brand-main">GO</span>
                        <span class="brand-product">OFICINA</span>
                    </div>
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
            </ul>
        </div>
        <div class="sidebar-footer-card">
            <div class="plan-box">
                <div class="plan-info-row">
                    <div class="plan-badge-icon"><i style="width:14px; height:14px;" data-lucide="shield-check"></i></div>
                    <div class="plan-text"><span class="title">Oficina</span><span class="subtitle">Premium</span></div>
                </div>
            </div>
            <div class="sidebar-version">
                <span class="sidebar-version-product">GO Oficina</span>
                <span class="sidebar-version-credit">
                    <span class="sidebar-version-prefix">Desenvolvido por</span>
                    <span class="sidebar-version-maker">Garcia One</span>
                </span>
            </div>
        </div>
    </aside>
    <div class="sidebar-overlay" id="mobile-overlay" onclick="toggleMobileMenu()"></div>
    `;

    const topbarHtml = `
    <header class="global-topbar">
        <button class="btn-mobile-menu" onclick="toggleMobileMenu()">
            <i data-lucide="menu"></i>
        </button>
        <div class="topbar-workshop-name" id="topbar-workshop-name">GO Oficina</div>
        <div class="header-user-nav">
            <div class="user-info">
                <div class="user-name" id="header-user-name">Usuário</div>
                <div class="user-status">Logado agora</div>
            </div>
            <div class="user-actions-dropdown">
                <button onclick="fazerLogout()" class="btn-logout" title="Sair / Trocar Usuário">
                    <i data-lucide="log-out"></i>
                    <span style="font-size:12px; font-weight:700; margin-left:8px;" class="hide-mobile">Sair</span>
                </button>
            </div>
        </div>
    </header>
    `;

    document.body.insertAdjacentHTML('afterbegin', sidebarHtml);
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.insertAdjacentHTML('afterbegin', topbarHtml);
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();

    // --- 2. BUSCA DADOS ASSÍNCRONOS E ATUALIZA ---
    carregarDadosDinamicos();
}

async function carregarDadosDinamicos() {
    try {
        // Workshop Name (Navbar only)
        const { data: config } = await db.from('configuracoes_saas').select('nome_oficina').eq('id', OFICINA_ATIVA_ID).maybeSingle();
        if (config?.nome_oficina) {
            let nome = config.nome_oficina;

            // Se o nome vier em caixa alta do banco, formatamos para ficar mais elegante (Title Case)
            if (nome === nome.toUpperCase()) {
                nome = nome.toLowerCase().replace(/(^\w|\s\w)/g, m => m.toUpperCase());
            }

            const topbarName = document.getElementById('topbar-workshop-name');
            if (topbarName) topbarName.innerText = nome;
        }

        // User Data
        const { data: { user } } = await db.auth.getUser();
        if (user) {
            const userName = document.getElementById('header-user-name');
            if (userName) userName.innerText = user.user_metadata?.full_name || user.email;
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

// Inicia a renderização global
document.addEventListener('DOMContentLoaded', renderizarComponentesGlobais);
