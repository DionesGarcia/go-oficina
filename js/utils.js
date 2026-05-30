/**
 * Funções Utilitárias Compartilhadas
 */

/**
 * Formata uma string de data YYYY-MM-DD para DD/MM/YYYY
 */
function formatarDataBR(dataStr) {
    if (!dataStr) return '--/--/----';
    const partes = dataStr.split('-');
    if (partes.length !== 3) return dataStr;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

/**
 * Obtém a data de hoje formatada como string YYYY-MM-DD
 * @param {number} diasDeDiferenca - Opcional, adiciona ou subtrai dias de hoje
 */
function obterDataString(diasDeDiferenca = 0) {
    const d = new Date();
    d.setDate(d.getDate() + diasDeDiferenca);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Formata um valor numérico para Moeda Brasileira (R$)
 */
function formatarMoeda(valor) {
    return parseFloat(valor).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

/**
 * Sistema de Notificações Toast
 * @param {string} mensagem - Texto da mensagem
 * @param {string} tipo - 'success', 'error', 'info'
 */
function showToast(mensagem, tipo = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    
    let icon = 'check-circle';
    if (tipo === 'error') icon = 'alert-circle';
    if (tipo === 'info') icon = 'info';

    toast.innerHTML = `
        <i class="toast-icon" data-lucide="${icon}"></i>
        <span>${mensagem}</span>
    `;

    container.appendChild(toast);
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Animação de entrada
    setTimeout(() => toast.classList.add('active'), 10);

    // Auto-remove
    setTimeout(() => {
        toast.classList.remove('active');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
