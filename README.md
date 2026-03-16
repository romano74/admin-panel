# Admin Panel

A full-stack admin panel built with Spring Boot and PostgreSQL, featuring complete CRUD operations,
real-time search, pagination, and CSV export. Deployed on Railway.

## Features

- **User Management** — Create, read, update, delete users with search, pagination and sorting
- **Product Management** — Full product lifecycle with optional user assignment
- **User-Product Relationships** — One-to-Many relational data modeling
- **CSV Export** — Export users and products to CSV
- **Dashboard** — Live counts and recent activity overview
- **Responsive UI** — SB Admin 2 Bootstrap theme
- **REST API** — Clean JSON endpoints for all resources

## Tech Stack

**Backend:**
- Java 25
- Spring Boot 4.x
- Spring Data JPA / Hibernate
- PostgreSQL
- Maven

**Frontend:**
- HTML / CSS / JavaScript
- jQuery
- Bootstrap 4 (SB Admin 2)

## Prerequisites

- Java 25
- PostgreSQL
- Maven 3.6+

## Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/romano74/admin-panel.git
cd admin-panel
```

2. **Create local database**
```sql
CREATE DATABASE demo_db;
```

3. **Configure local properties**

Create `src/main/resources/application-local.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/demo_db
spring.datasource.username=postgres
spring.datasource.password=yourpassword
```

4. **Run with local profile**
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

5. **Open in browser**
```
http://localhost:8080
```

## Deployment

Deployed on **Railway** using PostgreSQL plugin. The app reads database
connection from Railway environment variables automatically:
```properties
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DATABASE_USERNAME}
spring.datasource.password=${DATABASE_PASSWORD}
```

No manual configuration required on Railway — push to `main` and it deploys automatically.

## Project Structure
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
│   ├── css/
│   ├── js/
│   │   ├── app.js              # Navigation logic
│   │   ├── dashboard.js        # Dashboard widgets
│   │   ├── users.js            # User management
│   │   └── products.js         # Product management
│   ├── vendor/                 # Bootstrap & jQuery
│   └── index.html              # SPA entry point
├── application.properties       # Railway / production config
└── application-local.properties # Local config (not committed)
```

## API Endpoints

### Users
```
GET    /api/users               # List users (paginated, searchable)
GET    /api/users/{id}          # Get user by ID
POST   /api/users               # Create user
PUT    /api/users/{id}          # Update user
DELETE /api/users/{id}          # Delete user
GET    /api/users/export/csv    # Export to CSV
```

### Products
```
GET    /api/products            # List products (paginated, searchable)
GET    /api/products/{id}       # Get product by ID
POST   /api/products            # Create product
PUT    /api/products/{id}       # Update product
DELETE /api/products/{id}       # Delete product
GET    /api/products/export/csv # Export to CSV
```

## Database Schema

### Users
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    address VARCHAR(255),
    birth_date VARCHAR(50)
);
```

### Products
```sql
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INT,
    description TEXT,
    user_id BIGINT REFERENCES users(id)
);
```

## Roadmap

- [ ] JWT Authentication
- [ ] Role-based access control
- [ ] User avatar upload
- [ ] Product images
- [ ] Bulk operations
- [ ] Email notifications

## Author

**Roman**
- GitHub: [@romano74](https://github.com/romano74)