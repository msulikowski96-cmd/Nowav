// Theme Toggle Functionality
console.log('Theme toggle script loaded');

document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle?.querySelector('i');

    console.log('Theme toggle button found');

    // Get saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';

    // Apply saved theme
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        if (icon) {
            icon.className = 'fas fa-sun';
        }
    }

    // Toggle theme on click
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            body.classList.toggle('dark-theme');

            const isDark = body.classList.contains('dark-theme');

            // Update icon
            if (icon) {
                icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
            }

            // Save preference
            localStorage.setItem('theme', isDark ? 'dark' : 'light');

            // Show notification
            showNotification(
                isDark ? 'Tryb ciemny włączony' : 'Tryb jasny włączony',
                'success'
            );
        });
    }
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 24px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });

    // Set background color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    notification.style.backgroundColor = colors[type] || colors.info;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Theme Toggle Functionality
class ThemeToggle {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.createToggleButton();
        this.bindEvents();
    }

    createToggleButton() {
        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'theme-toggle';
        toggleContainer.innerHTML = `
            <button class="theme-toggle-btn ${this.currentTheme === 'light' ? 'active' : ''}"
                    id="light-btn"
                    title="Tryb jasny"
                    aria-label="Przełącz na tryb jasny">
                <i class="fas fa-sun"></i>
            </button>
            <button class="theme-toggle-btn ${this.currentTheme === 'dark' ? 'active' : ''}"
                    id="dark-btn"
                    title="Tryb ciemny"
                    aria-label="Przełącz na tryb ciemny">
                <i class="fas fa-moon"></i>
            </button>
        `;
        document.body.appendChild(toggleContainer);
    }

    bindEvents() {
        document.getElementById('light-btn').addEventListener('click', () => {
            this.setTheme('light');
        });

        document.getElementById('dark-btn').addEventListener('click', () => {
            this.setTheme('dark');
        });

        // Keyboard accessibility
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'L') {
                this.toggleTheme();
            }
        });
    }

    setTheme(theme) {
        this.currentTheme = theme;
        this.applyTheme(theme);
        localStorage.setItem('theme', theme);
        this.updateToggleButtons();
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);

        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', theme === 'dark' ? '#0f172a' : '#667eea');
        }
    }

    updateToggleButtons() {
        const lightBtn = document.getElementById('light-btn');
        const darkBtn = document.getElementById('dark-btn');

        lightBtn.classList.toggle('active', this.currentTheme === 'light');
        darkBtn.classList.toggle('active', this.currentTheme === 'dark');
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
}

// Initialize theme toggle when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new ThemeToggle();
});

// Handle system theme preference changes
if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            const theme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', theme);
        }
    });
}