// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                navLinks.style.display = 'none';
            }
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Animation on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.topic-card, .simulation-card, .resource-card');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Initial setup for animation
document.querySelectorAll('.topic-card, .simulation-card, .resource-card').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

// Add scroll event listener for animations
window.addEventListener('scroll', animateOnScroll);
// Trigger animation check on page load
window.addEventListener('load', animateOnScroll);

// Simple physics simulation placeholder
class SimplePendulum {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.angle = Math.PI / 4;
        this.angularVelocity = 0;
        this.length = 150;
        this.gravity = 9.8;
        this.damping = 0.99;
        
        this.animate = this.animate.bind(this);
        this.animate();
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update physics
        const acceleration = -this.gravity * Math.sin(this.angle) / this.length;
        this.angularVelocity += acceleration;
        this.angularVelocity *= this.damping;
        this.angle += this.angularVelocity;
        
        // Draw pendulum
        const centerX = this.canvas.width / 2;
        const centerY = 50;
        const bobX = centerX + this.length * Math.sin(this.angle);
        const bobY = centerY + this.length * Math.cos(this.angle);
        
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY);
        this.ctx.lineTo(bobX, bobY);
        this.ctx.strokeStyle = '#3498db';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.arc(bobX, bobY, 10, 0, Math.PI * 2);
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fill();
        
        requestAnimationFrame(this.animate);
    }
}

// Initialize simulations when they come into view
const initSimulations = () => {
    const simulationContainers = document.querySelectorAll('.simulation-placeholder');
    
    simulationContainers.forEach(container => {
        const canvas = document.createElement('canvas');
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        container.innerHTML = '';
        container.appendChild(canvas);
        
        if (container.parentElement.querySelector('h3').textContent === 'Simple Pendulum') {
            new SimplePendulum(canvas);
        }
    });
};

// Initialize simulations when they come into view
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            initSimulations();
            observer.disconnect();
        }
    });
});

document.querySelectorAll('.simulation-container').forEach(container => {
    observer.observe(container);
});

// Dark mode toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

darkModeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = darkModeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Search functionality
const searchInput = document.getElementById('search-input');
const searchResults = document.createElement('div');
searchResults.className = 'search-results';
document.body.appendChild(searchResults);

searchInput.addEventListener('input', debounce(handleSearch, 300));

function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    if (query.length < 2) {
        searchResults.style.display = 'none';
        return;
    }

    // Search through content
    const content = document.querySelectorAll('.unit-content, .formula-list, .pyq-content');
    const results = [];

    content.forEach(element => {
        const text = element.textContent.toLowerCase();
        if (text.includes(query)) {
            results.push({
                text: element.textContent.slice(0, 100) + '...',
                link: element.closest('a')?.href || '#'
            });
        }
    });

    displayResults(results);
}

