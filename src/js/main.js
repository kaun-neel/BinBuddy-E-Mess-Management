// Global state
let currentUser = null;
let selectedRole = null;

// DOM Elements
const app = document.getElementById('app');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    setupIntersectionObserver();
});

function initializeApp() {
    // Check for saved user session
    const savedUser = localStorage.getItem('binbuddy_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForLoggedInUser();
    }
    
    // Add smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
}

function setupEventListeners() {
    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });
    
    // Handle escape key for modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal.id);
            }
        }
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);
    
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
    }
}

function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe sections for animations
    const sections = document.querySelectorAll('section');
    sections.forEach(section => observer.observe(section));
}

// Navigation functions
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
    } else {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
}

function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    // This would typically show/hide mobile menu
    // For now, we'll just show the role selection modal
    showRoleSelection();
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Modal functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus first input if it exists
        const firstInput = modal.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function showRoleSelection() {
    showModal('roleSelectionModal');
}

function showLoginModal() {
    showModal('loginModal');
}

function showSignupModal() {
    showModal('signupModal');
}

function switchToSignup() {
    closeModal('loginModal');
    showModal('signupModal');
}

function switchToLogin() {
    closeModal('signupModal');
    showModal('loginModal');
}

// Role selection
function selectRole(role) {
    selectedRole = role;
    closeModal('roleSelectionModal');
    
    // Show appropriate form based on role
    if (role === 'donor') {
        showDonorFlow();
    } else if (role === 'receiver') {
        showReceiverFlow();
    }
}

function showDonorFlow() {
    // Create donor dashboard/form
    createDonorInterface();
}

function showReceiverFlow() {
    // Create receiver dashboard/form
    createReceiverInterface();
}

// Authentication
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simulate login (replace with actual authentication)
    if (email && password) {
        currentUser = {
            id: Date.now(),
            email: email,
            name: email.split('@')[0],
            role: selectedRole || 'donor'
        };
        
        localStorage.setItem('binbuddy_user', JSON.stringify(currentUser));
        updateUIForLoggedInUser();
        closeModal('loginModal');
        showSuccessMessage('Welcome back!');
        
        // Redirect to appropriate dashboard
        if (currentUser.role === 'donor') {
            showDonorDashboard();
        } else {
            showReceiverDashboard();
        }
    }
}

function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    // Simulate signup (replace with actual registration)
    if (name && email && password) {
        currentUser = {
            id: Date.now(),
            name: name,
            email: email,
            role: selectedRole || 'donor'
        };
        
        localStorage.setItem('binbuddy_user', JSON.stringify(currentUser));
        updateUIForLoggedInUser();
        closeModal('signupModal');
        showSuccessMessage('Account created successfully!');
        
        // Show role selection if not already selected
        if (!selectedRole) {
            setTimeout(() => showRoleSelection(), 1000);
        } else {
            // Redirect to appropriate dashboard
            if (currentUser.role === 'donor') {
                showDonorDashboard();
            } else {
                showReceiverDashboard();
            }
        }
    }
}

function logout() {
    currentUser = null;
    selectedRole = null;
    localStorage.removeItem('binbuddy_user');
    updateUIForLoggedOutUser();
    showSuccessMessage('Logged out successfully!');
}

function updateUIForLoggedInUser() {
    const navActions = document.querySelector('.nav-actions');
    if (navActions && currentUser) {
        navActions.innerHTML = `
            <div class="user-menu">
                <span class="user-name">Hi, ${currentUser.name}!</span>
                <button class="btn btn-outline" onclick="showDashboard()">Dashboard</button>
                <button class="btn btn-outline" onclick="logout()">Logout</button>
            </div>
        `;
    }
}

function updateUIForLoggedOutUser() {
    const navActions = document.querySelector('.nav-actions');
    if (navActions) {
        navActions.innerHTML = `
            <button class="btn btn-outline" onclick="showLoginModal()">Login</button>
            <button class="btn btn-primary" onclick="showSignupModal()">Sign Up</button>
        `;
    }
}

// Dashboard functions
function showDashboard() {
    if (currentUser) {
        if (currentUser.role === 'donor') {
            showDonorDashboard();
        } else {
            showReceiverDashboard();
        }
    }
}

function showDonorDashboard() {
    // Replace main content with donor dashboard
    const main = document.querySelector('main') || document.querySelector('#app');
    main.innerHTML = createDonorDashboardHTML();
}

function showReceiverDashboard() {
    // Replace main content with receiver dashboard
    const main = document.querySelector('main') || document.querySelector('#app');
    main.innerHTML = createReceiverDashboardHTML();
}

function createDonorInterface() {
    // Create donor-specific interface
    const donorHTML = `
        <div class="donor-interface">
            <div class="container">
                <div class="interface-header">
                    <h2>Donor Dashboard</h2>
                    <p>Share your surplus food with those in need</p>
                </div>
                <div class="donor-actions">
                    <button class="btn btn-primary btn-large" onclick="showPostFoodModal()">
                        Post Available Food
                    </button>
                    <button class="btn btn-outline btn-large" onclick="showMyPosts()">
                        My Posts
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Insert after hero section
    const hero = document.querySelector('.hero');
    hero.insertAdjacentHTML('afterend', donorHTML);
}

function createReceiverInterface() {
    // Create receiver-specific interface
    const receiverHTML = `
        <div class="receiver-interface">
            <div class="container">
                <div class="interface-header">
                    <h2>Receiver Dashboard</h2>
                    <p>Find and request food for your community</p>
                </div>
                <div class="receiver-actions">
                    <button class="btn btn-primary btn-large" onclick="showAvailableFood()">
                        Browse Available Food
                    </button>
                    <button class="btn btn-outline btn-large" onclick="showMyRequests()">
                        My Requests
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Insert after hero section
    const hero = document.querySelector('.hero');
    hero.insertAdjacentHTML('afterend', receiverHTML);
}

