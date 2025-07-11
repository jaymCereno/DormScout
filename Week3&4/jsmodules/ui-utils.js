// UI utils
// Main

// Notify
function showNotification(message, type = 'info') {
    // Remove old
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    // New notif
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    // Colors
    const colors = {
        success: { bg: '#10b981', icon: '✓' },
        error: { bg: '#ef4444', icon: '✕' },
        info: { bg: '#3b82f6', icon: 'ℹ' },
        warning: { bg: '#f59e0b', icon: '⚠' }
    };
    const colorConfig = colors[type] || colors.info;
    notification.innerHTML = `
        <div style="
            display: flex;
            align-items: center;
            gap: 12px;
        ">
            <div style="
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: rgba(255,255,255,0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                font-weight: bold;
                flex-shrink: 0;
            ">${colorConfig.icon}</div>
            <span style="flex: 1; line-height: 1.4;">${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: rgba(255,255,255,0.2);
                border: none;
                border-radius: 4px;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 16px;
                line-height: 1;
                color: white;
                flex-shrink: 0;
            ">&times;</button>
        </div>
    `;
    
    // Styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, ${colorConfig.bg} 0%, ${colorConfig.bg}dd 100%);
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 400px;
        min-width: 300px;
        animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        backdrop-filter: blur(10px);
        border-left: 4px solid rgba(255,255,255,0.3);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        font-weight: 500;
    `;
    
    // Add
    document.body.appendChild(notification);
    
    // Auto remove
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Confirm modal
function createConfirmationModal(options) {
    const modal = document.createElement('div');
    modal.id = 'confirmationModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
        backdrop-filter: blur(3px);
    `;
    
    // Danger?
    const isDangerousAction = options.dangerAction || 
                             options.confirmText === 'Delete' || 
                             options.confirmText === 'Remove' || 
                             options.confirmText === 'Delete Account' ||
                             options.confirmText === 'Cancel Application';
    
    const confirmBtnColor = isDangerousAction ? '#dc3545' : '#174ca1';
    const confirmBtnHoverColor = isDangerousAction ? '#c82333' : '#1e5bb8';
    const iconBgColor = isDangerousAction ? 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)' : 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)';
    const iconColor = isDangerousAction ? '#dc3545' : '#174ca1';
    
    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 480px;
            width: 90%;
            text-align: center;
            box-shadow: 0 25px 80px rgba(0,0,0,0.3);
            position: relative;
            animation: slideUp 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            border: 1px solid rgba(255,255,255,0.2);
        ">
            <!-- Icon Section -->
            <div style="
                width: 90px;
                height: 90px;
                border-radius: 50%;
                background: ${iconBgColor};
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 30px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                border: 3px solid rgba(255,255,255,0.8);
            ">
                ${isDangerousAction ? 
                    `<svg width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2.5">
                        <path d="M3 6h18"/>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c0-1 1-2 2-2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>` :
                    `<svg width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2.5">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M9,9h6v6H9z"/>
                    </svg>`
                }
            </div>
            
            <!-- Title -->
            <h3 style="
                margin: 0 0 20px 0; 
                color: #1f2937; 
                font-size: 26px; 
                font-weight: 700;
                line-height: 1.3;
                letter-spacing: -0.5px;
            ">${options.title}</h3>
            
            <!-- Message -->
            <p style="
                margin: 0 0 40px 0; 
                color: #6b7280; 
                line-height: 1.6;
                font-size: 16px;
                max-width: 320px;
                margin-left: auto;
                margin-right: auto;
                margin-bottom: 40px;
            ">${options.message}</p>
            
            <!-- Action Buttons -->
            <div style="
                display: flex; 
                gap: 15px;
                justify-content: center;
                flex-wrap: wrap;
            ">
                <button onclick="closeConfirmationModal(); ${options.onConfirm || ''}" style="
                    flex: 1;
                    min-width: 140px;
                    padding: 16px 28px;
                    background: linear-gradient(135deg, ${confirmBtnColor} 0%, ${confirmBtnHoverColor} 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-weight: 700;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                    box-shadow: 0 6px 20px rgba(0,0,0,0.15);
                    position: relative;
                    overflow: hidden;
                " 
                onmouseover="
                    this.style.transform='translateY(-3px) scale(1.02)'; 
                    this.style.boxShadow='0 12px 35px rgba(0,0,0,0.25)';
                    this.style.background='linear-gradient(135deg, ${confirmBtnHoverColor} 0%, ${confirmBtnColor} 100%)';
                "
                onmouseout="
                    this.style.transform='translateY(0) scale(1)'; 
                    this.style.boxShadow='0 6px 20px rgba(0,0,0,0.15)';
                    this.style.background='linear-gradient(135deg, ${confirmBtnColor} 0%, ${confirmBtnHoverColor} 100%)';
                "
                >${options.confirmText || 'Confirm'}</button>
                
                <button onclick="closeConfirmationModal()" style="
                    flex: 1;
                    min-width: 140px;
                    padding: 16px 28px;
                    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                    color: #475569;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    font-weight: 700;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                " 
                onmouseover="
                    this.style.transform='translateY(-2px) scale(1.02)'; 
                    this.style.boxShadow='0 8px 25px rgba(0,0,0,0.12)';
                    this.style.background='linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)';
                    this.style.borderColor='#cbd5e1';
                "
                onmouseout="
                    this.style.transform='translateY(0) scale(1)'; 
                    this.style.boxShadow='0 4px 15px rgba(0,0,0,0.08)';
                    this.style.background='linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)';
                    this.style.borderColor='#e2e8f0';
                "
                >${options.cancelText || 'Cancel'}</button>
            </div>
            
            <!-- Decorative Elements -->
            <div style="
                position: absolute;
                top: -20px;
                right: -20px;
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%);
                border-radius: 50%;
                opacity: 0.6;
            "></div>
            <div style="
                position: absolute;
                bottom: -15px;
                left: -15px;
                width: 30px;
                height: 30px;
                background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
                border-radius: 50%;
                opacity: 0.4;
            "></div>
        </div>
    `;
    
    document.body.appendChild(modal);
    return modal;
}

// Close modal
function closeConfirmationModal() {
    const modal = document.getElementById('confirmationModal');
    if (modal) {
        modal.remove();
    }
}

// Nav utils
function redirectToHome() {
    window.location.href = '../index.html';
}

// Button setup
function setupButtonEventListeners() {
    // This function can be used for any additional button setup if needed
}

// Animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    
    @keyframes slideUp {
        from {
            transform: translateY(50px) scale(0.9);
            opacity: 0;
        }
        to {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .notification {
        box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;
        border-left: 4px solid rgba(255,255,255,0.3) !important;
    }
    
    .notification button {
        background: rgba(255,255,255,0.2) !important;
        border: none !important;
        border-radius: 4px !important;
        width: 24px !important;
        height: 24px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
        font-size: 16px !important;
        line-height: 1 !important;
    }
    
    .notification button:hover {
        background: rgba(255,255,255,0.3) !important;
        transform: scale(1.1) !important;
    }
    
    /* Enhanced confirmation modal styles */
    #confirmationModal {
        backdrop-filter: blur(8px) !important;
        -webkit-backdrop-filter: blur(8px) !important;
    }
    
    #confirmationModal > div {
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.18);
        box-shadow: 0 25px 80px rgba(0,0,0,0.3), 
                    0 0 0 1px rgba(255,255,255,0.05) inset !important;
    }
    
    /* Button ripple effect */
    #confirmationModal button {
        position: relative !important;
        overflow: hidden !important;
    }
    
    #confirmationModal button:active::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255,255,255,0.3);
        transform: translate(-50%, -50%);
        animation: ripple 0.6s ease-out;
    }
    
    @keyframes ripple {
        to {
            width: 300px;
            height: 300px;
        }
    }
    
    /* Success confirmation styling */
    .confirmation-success {
        animation: pulse 0.6s ease-in-out;
    }
    
    /* Error confirmation styling */
    .confirmation-error {
        animation: shake 0.5s ease-in-out;
    }
    
    /* Application-specific modal enhancements */
    .application-confirmation-modal {
        background: linear-gradient(135deg, rgba(23, 76, 161, 0.95) 0%, rgba(30, 91, 184, 0.95) 100%) !important;
    }
    
    .application-confirmation-modal > div {
        background: rgba(255, 255, 255, 0.98) !important;
        border: 2px solid rgba(23, 76, 161, 0.1) !important;
    }
    
    /* Responsive design for mobile */
    @media (max-width: 480px) {
        #confirmationModal > div {
            margin: 20px !important;
            padding: 30px 25px !important;
            border-radius: 16px !important;
        }
        
        #confirmationModal button {
            padding: 14px 20px !important;
            font-size: 14px !important;
        }
        
        #confirmationModal h3 {
            font-size: 22px !important;
        }
        
        #confirmationModal p {
            font-size: 15px !important;
        }
        
        #confirmationModal > div > div:first-child {
            width: 70px !important;
            height: 70px !important;
            margin-bottom: 25px !important;
        }
        
        #confirmationModal > div > div:first-child svg {
            width: 35px !important;
            height: 35px !important;
        }
    }
`;
document.head.appendChild(style);

// Export functions to global scope
window.showNotification = showNotification;
window.createConfirmationModal = createConfirmationModal;
window.closeConfirmationModal = closeConfirmationModal;
window.redirectToHome = redirectToHome;
window.setupButtonEventListeners = setupButtonEventListeners;