function displayResults(results) {
    if (results.length === 0) {
        searchResults.style.display = 'none';
        return;
    }

    searchResults.innerHTML = results
        .map(result => `
            <a href="${result.link}" class="search-result-item">
                <div class="result-text">${result.text}</div>
            </a>
        `)
        .join('');

    searchResults.style.display = 'block';
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Progress tracking
function updateProgress() {
    const completedUnits = localStorage.getItem('completedUnits') || '[]';
    const units = JSON.parse(completedUnits);
    const totalUnits = document.querySelectorAll('.unit-card').length;
    const progress = (units.length / totalUnits) * 100;
    
    document.querySelector('.progress').style.width = `${progress}%`;
}

// Initialize progress
updateProgress();

// Add click handlers for unit completion
document.querySelectorAll('.unit-card').forEach(card => {
    card.addEventListener('click', () => {
        const unitId = card.getAttribute('data-unit-id');
        const completedUnits = JSON.parse(localStorage.getItem('completedUnits') || '[]');
        
        if (!completedUnits.includes(unitId)) {
            completedUnits.push(unitId);
            localStorage.setItem('completedUnits', JSON.stringify(completedUnits));
            updateProgress();
        }
    });
});

// Progress tracking
const progressTracker = {
    units: {
        total: 4,
        completed: 0
    },
    questions: {
        solved: 0
    },
    updateProgress() {
        const progressBar = document.querySelector('.progress');
        const completedUnits = document.querySelector('.completed-units');
        const questionsSolved = document.querySelector('.questions-solved');
        
        // Calculate progress percentage
        const percentage = (this.units.completed / this.units.total) * 100;
        progressBar.style.width = `${percentage}%`;
        
        // Update status text
        completedUnits.textContent = `${this.units.completed}/${this.units.total} Units Completed`;
        questionsSolved.textContent = `${this.questions.solved} Questions Solved`;
        
        // Store progress in localStorage
        localStorage.setItem('physicsProgress', JSON.stringify({
            units: this.units,
            questions: this.questions
        }));
    },
    loadProgress() {
        const saved = localStorage.getItem('physicsProgress');
        if (saved) {
            const data = JSON.parse(saved);
            this.units = data.units;
            this.questions = data.questions;
            this.updateProgress();
        }
    }
};

// Search functionality
const searchHandler = {
    init() {
        const searchInput = document.getElementById('search-input');
        const searchResults = document.getElementById('search-results');
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if (query.length < 2) {
                searchResults.innerHTML = '';
                return;
            }
            
            this.performSearch(query);
        });
    },
    performSearch(query) {
        const searchResults = document.getElementById('search-results');
        const content = this.getSearchableContent();
        
        const results = content.filter(item => 
            item.text.toLowerCase().includes(query) ||
            item.title.toLowerCase().includes(query)
        );
        
        this.displayResults(results);
    },
    getSearchableContent() {
        // Gather content from the page
        const content = [];
        document.querySelectorAll('.unit-card').forEach(card => {
            const title = card.querySelector('h3').textContent;
            const text = card.textContent;
            const link = card.querySelector('.unit-link').href;
            content.push({ title, text, link });
        });
        return content;
    },
    displayResults(results) {
        const searchResults = document.getElementById('search-results');
        searchResults.innerHTML = '';
        
        if (results.length === 0) {
            searchResults.innerHTML = '<p>No results found</p>';
            return;
        }
        
        const resultsList = document.createElement('ul');
        results.forEach(result => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = result.link;
            a.textContent = result.title;
            li.appendChild(a);
            resultsList.appendChild(li);
        });
        
        searchResults.appendChild(resultsList);
    }
};

// Cookie consent handler
const cookieConsent = {
    init() {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            this.showConsentBanner();
        }
    },
    showConsentBanner() {
        const banner = document.getElementById('cookie-consent');
        const acceptButton = document.getElementById('accept-cookies');
        
        banner.style.display = 'block';
        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            banner.style.display = 'none';
        });
    }
};

// Back to top button
const backToTop = {
    init() {
        const button = document.getElementById('back-to-top');
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                button.style.display = 'block';
            } else {
                button.style.display = 'none';
            }
        });
        
        button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
};

// Mobile menu handler
const mobileMenu = {
    init() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('show');
            menuToggle.setAttribute(
                'aria-expanded',
                menuToggle.getAttribute('aria-expanded') === 'false' ? 'true' : 'false'
            );
        });
    }
};

// Keyboard navigation and accessibility
const keyboardNav = {
    init() {
        this.setupKeyboardNavigation();
        this.setupFocusIndicator();
        this.setupTabTrapping();
    },

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // ESC key closes any open menus/modals
            if (e.key === 'Escape') {
                this.closeAllMenus();
            }

            // Arrow key navigation in search results
            if (document.activeElement.closest('.search-results')) {
                this.handleSearchResultsNavigation(e);
            }

            // Shortcut keys
            if (e.ctrlKey || e.metaKey) {
                switch(e.key.toLowerCase()) {
                    case 'k':
                        e.preventDefault();
                        document.getElementById('search-input').focus();
                        break;
                    case '/':
                        e.preventDefault();
                        this.showKeyboardHelper();
                        break;
                }
            }
        });
    },

    setupFocusIndicator() {
        // Add visible focus indicators for keyboard navigation
        const style = document.createElement('style');
        style.textContent = `
            *:focus-visible {
                outline: 2px solid var(--primary-color) !important;
                outline-offset: 2px !important;
            }
        `;
        document.head.appendChild(style);
    },

    setupTabTrapping() {
        // Trap focus within modals when they're open
        document.querySelectorAll('.modal').forEach(modal => {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            if (focusableElements.length) {
                const firstFocusable = focusableElements[0];
                const lastFocusable = focusableElements[focusableElements.length - 1];

                modal.addEventListener('keydown', (e) => {
                    if (e.key === 'Tab') {
                        if (e.shiftKey && document.activeElement === firstFocusable) {
                            e.preventDefault();
                            lastFocusable.focus();
                        } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                            e.preventDefault();
                            firstFocusable.focus();
                        }
                    }
                });
            }
        });
    },

    handleSearchResultsNavigation(e) {
        const results = document.querySelectorAll('.search-results a');
        const currentIndex = Array.from(results).indexOf(document.activeElement);

        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (currentIndex < results.length - 1) {
                    results[currentIndex + 1].focus();
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (currentIndex > 0) {
                    results[currentIndex - 1].focus();
                }
                break;
        }
    },

    closeAllMenus() {
        // Close search results
        const searchResults = document.getElementById('search-results');
        if (searchResults) {
            searchResults.innerHTML = '';
        }

        // Close mobile menu
        const navLinks = document.querySelector('.nav-links');
        if (navLinks.classList.contains('show')) {
            navLinks.classList.remove('show');
            document.querySelector('.menu-toggle').setAttribute('aria-expanded', 'false');
        }
    },

    showKeyboardHelper() {
        const helper = document.getElementById('keyboard-nav-helper');
        helper.classList.add('show');
        setTimeout(() => {
            helper.classList.remove('show');
        }, 3000);
    }
};

