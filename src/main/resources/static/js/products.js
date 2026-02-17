// ======= PRODUCTS.JS =======

let productEditMode = false;
let currentProductId = null;

// ======= LOAD PRODUCTS SECTION =======
function loadProducts() {

    // First fetch users for the dropdown
    $.get('/api/users?page=0&size=100', function(data) {

        const users = data.users;

        // Build users dropdown options
        let userOptions = '<option value="">-- No User Assigned --</option>';
        $.each(users, function(index, user) {
            userOptions += `<option value="${user.id}">${user.name}</option>`;
        });

        // Build products section HTML
        const html = `
            <!-- Page Heading -->
            <div class="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 class="h3 mb-0 text-gray-800">Products</h1>
                <button class="btn btn-primary btn-sm shadow-sm" onclick="showProductForm()">
                    <i class="fas fa-plus fa-sm text-white-50"></i> Add New Product
                </button>
            </div>

            <!-- Add/Edit Product Form (hidden by default) -->
            <div id="product-form-card" class="form-card" style="display:none;">
                <h5 id="product-form-title" class="font-weight-bold text-primary mb-3">
                    Add New Product
                </h5>
                <form id="product-form">
                    <input type="hidden" id="product-id">
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label>Name</label>
                            <input type="text" class="form-control" id="product-name"
                                placeholder="Enter product name" required>
                        </div>
                        <div class="form-group col-md-3">
                            <label>Price</label>
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">$</span>
                                </div>
                                <input type="number" step="0.01" min="0"
                                    class="form-control" id="product-price"
                                    placeholder="0.00" required>
                            </div>
                        </div>
                        <div class="form-group col-md-3">
                            <label>Stock</label>
                            <input type="number" min="0" class="form-control"
                                id="product-stock" placeholder="0" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group col-md-8">
                            <label>Description</label>
                            <textarea class="form-control" id="product-description"
                                rows="2" placeholder="Enter product description"></textarea>
                        </div>
                        <div class="form-group col-md-4">
                            <label>Assign to User</label>
                            <select class="form-control" id="product-user">
                                ${userOptions}
                            </select>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary btn-sm">
                        <i class="fas fa-save"></i>
                        <span id="product-submit-btn-text">Save Product</span>
                    </button>
                    <button type="button" class="btn btn-secondary btn-sm"
                        onclick="hideProductForm()">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </form>
            </div>

            <!-- Products Table Card -->
            <div class="card shadow mb-4">
                <div class="card-header py-3 d-flex justify-content-between align-items-center">
                    <h6 class="m-0 font-weight-bold text-primary">All Products</h6>
                    <div class="d-flex align-items-center">
                        <input type="text" id="product-search" 
                            class="form-control form-control-sm mr-2"
                            placeholder="Search products..." style="width: 200px;">
                        <button class="btn btn-success btn-sm" onclick="exportProductsCSV()">
                            <i class="fas fa-download"></i> Export CSV
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <div id="products-table"></div>
                    <div id="products-pagination" 
                        class="d-flex justify-content-between align-items-center mt-3">
                    </div>
                </div>
            </div>
        `;

        $('#products-content').html(html);

        // Load products table data
        fetchProducts();

        // Search debounce
        $(document).on('keyup', '#product-search', function() {
            clearTimeout(window.productSearchTimer);
            window.productSearchTimer = setTimeout(function() {
                fetchProducts(0);
            }, 400);
        });

        // Form submit handler
        $(document).on('submit', '#product-form', function(e) {
            e.preventDefault();
            saveProduct();
        });
    });
}

// ======= FETCH PRODUCTS FROM API =======
function fetchProducts(page = 0, sortBy = 'id', sortDir = 'asc') {

    const search = $('#product-search').val() || '';
    const url = `/api/products?page=${page}&size=10&sortBy=${sortBy}&sortDir=${sortDir}&search=${search}`;

    $.get(url, function(data) {
        renderProductsTable(data.products);
        renderProductsPagination(data.currentPage, data.totalPages);
    });
}