function createDonorDashboardHTML() {
    return `
        <div class="dashboard donor-dashboard">
            <div class="container">
                <div class="dashboard-header">
                    <h1>Donor Dashboard</h1>
                    <button class="btn btn-primary" onclick="showPostFoodModal()">Post New Food</button>
                </div>
                
                <div class="dashboard-stats">
                    <div class="stat-card">
                        <div class="stat-number">12</div>
                        <div class="stat-label">Total Posts</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">8</div>
                        <div class="stat-label">Successful Donations</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">45</div>
                        <div class="stat-label">People Helped</div>
                    </div>
                </div>
                
                <div class="dashboard-content">
                    <div class="recent-posts">
                        <h3>Recent Posts</h3>
                        <div class="posts-list">
                            <div class="post-item">
                                <div class="post-info">
                                    <h4>Fresh Vegetables</h4>
                                    <p>Posted 2 hours ago • 5kg available</p>
                                </div>
                                <div class="post-status active">Active</div>
                            </div>
                            <div class="post-item">
                                <div class="post-info">
                                    <h4>Cooked Rice & Curry</h4>
                                    <p>Posted yesterday • Completed</p>
                                </div>
                                <div class="post-status completed">Completed</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createReceiverDashboardHTML() {
    return `
        <div class="dashboard receiver-dashboard">
            <div class="container">
                <div class="dashboard-header">
                    <h1>Receiver Dashboard</h1>
                    <button class="btn btn-primary" onclick="showCreateRequestModal()">Create Request</button>
                </div>
                
                <div class="dashboard-stats">
                    <div class="stat-card">
                        <div class="stat-number">6</div>
                        <div class="stat-label">Active Requests</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">24</div>
                        <div class="stat-label">Successful Pickups</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">120</div>
                        <div class="stat-label">People Fed</div>
                    </div>
                </div>
                
                <div class="dashboard-content">
                    <div class="available-food">
                        <h3>Available Food Near You</h3>
                        <div class="food-list">
                            <div class="food-item">
                                <div class="food-info">
                                    <h4>Fresh Bread & Pastries</h4>
                                    <p>2.3km away • Available until 6 PM</p>
                                </div>
                                <button class="btn btn-outline btn-sm">Request</button>
                            </div>
                            <div class="food-item">
                                <div class="food-info">
                                    <h4>Vegetarian Meals</h4>
                                    <p>1.8km away • 20 portions available</p>
                                </div>
                                <button class="btn btn-outline btn-sm">Request</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Utility functions
function showSuccessMessage(message) {
    // Create and show a toast notification
    const toast = document.createElement('div');
    toast.className = 'toast success';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--primary-500);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: 3000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function showErrorMessage(message) {
    // Similar to success message but with error styling
    const toast = document.createElement('div');
    toast.className = 'toast error';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #ef4444;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: 3000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add CSS for toast animations
const toastStyles = document.createElement('style');
toastStyles.textContent = `
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
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .dashboard {
        padding: 6rem 0 4rem;
        min-height: 100vh;
        background-color: var(--gray-50);
    }
    
    .dashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--gray-200);
    }
    
    .dashboard-header h1 {
        font-size: var(--font-size-3xl);
        font-weight: 700;
        color: var(--gray-900);
    }
    
    .dashboard-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-bottom: 3rem;
    }
    
    .stat-card {
        background: white;
        padding: 1.5rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
        text-align: center;
    }
    
    .stat-card .stat-number {
        font-size: var(--font-size-3xl);
        font-weight: 700;
        color: var(--primary-500);
        display: block;
        margin-bottom: 0.5rem;
    }
    
    .stat-card .stat-label {
        color: var(--gray-600);
        font-size: var(--font-size-sm);
    }
    
    .dashboard-content {
        background: white;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
        padding: 2rem;
    }
    
    .posts-list, .food-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .post-item, .food-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border: 1px solid var(--gray-200);
        border-radius: var(--radius-md);
    }
    
    .post-info h4, .food-info h4 {
        margin: 0 0 0.25rem 0;
        font-weight: 600;
        color: var(--gray-900);
    }
    
    .post-info p, .food-info p {
        margin: 0;
        color: var(--gray-600);
        font-size: var(--font-size-sm);
    }
    
    .post-status {
        padding: 0.25rem 0.75rem;
        border-radius: var(--radius-full);
        font-size: var(--font-size-xs);
        font-weight: 500;
    }
    
    .post-status.active {
        background-color: var(--primary-100);
        color: var(--primary-700);
    }
    
    .post-status.completed {
        background-color: var(--gray-100);
        color: var(--gray-700);
    }
    
    .btn-sm {
        padding: 0.5rem 1rem;
        font-size: var(--font-size-sm);
    }
    
    .user-menu {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .user-name {
        font-weight: 500;
        color: var(--gray-700);
    }
    
    @media (max-width: 768px) {
        .dashboard-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
        }
        
        .user-menu {
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .post-item, .food-item {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
        }
    }
`;
document.head.appendChild(toastStyles);

// Export functions for global access
window.showRoleSelection = showRoleSelection;
window.showLoginModal = showLoginModal;
window.showSignupModal = showSignupModal;
window.closeModal = closeModal;
window.selectRole = selectRole;
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.switchToSignup = switchToSignup;
window.switchToLogin = switchToLogin;
window.scrollToSection = scrollToSection;
window.toggleMobileMenu = toggleMobileMenu;
window.logout = logout;
window.showDashboard = showDashboard;