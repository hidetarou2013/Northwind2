package com.northwind.config;

import com.northwind.entity.*;
import com.northwind.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {
    
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    
    @Override
    public void run(String... args) throws Exception {
        if (categoryRepository.count() == 0) {
            loadSampleData();
        }
    }
    
    private void loadSampleData() {
        log.info("Loading sample data...");
        
        // Categories
        Category beverages = Category.builder()
                .name("Beverages")
                .description("Soft drinks, coffees, teas, beers, and ales")
                .build();
        categoryRepository.save(beverages);
        
        Category condiments = Category.builder()
                .name("Condiments")
                .description("Sweet and savory sauces, relishes, spreads, and seasonings")
                .build();
        categoryRepository.save(condiments);
        
        Category dairy = Category.builder()
                .name("Dairy Products")
                .description("Cheeses")
                .build();
        categoryRepository.save(dairy);
        
        Category seafood = Category.builder()
                .name("Seafood")
                .description("Seaweed and fish")
                .build();
        categoryRepository.save(seafood);
        
        // Products
        Product chai = Product.builder()
                .name("Chai")
                .code("P001")
                .quantityPerUnit("10 boxes x 20 bags")
                .unitPrice(new BigDecimal("18.00"))
                .unitCost(new BigDecimal("15.00"))
                .unitsInStock(39)
                .reorderLevel(10)
                .discontinued(false)
                .category(beverages)
                .build();
        productRepository.save(chai);
        
        Product chang = Product.builder()
                .name("Chang")
                .code("P002")
                .quantityPerUnit("24 - 12 oz bottles")
                .unitPrice(new BigDecimal("19.00"))
                .unitCost(new BigDecimal("16.00"))
                .unitsInStock(17)
                .reorderLevel(25)
                .discontinued(false)
                .category(beverages)
                .build();
        productRepository.save(chang);
        
        Product aniseedSyrup = Product.builder()
                .name("Aniseed Syrup")
                .code("P003")
                .quantityPerUnit("12 - 550 ml bottles")
                .unitPrice(new BigDecimal("10.00"))
                .unitCost(new BigDecimal("8.00"))
                .unitsInStock(13)
                .reorderLevel(25)
                .discontinued(false)
                .category(condiments)
                .build();
        productRepository.save(aniseedSyrup);
        
        Product chefAntonsSeasoning = Product.builder()
                .name("Chef Anton's Cajun Seasoning")
                .code("P004")
                .quantityPerUnit("48 - 6 oz jars")
                .unitPrice(new BigDecimal("22.00"))
                .unitCost(new BigDecimal("18.00"))
                .unitsInStock(53)
                .reorderLevel(0)
                .discontinued(false)
                .category(condiments)
                .build();
        productRepository.save(chefAntonsSeasoning);
        
        Product chefAntonsGumbo = Product.builder()
                .name("Chef Anton's Gumbo Mix")
                .code("P005")
                .quantityPerUnit("36 boxes")
                .unitPrice(new BigDecimal("21.35"))
                .unitCost(new BigDecimal("18.00"))
                .unitsInStock(0)
                .reorderLevel(0)
                .discontinued(true)
                .category(condiments)
                .build();
        productRepository.save(chefAntonsGumbo);
        
        log.info("Sample data loaded successfully!");
    }
}