// ======= RENDER PRODUCTS TABLE =======
function renderProductsTable(products) {

    if (products.length === 0) {
        $('#products-table').html(
            '<p class="text-center text-gray-500 mt-3">No products found.</p>'
        );
        return;
    }

    let html = `
        <div class="table-responsive">
            <table class="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th style="cursor:pointer" onclick="fetchProducts(0, 'id', 'asc')">
                            ID <i class="fas fa-sort"></i>
                        </th>
                        <th style="cursor:pointer" onclick="fetchProducts(0, 'name', 'asc')">
                            Name <i class="fas fa-sort"></i>
                        </th>
                        <th style="cursor:pointer" onclick="fetchProducts(0, 'price', 'asc')">
                            Price <i class="fas fa-sort"></i>
                        </th>
                        <th style="cursor:pointer" onclick="fetchProducts(0, 'stock', 'asc')">
                            Stock <i class="fas fa-sort"></i>
                        </th>
                        <th>Description</th>
                        <th>Assigned User</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
    `;

    $.each(products, function(index, product) {

        // Stock badge - green if in stock, red if out of stock
        const stockBadge = product.stock > 0
            ? `<span class="badge badge-success">${product.stock}</span>`
            : `<span class="badge badge-danger">Out of Stock</span>`;

        // User badge - show user name or "Unassigned"
        const userBadge = product.user
            ? `<span class="badge badge-primary">${product.user.name}</span>`
            : `<span class="badge badge-secondary">Unassigned</span>`;

        html += `
            <tr>
                <td>${product.id}</td>
                <td><strong>${product.name}</strong></td>
                <td>$${parseFloat(product.price).toFixed(2)}</td>
                <td>${stockBadge}</td>
                <td>${product.description || '-'}</td>
                <td>${userBadge}</td>
                <td>
                    <button class="btn btn-sm btn-primary btn-action"
                        onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger btn-action"
                        onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `;
    });

    html += `</tbody></table></div>`;
    $('#products-table').html(html);
}

// ======= RENDER PAGINATION =======
function renderProductsPagination(currentPage, totalPages) {

    if (totalPages <= 1) {
        $('#products-pagination').html('');
        return;
    }

    let html = `<small class="text-gray-500">Page ${currentPage + 1} of ${totalPages}</small>`;
    html += `<div>`;

    if (currentPage > 0) {
        html += `<button class="btn btn-sm btn-outline-primary mr-1"
                    onclick="fetchProducts(${currentPage - 1})">
                    <i class="fas fa-chevron-left"></i> Prev
                 </button>`;
    }

    if (currentPage < totalPages - 1) {
        html += `<button class="btn btn-sm btn-outline-primary"
                    onclick="fetchProducts(${currentPage + 1})">
                    Next <i class="fas fa-chevron-right"></i>
                 </button>`;
    }

    html += `</div>`;
    $('#products-pagination').html(html);
}

// ======= SHOW / HIDE FORM =======
function showProductForm() {
    productEditMode = false;
    currentProductId = null;
    $('#product-form-title').text('Add New Product');
    $('#product-submit-btn-text').text('Save Product');
    $('#product-form')[0].reset();
    $('#product-form-card').slideDown();
}

function hideProductForm() {
    $('#product-form-card').slideUp();
    $('#product-form')[0].reset();
    productEditMode = false;
    currentProductId = null;
}

// ======= SAVE PRODUCT (Create or Update) =======
function saveProduct() {

    const productData = {
        name: $('#product-name').val(),
        price: $('#product-price').val(),
        stock: $('#product-stock').val(),
        description: $('#product-description').val(),
        userId: $('#product-user').val() || null
    };

    if (productEditMode && currentProductId) {
        // UPDATE - PUT request
        $.ajax({
            url: `/api/products/${currentProductId}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(productData),
            success: function() {
                hideProductForm();
                fetchProducts();
                showAlert('success', 'Product updated successfully!');
            },
            error: function() {
                showAlert('danger', 'Failed to update product!');
            }
        });
    } else {
        // CREATE - POST request
        $.ajax({
            url: '/api/products',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(productData),
            success: function() {
                hideProductForm();
                fetchProducts();
                showAlert('success', 'Product created successfully!');
            },
            error: function() {
                showAlert('danger', 'Failed to create product!');
            }
        });
    }
}

// ======= EDIT PRODUCT =======
function editProduct(id) {

    $.get(`/api/products/${id}`, function(product) {
        productEditMode = true;
        currentProductId = id;

        // Populate form fields
        $('#product-id').val(product.id);
        $('#product-name').val(product.name);
        $('#product-price').val(product.price);
        $('#product-stock').val(product.stock);
        $('#product-description').val(product.description || '');

        // Set user dropdown
        $('#product-user').val(product.user ? product.user.id : '');

        // Update form title and button
        $('#product-form-title').text('Edit Product');
        $('#product-submit-btn-text').text('Update Product');

        // Show form with animation
        $('#product-form-card').slideDown();

        // Scroll to form
        $('html, body').animate({
            scrollTop: $('#product-form-card').offset().top - 100
        }, 400);
    });
}

// ======= DELETE PRODUCT =======
function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        $.ajax({
            url: `/api/products/${id}`,
            method: 'DELETE',
            success: function() {
                fetchProducts();
                showAlert('success', 'Product deleted successfully!');
            },
            error: function() {
                showAlert('danger', 'Failed to delete product!');
            }
        });
    }
}

// ======= EXPORT CSV =======
function exportProductsCSV() {
    window.location.href = '/api/products/export/csv';
}