// Load status tracking
const loadingHandler = {
    init() {
        this.setupLoadingIndicator();
        this.handlePageTransitions();
    },

    setupLoadingIndicator() {
        const loadingOverlay = document.getElementById('loading-overlay');
        
        window.addEventListener('beforeunload', () => {
            loadingOverlay.classList.add('show');
        });
        
        document.addEventListener('DOMContentLoaded', () => {
            loadingOverlay.classList.remove('show');
        });
    },

    handlePageTransitions() {
        document.querySelectorAll('a:not([target="_blank"])').forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.origin === window.location.origin) {
                    const loadingOverlay = document.getElementById('loading-overlay');
                    loadingOverlay.classList.add('show');
                }
            });
        });
    }
};

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    progressTracker.loadProgress();
    searchHandler.init();
    cookieConsent.init();
    backToTop.init();
    mobileMenu.init();
    
    // Initialize AOS (Animate on Scroll)
    AOS.init({
        duration: 1200,
        once: true
    });

    keyboardNav.init();
    loadingHandler.init();
});

// Handle unit completion marking
document.querySelectorAll('.unit-card').forEach(card => {
    const status = card.querySelector('.completion-status i');
    
    card.addEventListener('click', (e) => {
        if (e.target.closest('.unit-link, a')) return; // Don't trigger on link clicks
        
        const isCompleted = status.classList.contains('fa-check-circle');
        if (isCompleted) {
            status.classList.replace('fa-check-circle', 'fa-circle-notch');
            progressTracker.units.completed--;
        } else {
            status.classList.replace('fa-circle-notch', 'fa-check-circle');
            progressTracker.units.completed++;
        }
        progressTracker.updateProgress();
    });
});

// Keyboard Navigation Helper
class KeyboardNavigation {
    constructor() {
        this.currentFocus = 0;
        this.showingHelper = false;
        this.setupKeyboardHelper();
        this.setupEventListeners();
    }

    setupKeyboardHelper() {
        const helper = document.createElement('div');
        helper.className = 'keyboard-nav-helper';
        helper.innerHTML = `
            <p><strong>Keyboard Shortcuts:</strong></p>
            <p>← → : Navigate between sections</p>
            <p>↑ ↓ : Navigate items within section</p>
            <p>Enter : Select/Click item</p>
            <p>? : Toggle this help</p>
            <p>Esc : Close/Back</p>
        `;
        document.body.appendChild(helper);
        this.helper = helper;
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            // Show/hide keyboard helper with '?' key
            if (e.key === '?') {
                this.toggleHelper();
                return;
            }

            // Close helper with Escape
            if (e.key === 'Escape') {
                if (this.showingHelper) {
                    this.hideHelper();
                } else {
                    // Go back if possible
                    const backLink = document.querySelector('.back-link');
                    if (backLink) backLink.click();
                }
                return;
            }

            // Navigation keys
            switch(e.key) {
                case 'ArrowLeft':
                    this.navigateSection(-1);
                    break;
                case 'ArrowRight':
                    this.navigateSection(1);
                    break;
                case 'ArrowUp':
                    this.navigateItem(-1);
                    break;
                case 'ArrowDown':
                    this.navigateItem(1);
                    break;
                case 'Enter':
                    this.selectCurrentItem();
                    break;
            }
        });

        // Hide helper when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.helper.contains(e.target)) {
                this.hideHelper();
            }
        });
    }

    toggleHelper() {
        this.helper.classList.toggle('show');
        this.showingHelper = !this.showingHelper;
    }

    hideHelper() {
        this.helper.classList.remove('show');
        this.showingHelper = false;
    }

    navigateSection(direction) {
        const sections = document.querySelectorAll('section');
        if (!sections.length) return;

        const currentSection = document.activeElement.closest('section');
        let nextIndex = 0;

        if (currentSection) {
            const currentIndex = Array.from(sections).indexOf(currentSection);
            nextIndex = (currentIndex + direction + sections.length) % sections.length;
        }

        const nextSection = sections[nextIndex];
        const firstFocusable = this.getFirstFocusableElement(nextSection);
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }

    navigateItem(direction) {
        const currentSection = document.activeElement.closest('section');
        if (!currentSection) return;

        const focusableElements = this.getFocusableElements(currentSection);
        if (!focusableElements.length) return;

        const currentIndex = focusableElements.indexOf(document.activeElement);
        let nextIndex;

        if (currentIndex === -1) {
            nextIndex = direction > 0 ? 0 : focusableElements.length - 1;
        } else {
            nextIndex = (currentIndex + direction + focusableElements.length) % focusableElements.length;
        }

        focusableElements[nextIndex].focus();
    }

    selectCurrentItem() {
        const focused = document.activeElement;
        if (focused && focused.tagName !== 'BODY') {
            focused.click();
        }
    }

    getFocusableElements(parent) {
        return Array.from(parent.querySelectorAll(
            'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
        )).filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
    }

    getFirstFocusableElement(parent) {
        const elements = this.getFocusableElements(parent);
        return elements[0];
    }
}

