// ======= USERS.JS =======

let userEditMode = false;
let currentUserId = null;

// ======= LOAD USERS SECTION =======
function loadUsers() {

    // Build the users section HTML
    const html = `
        <!-- Page Heading -->
        <div class="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 class="h3 mb-0 text-gray-800">User Management</h1>
            <button class="btn btn-primary btn-sm shadow-sm" onclick="showUserForm()">
                <i class="fas fa-plus fa-sm text-white-50"></i> Add New User
            </button>
        </div>

        <!-- Add/Edit User Form (hidden by default) -->
        <div id="user-form-card" class="form-card" style="display:none;">
            <h5 id="user-form-title" class="font-weight-bold text-primary mb-3">Add New User</h5>
            <form id="user-form">
                <input type="hidden" id="user-id">
                <div class="form-row">
                    <div class="form-group col-md-6">
                        <label>Name</label>
                        <input type="text" class="form-control" id="user-name" placeholder="Enter name" required>
                    </div>
                    <div class="form-group col-md-6">
                        <label>Email</label>
                        <input type="email" class="form-control" id="user-email" placeholder="Enter email" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group col-md-6">
                        <label>Phone</label>
                        <input type="text" class="form-control" id="user-phone" placeholder="Enter phone">
                    </div>
                    <div class="form-group col-md-6">
                        <label>Birth Date</label>
                        <input type="date" class="form-control" id="user-birthdate">
                    </div>
                </div>
                <div class="form-group">
                    <label>Address</label>
                    <input type="text" class="form-control" id="user-address" placeholder="Enter address">
                </div>
                <button type="submit" class="btn btn-primary btn-sm">
                    <i class="fas fa-save"></i>
                    <span id="user-submit-btn-text">Save User</span>
                </button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="hideUserForm()">
                    <i class="fas fa-times"></i> Cancel
                </button>
            </form>
        </div>

        <!-- Users Table Card -->
        <div class="card shadow mb-4">
            <div class="card-header py-3 d-flex justify-content-between align-items-center">
                <h6 class="m-0 font-weight-bold text-primary">All Users</h6>
                <!-- Search and Export -->
                <div class="d-flex align-items-center">
                    <input type="text" id="user-search" class="form-control form-control-sm mr-2"
                        placeholder="Search users..." style="width: 200px;">
                    <button class="btn btn-success btn-sm" onclick="exportUsersCSV()">
                        <i class="fas fa-download"></i> Export CSV
                    </button>
                </div>
            </div>
            <div class="card-body">
                <div id="users-table"></div>
                <div id="users-pagination" class="d-flex justify-content-between align-items-center mt-3"></div>
            </div>
        </div>
    `;

    $('#users-content').html(html);

    // Load users table data
    fetchUsers();

    // Search - trigger after user stops typing (debounce)
    $(document).on('keyup', '#user-search', function() {
        clearTimeout(window.searchTimer);
        window.searchTimer = setTimeout(function() {
            fetchUsers(0);
        }, 400);
    });

    // Form submit handler
    $(document).on('submit', '#user-form', function(e) {
        e.preventDefault();
        saveUser();
    });
}

// ======= FETCH USERS FROM API =======
function fetchUsers(page = 0, sortBy = 'id', sortDir = 'asc') {

    const search = $('#user-search').val() || '';
    const url = `/api/users?page=${page}&size=10&sortBy=${sortBy}&sortDir=${sortDir}&search=${search}`;

    $.get(url, function(data) {
        renderUsersTable(data.users);
        renderPagination(data.currentPage, data.totalPages);
    });
}

// ======= RENDER USERS TABLE =======
function renderUsersTable(users) {

    if (users.length === 0) {
        $('#users-table').html('<p class="text-center text-gray-500 mt-3">No users found.</p>');
        return;
    }

    let html = `
        <div class="table-responsive">
            <table class="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th style="cursor:pointer" onclick="fetchUsers(0, 'id', 'asc')">
                            ID <i class="fas fa-sort"></i>
                        </th>
                        <th style="cursor:pointer" onclick="fetchUsers(0, 'name', 'asc')">
                            Name <i class="fas fa-sort"></i>
                        </th>
                        <th style="cursor:pointer" onclick="fetchUsers(0, 'email', 'asc')">
                            Email <i class="fas fa-sort"></i>
                        </th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
    `;

    $.each(users, function(index, user) {
        html += `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone || '-'}</td>
                <td>${user.address || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-primary btn-action" onclick="editUser(${user.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger btn-action" onclick="deleteUser(${user.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `;
    });

    html += `</tbody></table></div>`;
    $('#users-table').html(html);
}

