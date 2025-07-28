package com.northwind.repository;

import com.northwind.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    List<Product> findByDiscontinuedFalse();
    
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.category.categoryId = :categoryId")
    List<Product> findByCategoryId(@Param("categoryId") Long categoryId);
    
    @Query("SELECT p FROM Product p WHERE p.supplier.supplierId = :supplierId")
    List<Product> findBySupplierId(@Param("supplierId") Long supplierId);
    
    @Query("SELECT p FROM Product p WHERE p.unitsInStock <= p.reorderLevel")
    List<Product> findLowStockProducts();
}
