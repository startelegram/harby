/**
 * Inicialización del sistema de pago con criptomonedas
 * Este archivo se encarga de inicializar el botón de pago con criptomonedas
 */

// Función global para mostrar notificaciones toast
window.showToast = function(message, type = 'success') {
    console.log(`Mostrando notificación: ${message} (${type})`);

    // Si no existe la función global, crear una notificación propia
    const toastEl = document.getElementById('toast');
    if (toastEl) {
        const toastBody = toastEl.querySelector('.toast-body');
        if (toastBody) {
            toastBody.textContent = message;
            toastEl.classList.remove('bg-success', 'bg-danger', 'bg-warning', 'bg-info');

            switch (type) {
                case 'success':
                    toastEl.classList.add('bg-success');
                    break;
                case 'error':
                    toastEl.classList.add('bg-danger');
                    break;
                case 'warning':
                    toastEl.classList.add('bg-warning');
                    break;
                default:
                    toastEl.classList.add('bg-info');
            }

            if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
                const toast = new bootstrap.Toast(toastEl, { autohide: true, delay: 5000 });
                toast.show();
            }
        } else {
            console.error('No se encontró el elemento .toast-body dentro del toast');
            alert(message);
        }
    } else {
        console.error('No se encontró el elemento toast');
        alert(message);
    }
};

// Asegurarse de que la función showToast esté disponible globalmente
if (typeof showToast !== 'function') {
    showToast = window.showToast;
}

document.addEventListener('DOMContentLoaded', function() {
    // Obtener el botón de pago con criptomonedas
    const payWithCryptoBtn = document.getElementById('pay-with-crypto-btn');

    // Verificar si el botón existe
    if (payWithCryptoBtn) {
        // Agregar evento de clic al botón
        payWithCryptoBtn.addEventListener('click', function() {
            // Verificar si el sistema de pago con criptomonedas está disponible
            if (typeof cryptoPaymentSystem !== 'undefined' && typeof cryptoPaymentSystem.openCryptoPaymentModal === 'function') {
                // Llamar a la función para abrir el modal de pago con criptomonedas
                cryptoPaymentSystem.openCryptoPaymentModal();
            } else {
                // Mostrar mensaje de error si el sistema no está disponible
                console.error('El sistema de pago con criptomonedas no está disponible');
                window.showToast('حدث خطأ في نظام الدفع بالعملات المشفرة', 'error');
            }
        });

        console.log('Botón de pago con criptomonedas inicializado correctamente');
    } else {
        console.error('No se encontró el botón de pago con criptomonedas');
    }
});
