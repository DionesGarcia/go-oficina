/**
 * Componentes Dinâmicos de UI
 * Responsável por renderizar Sidebar e Topbar de forma consistente
 */

function renderizarSidebar() {
    const path = window.location.pathname;
    const page = path.split("/").pop() || "index.html";

    const sidebarHtml = `
    <aside class="sidebar">
        <div class="sidebar-top">
            <div class="brand-logo">
                <div class="brand-icon-wrapper"><div class="brand-icon-inner"></div></div>
                <h1>MECÂNICA<span>WEB</span></h1>
            </div>
            <ul class="nav-menu">
                <li class="nav-item ${page === 'index.html' ? 'active' : ''}">
                    <a href="index.html">
                        <div class="nav-item-content"><i data-lucide="layout-dashboard"></i><span>Painel</span></div>
                        <i class="nav-chevron" data-lucide="chevron-right"></i>
                    </a>
                </li>
                <li class="nav-item ${page === 'agenda.html' ? 'active' : ''}">
                    <a href="agenda.html">
                        <div class="nav-item-content"><i data-lucide="calendar"></i><span>Agenda</span></div>
                        <i class="nav-chevron" data-lucide="chevron-right"></i>
                    </a>
                </li>
                <li class="nav-item ${page === 'os.html' ? 'active' : ''}">
                    <a href="os.html">
                        <div class="nav-item-content"><i data-lucide="clipboard-list"></i><span>Ordens de Serviço</span></div>
                        <i class="nav-chevron" data-lucide="chevron-right"></i>
                    </a>
                </li>
                <li class="nav-item ${page === 'clientes.html' ? 'active' : ''}">
                    <a href="clientes.html">
                        <div class="nav-item-content"><i data-lucide="users"></i><span>Clientes</span></div>
                        <i class="nav-chevron" data-lucide="chevron-right"></i>
                    </a>
                </li>
                <li class="nav-item ${page === 'veiculos.html' ? 'active' : ''}">
                    <a href="veiculos.html">
                        <div class="nav-item-content"><i data-lucide="car"></i><span>Veículos</span></div>
                        <i class="nav-chevron" data-lucide="chevron-right"></i>
                    </a>
                </li>
                <li class="nav-item ${page === 'config.html' ? 'active' : ''}">
                    <a href="config.html">
                        <div class="nav-item-content"><i data-lucide="settings"></i><span>Configurações</span></div>
                        <i class="nav-chevron" data-lucide="chevron-right"></i>
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
        </div>
    </aside>
    `;

    document.body.insertAdjacentHTML('afterbegin', sidebarHtml);
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Inicia a renderização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', renderizarSidebar);
