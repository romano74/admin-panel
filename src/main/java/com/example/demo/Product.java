package com.example.demo;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private BigDecimal price;

    @Column
    private Integer stock;

    @Column(columnDefinition = "TEXT")
    private String description;

    // ======= RELATIONSHIP =======
    // Many products can belong to one user
    // nullable = true means user is OPTIONAL
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    // ======= CONSTRUCTORS =======
    public Product() {}

    public Product(String name, BigDecimal price, Integer stock, String description) {
        this.name = name;
        this.price = price;
        this.stock = stock;
        this.description = description;
    }

    // ======= GETTERS AND SETTERS =======
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}