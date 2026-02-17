package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    // ======= GET ALL PRODUCTS =======
    @GetMapping
    public Map<String, Object> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String search
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Product> productPage;
        if (search != null && !search.trim().isEmpty()) {
            productPage = productRepository.searchProducts(search, pageable);
        } else {
            productPage = productRepository.findAll(pageable);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("products", productPage.getContent());
        response.put("currentPage", productPage.getNumber());
        response.put("totalItems", productPage.getTotalElements());
        response.put("totalPages", productPage.getTotalPages());

        return response;
    }

    // GET PRODUCT BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(product -> ResponseEntity.ok().body(product))
                .orElse(ResponseEntity.notFound().build());
    }

    // CREATE PRODUCT
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Map<String, Object> payload) {

        Product product = new Product();
        product.setName((String) payload.get("name"));
        product.setDescription((String) payload.get("description"));
        product.setStock(payload.get("stock") != null
                ? Integer.valueOf(payload.get("stock").toString())
                : 0);
        product.setPrice(payload.get("price") != null
                ? new java.math.BigDecimal(payload.get("price").toString())
                : java.math.BigDecimal.ZERO);

        // Assign user if userId provided
        if (payload.get("userId") != null) {
            Long userId = Long.valueOf(payload.get("userId").toString());
            userRepository.findById(userId).ifPresent(product::setUser);
        }

        Product saved = productRepository.save(product);
        return ResponseEntity.ok(saved);
    }

    // UPDATE PRODUCT
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload) {

        return productRepository.findById(id).map(product -> {

            product.setName((String) payload.get("name"));
            product.setDescription((String) payload.get("description"));
            product.setStock(payload.get("stock") != null
                    ? Integer.valueOf(payload.get("stock").toString())
                    : 0);
            product.setPrice(payload.get("price") != null
                    ? new java.math.BigDecimal(payload.get("price").toString())
                    : java.math.BigDecimal.ZERO);

            // Update user assignment
            if (payload.get("userId") != null && !payload.get("userId").toString().isEmpty()) {
                Long userId = Long.valueOf(payload.get("userId").toString());
                userRepository.findById(userId).ifPresent(product::setUser);
            } else {
                // Remove user assignment if userId is null/empty
                product.setUser(null);
            }

            Product updated = productRepository.save(product);
            return ResponseEntity.ok(updated);

        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE PRODUCT
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        return productRepository.findById(id).map(product -> {
            productRepository.delete(product);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // EXPORT CSV
    @GetMapping("/export/csv")
    public ResponseEntity<String> exportToCSV() {
        List<Product> products = productRepository.findAll();

        StringBuilder csv = new StringBuilder();
        csv.append("ID,Name,Price,Stock,Description,User\n");

        for (Product product : products) {
            csv.append(product.getId()).append(",")
                    .append(product.getName()).append(",")
                    .append(product.getPrice()).append(",")
                    .append(product.getStock()).append(",")
                    .append(product.getDescription() != null
                            ? product.getDescription().replace(",", ";")
                            : "").append(",")
                    .append(product.getUser() != null
                            ? product.getUser().getName()
                            : "Unassigned")
                    .append("\n");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "products.csv");

        return ResponseEntity.ok().headers(headers).body(csv.toString());
    }
}