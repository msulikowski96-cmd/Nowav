// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Theme toggle script loaded');

    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-bs-theme', currentTheme);

    // Update toggle button icon
    updateThemeIcon(currentTheme);

    if (themeToggle) {
        console.log('Theme toggle button found');
        themeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            const currentTheme = htmlElement.getAttribute('data-bs-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            console.log('Switching theme from', currentTheme, 'to', newTheme);

            htmlElement.setAttribute('data-bs-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    } else {
        console.log('Theme toggle button not found');
    }

    function updateThemeIcon(theme) {
        const themeIconDark = document.querySelector('.theme-icon-dark');
        const themeIconLight = document.querySelector('.theme-icon-light');

        if (theme === 'dark') {
            if (themeIconDark) themeIconDark.style.display = 'none';
            if (themeIconLight) themeIconLight.style.display = 'inline';
        } else {
            if (themeIconDark) themeIconDark.style.display = 'inline';
            if (themeIconLight) themeIconLight.style.display = 'none';
        }
    }
});

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