// APP.JS - Main navigation controller

// Section hardcoded titles for topbar
const sectionTitles = {
    dashboard: 'Dashboard',
    users: 'User Management',
    products: 'Products',
    settings: 'Settings'
};

// SHOW SECTION
function showSection(sectionName) {

    // 1. Hide ALL sections
    $('.section').removeClass('active');

    // 2. Show ONLY the requested section
    $('#' + sectionName).addClass('active');

    // 3. Remove 'active' class from ALL nav items
    $('.nav-item').removeClass('active');

    // 4. Add 'active' class to clicked nav item
    $('#nav-' + sectionName).addClass('active');

    // 5. Update topbar title
    $('#topbar-title').text(sectionTitles[sectionName]);
}

//  DOCUMENT READY
// This runs when the page fully loads
$(document).ready(function() {

    // Load (show) dashboard by default when page loads
    showSection('dashboard');

    // Initialize each section
    loadDashboard();
    loadUsers();
    loadProducts();

});