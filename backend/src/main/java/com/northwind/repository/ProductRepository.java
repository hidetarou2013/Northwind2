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
    
    // 論理削除されていない商品のみを取得
    List<Product> findByDeletedFalse();
    
    Page<Product> findByDeletedFalse(Pageable pageable);
    
    List<Product> findByDiscontinuedFalseAndDeletedFalse();
    
    Page<Product> findByNameContainingIgnoreCaseAndDeletedFalse(String name, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.category.categoryId = :categoryId AND p.deleted = false")
    List<Product> findByCategoryId(@Param("categoryId") Long categoryId);
    
    @Query("SELECT p FROM Product p WHERE p.supplier.supplierId = :supplierId AND p.deleted = false")
    List<Product> findBySupplierId(@Param("supplierId") Long supplierId);
    
    @Query("SELECT p FROM Product p WHERE p.unitsInStock <= p.reorderLevel AND p.deleted = false")
    List<Product> findLowStockProducts();
    
    // 削除済み商品を取得（管理用）
    List<Product> findByDeletedTrue();
    
    Page<Product> findByDeletedTrue(Pageable pageable);
    
    // 商品IDで削除済みかどうかをチェック
    @Query("SELECT p.deleted FROM Product p WHERE p.productId = :productId")
    Boolean isDeleted(@Param("productId") Long productId);
}