// ======= RENDER PAGINATION =======
function renderPagination(currentPage, totalPages) {

    if (totalPages <= 1) {
        $('#users-pagination').html('');
        return;
    }

    let html = `<small class="text-gray-500">Page ${currentPage + 1} of ${totalPages}</small>`;
    html += `<div>`;

    // Previous button
    if (currentPage > 0) {
        html += `<button class="btn btn-sm btn-outline-primary mr-1"
                    onclick="fetchUsers(${currentPage - 1})">
                    <i class="fas fa-chevron-left"></i> Prev
                 </button>`;
    }

    // Next button
    if (currentPage < totalPages - 1) {
        html += `<button class="btn btn-sm btn-outline-primary"
                    onclick="fetchUsers(${currentPage + 1})">
                    Next <i class="fas fa-chevron-right"></i>
                 </button>`;
    }

    html += `</div>`;
    $('#users-pagination').html(html);
}

// ======= SHOW / HIDE FORM =======
function showUserForm() {
    userEditMode = false;
    currentUserId = null;
    $('#user-form-title').text('Add New User');
    $('#user-submit-btn-text').text('Save User');
    $('#user-form')[0].reset();
    $('#user-form-card').slideDown();
}

function hideUserForm() {
    $('#user-form-card').slideUp();
    $('#user-form')[0].reset();
    userEditMode = false;
    currentUserId = null;
}

// ======= SAVE USER (Create or Update) =======
function saveUser() {

    // Collect form data
    const userData = {
        name: $('#user-name').val(),
        email: $('#user-email').val(),
        phone: $('#user-phone').val(),
        address: $('#user-address').val(),
        birthDate: $('#user-birthdate').val()
    };

    if (userEditMode && currentUserId) {
        // UPDATE existing user - PUT request
        $.ajax({
            url: `/api/users/${currentUserId}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(userData),
            success: function() {
                hideUserForm();
                fetchUsers();
                showAlert('success', 'User updated successfully!');
            },
            error: function() {
                showAlert('danger', 'Failed to update user!');
            }
        });
    } else {
        // CREATE new user - POST request
        $.ajax({
            url: '/api/users',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(userData),
            success: function() {
                hideUserForm();
                fetchUsers();
                showAlert('success', 'User created successfully!');
            },
            error: function() {
                showAlert('danger', 'Failed to create user!');
            }
        });
    }
}

// ======= EDIT USER =======
function editUser(id) {

    // Fetch user data from API
    $.get(`/api/users/${id}`, function(user) {
        userEditMode = true;
        currentUserId = id;

        // Populate form fields
        $('#user-id').val(user.id);
        $('#user-name').val(user.name);
        $('#user-email').val(user.email);
        $('#user-phone').val(user.phone || '');
        $('#user-address').val(user.address || '');
        $('#user-birthdate').val(user.birthDate || '');

        // Update form title and button
        $('#user-form-title').text('Edit User');
        $('#user-submit-btn-text').text('Update User');

        // Show form with animation
        $('#user-form-card').slideDown();

        // Scroll to form
        $('html, body').animate({
            scrollTop: $('#user-form-card').offset().top - 100
        }, 400);
    });
}

// ======= DELETE USER =======
function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        $.ajax({
            url: `/api/users/${id}`,
            method: 'DELETE',
            success: function() {
                fetchUsers();
                showAlert('success', 'User deleted successfully!');
            },
            error: function() {
                showAlert('danger', 'Failed to delete user!');
            }
        });
    }
}

// ======= EXPORT CSV =======
function exportUsersCSV() {
    window.location.href = '/api/users/export/csv';
}

// ======= SHOW ALERT =======
function showAlert(type, message) {
    const alert = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert"
            style="position:fixed; top:20px; right:20px; z-index:9999; min-width:250px;">
            ${message}
            <button type="button" class="close" data-dismiss="alert">
                <span>&times;</span>
            </button>
        </div>
    `;
    $('body').append(alert);

    // Auto dismiss after 3 seconds
    setTimeout(function() {
        $('.alert').fadeOut(function() {
            $(this).remove();
        });
    }, 3000);
}