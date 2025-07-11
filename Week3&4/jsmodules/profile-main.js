// Profile
// Main

// Init profile page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize database if not already done
    if (!window.dormScoutDB) {
        if (typeof DormScoutDB !== 'undefined') {
            window.dormScoutDB = new DormScoutDB();
        }
    }
    // Check if user is logged in
    if (window.checkLoginStatus) {
        window.checkLoginStatus();
    }
    // Show appropriate view with a slight delay to ensure all modules are loaded
    setTimeout(() => {
        if (window.isLoggedIn) {
            if (window.showProfileDashboard) {
                window.showProfileDashboard();
            }
        } else {
            if (window.showAuthModal) {
                window.showAuthModal();
            }
        }
    }, 100);
    // Setup event listeners
    setupEventListeners();
});

// Event listeners
function setupEventListeners() {
    // Close modal
    const closeBtn = document.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', window.closeAuthModal);
    }
    
    // Forms
    const loginForm = document.querySelector('#loginForm form');
    if (loginForm) {
        loginForm.addEventListener('submit', window.handleLogin);
    }
    
    const signupForm = document.querySelector('#signupForm form');
    if (signupForm) {
        signupForm.addEventListener('submit', window.handleSignup);
    }
    
    // Tabs
    if (window.setupTabEventListeners) {
        window.setupTabEventListeners();
    }
}

