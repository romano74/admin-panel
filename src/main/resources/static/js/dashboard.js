// DASHBOARD.JS

function loadDashboard() {

    // Fetch total users count from our API
    $.get('/api/users', function(data) {

        const totalUsers = data.totalItems;

        // Build dashboard HTML using SB Admin 2 card structure
        const html = `
            <!-- Page Heading -->
            <div class="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 class="h3 mb-0 text-gray-800">Dashboard</h1>
            </div>

            <!-- Stats Cards Row -->
            <div class="row">

                <!-- Total Users Card -->
                <div class="col-xl-3 col-md-6 mb-4">
                    <div class="card border-left-primary shadow h-100 py-2 stat-card">
                        <div class="card-body">
                            <div class="row no-gutters align-items-center">
                                <div class="col mr-2">
                                    <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                        Total Users
                                    </div>
                                    <div class="h5 mb-0 font-weight-bold text-gray-800">
                                        ${totalUsers}
                                    </div>
                                </div>
                                <div class="col-auto">
                                    <i class="fas fa-users fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Total Products Card -->
                <div class="col-xl-3 col-md-6 mb-4">
                    <div class="card border-left-success shadow h-100 py-2 stat-card">
                        <div class="card-body">
                            <div class="row no-gutters align-items-center">
                                <div class="col mr-2">
                                    <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                        Total Products
                                    </div>
                                    <div class="h5 mb-0 font-weight-bold text-gray-800" id="total-products">
                                        0
                                    </div>
                                </div>
                                <div class="col-auto">
                                    <i class="fas fa-box fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Active Sessions Card -->
                <div class="col-xl-3 col-md-6 mb-4">
                    <div class="card border-left-info shadow h-100 py-2 stat-card">
                        <div class="card-body">
                            <div class="row no-gutters align-items-center">
                                <div class="col mr-2">
                                    <div class="text-xs font-weight-bold text-info text-uppercase mb-1">
                                        Active Sessions
                                    </div>
                                    <div class="h5 mb-0 font-weight-bold text-gray-800">
                                        1
                                    </div>
                                </div>
                                <div class="col-auto">
                                    <i class="fas fa-laptop fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- System Status Card -->
                <div class="col-xl-3 col-md-6 mb-4">
                    <div class="card border-left-warning shadow h-100 py-2 stat-card">
                        <div class="card-body">
                            <div class="row no-gutters align-items-center">
                                <div class="col mr-2">
                                    <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                        System Status
                                    </div>
                                    <div class="h5 mb-0 font-weight-bold text-gray-800">
                                        Online
                                    </div>
                                </div>
                                <div class="col-auto">
                                    <i class="fas fa-server fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <!-- End Stats Cards Row -->

            <!-- Recent Users Row -->
            <div class="row">
                <div class="col-12">
                    <div class="card shadow mb-4">
                        <div class="card-header py-3 d-flex justify-content-between align-items-center">
                            <h6 class="m-0 font-weight-bold text-primary">Recent Users</h6>
                            <button class="btn btn-sm btn-primary" onclick="showSection('users')">
                                View All
                            </button>
                        </div>
                        <div class="card-body">
                            <div id="recent-users-table"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Inject HTML into dashboard section
        $('#dashboard-content').html(html);



        // Load recent users table
        loadRecentUsers();
        loadRecentProducts();
    });
}


function loadRecentProducts() {
    // Fetch products count
    $.get('/api/products?page=0&size=1', function(data) {
        $('#total-products').text(data.totalItems || 0);
    });

}

// LOAD RECENT USERS TABLE
function loadRecentUsers() {
    $.get('/api/users?page=0&size=5&sortBy=id&sortDir=desc', function(data) {

        const users = data.users;

        if (users.length === 0) {
            $('#recent-users-table').html('<p class="text-center text-gray-500">No users found.</p>');
            return;
        }

        let tableHtml = `
            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        // Loop through users and build table rows
        $.each(users, function(index, user) {
            tableHtml += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>
                        <button class="btn btn-sm btn-primary btn-action"
                            onclick="showSection('users')">
                            <i class="fas fa-eye"></i> View
                        </button>
                    </td>
                </tr>
            `;
        });

        tableHtml += `
                    </tbody>
                </table>
            </div>
        `;

        $('#recent-users-table').html(tableHtml);
    });
}