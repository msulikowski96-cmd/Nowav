
<old_str>// Main JavaScript file for CV Optimizer Pro

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Main JS loaded');
    initializeApp();
});

function initializeApp() {
    // Initialize user authentication status logging
    logUserAuthStatus();
    
    // Initialize mobile optimizations
    initializeMobileOptimizations();
    
    // Initialize performance monitoring
    initializePerformanceMonitoring();
    
    // Initialize error handling
    initializeErrorHandling();
    
    // Initialize accessibility features
    initializeAccessibility();
}

function logUserAuthStatus() {
    // Get authentication status from template data or session
    const isAuthenticated = document.body.classList.contains('user-authenticated') || 
                           document.querySelector('[data-user-authenticated]')?.dataset.userAuthenticated === 'true';
    
    console.log('User authentication status:', isAuthenticated ? 'authenticated' : 'not authenticated');
}

function initializeMobileOptimizations() {
    // Optimize for mobile devices
    if (window.innerWidth <= 768) {
        document.body.classList.add('mobile-optimized');
        
        // Improve touch targets
        const buttons = document.querySelectorAll('button, .btn');
        buttons.forEach(btn => {
            if (btn.offsetHeight < 44) {
                btn.style.minHeight = '44px';
                btn.style.padding = '12px 16px';
            }
        });
    }
    
    // Handle orientation changes
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            window.scrollTo(0, 1);
        }, 500);
    });
}

function initializePerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', function() {
        if ('performance' in window) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log('Page load time:', loadTime + 'ms');
            
            // Report slow loading if > 3 seconds
            if (loadTime > 3000) {
                console.warn('Slow page load detected:', loadTime + 'ms');
            }
        }
    });
}

function initializeErrorHandling() {
    // Global error handler
    window.addEventListener('error', function(event) {
        console.error('JavaScript error:', event.error);
        
        // Don't show errors to users in production
        if (window.location.hostname !== 'localhost') {
            return true;
        }
    });
    
    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', function(event) {
        console.error('Unhandled promise rejection:', event.reason);
        event.preventDefault();
    });
}

function initializeAccessibility() {
    // Add skip link functionality
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 9999;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Enhance keyboard navigation
    document.addEventListener('keydown', function(event) {
        // Escape key closes modals and dropdowns
        if (event.key === 'Escape') {
            const activeModal = document.querySelector('.modal.show');
            const activeDropdown = document.querySelector('.dropdown-menu.show');
            
            if (activeModal) {
                const modal = bootstrap.Modal.getInstance(activeModal);
                if (modal) modal.hide();
            }
            
            if (activeDropdown) {
                activeDropdown.classList.remove('show');
            }
        }
    });
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification-toast`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        max-width: 350px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    notification.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
            <span>${message}</span>
            <button type="button" class="btn-close" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Export functions for global use
window.showNotification = showNotification;</old_str>
<new_str>// Main JavaScript file for CV Optimizer Pro

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Main JS loaded');
    initializeApp();
});

function initializeApp() {
    // Initialize user authentication status logging
    logUserAuthStatus();
    
    // Initialize mobile optimizations
    initializeMobileOptimizations();
    
    // Initialize performance monitoring
    initializePerformanceMonitoring();
    
    // Initialize error handling
    initializeErrorHandling();
    
    // Initialize accessibility features
    initializeAccessibility();
    
    // Initialize Bootstrap components
    initializeBootstrapComponents();
}

function logUserAuthStatus() {
    // Get authentication status from template data or session
    const isAuthenticated = document.body.classList.contains('user-authenticated') || 
                           document.querySelector('[data-user-authenticated]')?.dataset.userAuthenticated === 'true';
    
    console.log('User authentication status:', isAuthenticated ? 'authenticated' : 'not authenticated');
}

function initializeBootstrapComponents() {
    // Initialize all Bootstrap dropdowns
    const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
    dropdownElementList.map(function (dropdownToggleEl) {
        return new bootstrap.Dropdown(dropdownToggleEl, {
            boundary: 'viewport'
        });
    });

    // Initialize all Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize all Bootstrap popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Handle navbar collapse properly
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        // Close navbar when clicking on nav links (mobile)
        navbarCollapse.addEventListener('click', function(e) {
            if (e.target.classList.contains('nav-link')) {
                const navbarCollapse = bootstrap.Collapse.getInstance(this);
                if (navbarCollapse) {
                    navbarCollapse.hide();
                }
            }
        });
    }
}

function initializeMobileOptimizations() {
    // Optimize for mobile devices
    if (window.innerWidth <= 768) {
        document.body.classList.add('mobile-optimized');
        
        // Improve touch targets
        const buttons = document.querySelectorAll('button, .btn');
        buttons.forEach(btn => {
            if (btn.offsetHeight < 44) {
                btn.style.minHeight = '44px';
                btn.style.padding = '12px 16px';
            }
        });
    }
    
    // Handle orientation changes
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            window.scrollTo(0, 1);
        }, 500);
    });
}

function initializePerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', function() {
        if ('performance' in window) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log('Page load time:', loadTime + 'ms');
            
            // Report slow loading if > 3 seconds
            if (loadTime > 3000) {
                console.warn('Slow page load detected:', loadTime + 'ms');
            }
        }
    });
}

function initializeErrorHandling() {
    // Global error handler
    window.addEventListener('error', function(event) {
        console.error('JavaScript error:', event.error);
        
        // Don't show errors to users in production
        if (window.location.hostname !== 'localhost') {
            return true;
        }
    });
    
    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', function(event) {
        console.error('Unhandled promise rejection:', event.reason);
        event.preventDefault();
    });
}

function initializeAccessibility() {
    // Add skip link functionality
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 9999;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Enhance keyboard navigation
    document.addEventListener('keydown', function(event) {
        // Escape key closes modals and dropdowns
        if (event.key === 'Escape') {
            const activeModal = document.querySelector('.modal.show');
            const activeDropdowns = document.querySelectorAll('.dropdown-menu.show');
            
            if (activeModal) {
                const modal = bootstrap.Modal.getInstance(activeModal);
                if (modal) modal.hide();
            }
            
            activeDropdowns.forEach(dropdown => {
                dropdown.classList.remove('show');
            });
        }
    });
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification-toast`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        max-width: 350px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    notification.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
            <span>${message}</span>
            <button type="button" class="btn-close" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Export functions for global use
window.showNotification = showNotification;</old_str>