// Progress Tracking
class ProgressTracker {
    constructor() {
        this.data = {
            topics: {},
            questions: {},
            timeSpent: {}
        };
        this.loadProgress();
        this.trackTimeSpent();
    }

    loadProgress() {
        const saved = localStorage.getItem('physicsProgress');
        if (saved) {
            this.data = JSON.parse(saved);
        }
    }

    saveProgress() {
        localStorage.setItem('physicsProgress', JSON.stringify(this.data));
    }

    updateTopicProgress(unitId, topicId, completed) {
        if (!this.data.topics[unitId]) {
            this.data.topics[unitId] = {};
        }
        this.data.topics[unitId][topicId] = completed;
        this.saveProgress();
    }

    updateQuestionProgress(unitId, questionId, solved) {
        if (!this.data.questions[unitId]) {
            this.data.questions[unitId] = {};
        }
        this.data.questions[unitId][questionId] = solved;
        this.saveProgress();
    }

    trackTimeSpent() {
        const currentPage = window.location.pathname;
        const startTime = Date.now();

        window.addEventListener('beforeunload', () => {
            const timeSpent = (Date.now() - startTime) / 1000; // Convert to seconds
            if (!this.data.timeSpent[currentPage]) {
                this.data.timeSpent[currentPage] = 0;
            }
            this.data.timeSpent[currentPage] += timeSpent;
            this.saveProgress();
        });
    }

    getUnitProgress(unitId) {
        const topics = this.data.topics[unitId] || {};
        const total = Object.keys(topics).length;
        const completed = Object.values(topics).filter(Boolean).length;
        return {
            completed,
            total,
            percentage: total ? Math.round((completed / total) * 100) : 0
        };
    }

    getQuestionProgress(unitId) {
        const questions = this.data.questions[unitId] || {};
        const total = Object.keys(questions).length;
        const solved = Object.values(questions).filter(Boolean).length;
        return {
            solved,
            total,
            percentage: total ? Math.round((solved / total) * 100) : 0
        };
    }

    getTotalTimeSpent() {
        return Object.values(this.data.timeSpent).reduce((a, b) => a + b, 0);
    }
}

// Initialize keyboard navigation and progress tracking
document.addEventListener('DOMContentLoaded', () => {
    window.keyboardNav = new KeyboardNavigation();
    window.progressTracker = new ProgressTracker();
    
    // Update progress displays if they exist on the page
    const progressElements = document.querySelectorAll('[data-progress]');
    progressElements.forEach(element => {
        const type = element.dataset.progress;
        const unitId = element.dataset.unit;
        
        if (type === 'topics') {
            const progress = window.progressTracker.getUnitProgress(unitId);
            element.textContent = `${progress.percentage}%`;
        } else if (type === 'questions') {
            const progress = window.progressTracker.getQuestionProgress(unitId);
            element.textContent = progress.solved;
        }
    });
});

// Loading Management
class LoadingManager {
    constructor() {
        this.setupLoadingOverlay();
    }

    setupLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="spinner"></div>
            <p>Loading...</p>
        `;
        document.body.appendChild(overlay);
        this.overlay = overlay;
    }

    showLoading() {
        this.overlay.classList.add('show');
    }

    hideLoading() {
        this.overlay.classList.remove('show');
    }
}

window.loadingManager = new LoadingManager();