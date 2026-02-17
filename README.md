# Admin Panel - Spring Boot Learning Project

A full-stack admin panel built with Spring Boot, Hibernate, and MySQL. Features complete CRUD operations for users and products with a modern Bootstrap interface.

## Purpose

This is a learning project created to understand:
- Spring Boot framework
- Hibernate ORM
- REST API development
- MySQL database integration
- Bootstrap frontend design

## Features

- **User Management** - Full CRUD with search, pagination, sorting
- **Product Management** - Complete product lifecycle management
- **User-Product Relationships** - One-to-Many database relationships
- **CSV Export** - Export data to CSV files
- **Responsive UI** - SB Admin 2 Bootstrap theme
- **Search & Filter** - Real-time search with debouncing
- **Pagination** - Server-side pagination for large datasets

## Tech Stack

**Backend:**
- Java 17
- Spring Boot 3.x
- Spring Data JPA
- Hibernate
- MySQL
- Maven

**Frontend:**
- HTML/CSS/JavaScript
- jQuery
- Bootstrap 4 (SB Admin 2)

## 📋 Prerequisites

- Java 17 (Temurin/OpenJDK)
- MySQL 8.0+
- IntelliJ IDEA (recommended)
- Maven 3.6+

## 🚀 Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/romano74/admin-panel.git
cd admin-panel
```

2. **Create database**
```sql
CREATE DATABASE demo_db;
```

3. **Configure database in `application.properties`**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/demo_db
spring.datasource.username=root
spring.datasource.password=your_password
```

4. **Run the application**
```bash
mvn spring-boot:run
```

5. **Open in browser**
```
http://localhost:8080
```

## 📁 Project Structure
```
src/main/java/com/example/demo/
├── User.java                    # User entity
├── UserController.java          # User REST API
├── UserRepository.java          # User data access
├── Product.java                 # Product entity
├── ProductController.java       # Product REST API
├── ProductRepository.java       # Product data access
└── DemoApplication.java         # Main application

src/main/resources/
├── static/
│   ├── css/                     # Stylesheets
│   ├── js/
│   │   ├── app.js              # Navigation logic
│   │   ├── dashboard.js        # Dashboard widgets
│   │   ├── users.js            # User management
│   │   └── products.js         # Product management
│   ├── vendor/                 # Bootstrap & jQuery
│   └── index.html              # SPA entry point
└── application.properties
```

## 🎨 Features Breakdown

### User Management
- Create, read, update, delete users
- Search users by name or email
- Pagination (10 users per page)
- Sorting by any column
- Export to CSV
- Fields: name, email, phone, address, birth date

### Product Management
- Full CRUD for products
- Assign products to users (optional relationship)
- Search products by name or description
- Fields: name, price, stock, description, assigned user

### Dashboard
- Total users count
- Total products count
- Recent users list
- Quick navigation

## 🔌 API Endpoints

### Users
```
GET    /api/users              # List users (paginated, searchable)
GET    /api/users/{id}         # Get user by ID
POST   /api/users              # Create user
PUT    /api/users/{id}         # Update user
DELETE /api/users/{id}         # Delete user
GET    /api/users/export/csv   # Export to CSV
```

### Products
```
GET    /api/products           # List products (paginated, searchable)
GET    /api/products/{id}      # Get product by ID
POST   /api/products           # Create product
PUT    /api/products/{id}      # Update product
DELETE /api/products/{id}      # Delete product
GET    /api/products/export/csv # Export to CSV
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    address VARCHAR(255),
    birth_date VARCHAR(50)
);
```

### Products Table
```sql
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INT,
    description TEXT,
    user_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## What I Learned

- Spring Boot application structure
- JPA entities and relationships (@OneToMany, @ManyToOne)
- Repository pattern with Spring Data JPA
- REST API design
- Request parameters (pagination, sorting, search)
- Front-end integration with jQuery
- Single Page Application (SPA) navigation
- Bootstrap admin templates

## Learning Journey

This project was built as part of learning Java enterprise development, coming from a PHP/MySQL/JavaScript background. It demonstrates:
- Backend API development
- Database relationship modeling
- Modern frontend patterns
- Clean separation of concerns

## Future Improvements

- Add authentication (JWT)
- Implement role-based access control
- Add file upload for user avatars
- Product images
- Advanced filtering
- Bulk operations
- Email notifications

## Author

**Roman**
- GitHub: [@romano74](https://github.com/romano74)

## Acknowledgments

- Spring Boot documentation
- SB Admin 2 Bootstrap theme by Start Bootstrap
- Claude AI for guidance and teaching

---

**Learning Project - Spring Boot & Hibernate** 