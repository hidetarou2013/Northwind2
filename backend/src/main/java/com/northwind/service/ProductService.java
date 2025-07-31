package com.northwind.service;

import com.northwind.dto.ProductDto;
import com.northwind.entity.Category;
import com.northwind.entity.Product;
import com.northwind.exception.CannotDeleteProductException;
import com.northwind.exception.ProductNotFoundException;
import com.northwind.repository.CategoryRepository;
import com.northwind.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {
    
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;
    
    public List<ProductDto> getAllProducts() {
        return productRepository.findByDeletedFalse()
                .stream()
                .map(productMapper::toDto)
                .toList();
    }
    
    public Page<ProductDto> getAllProducts(Pageable pageable) {
        return productRepository.findByDeletedFalse(pageable)
                .map(productMapper::toDto);
    }
    
    public Optional<ProductDto> getProductById(Long id) {
        return productRepository.findById(id)
                .filter(product -> !product.getDeleted())
                .map(productMapper::toDto);
    }
    
    public List<ProductDto> getActiveProducts() {
        return productRepository.findByDiscontinuedFalseAndDeletedFalse()
                .stream()
                .map(productMapper::toDto)
                .toList();
    }
    
    public Page<ProductDto> searchProducts(String name, Pageable pageable) {
        return productRepository.findByNameContainingIgnoreCaseAndDeletedFalse(name, pageable)
                .map(productMapper::toDto);
    }
    
    public List<ProductDto> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId)
                .stream()
                .map(productMapper::toDto)
                .toList();
    }
    
    public List<ProductDto> getLowStockProducts() {
        return productRepository.findLowStockProducts()
                .stream()
                .map(productMapper::toDto)
                .toList();
    }
    
    // 削除済み商品を取得（管理用）
    public List<ProductDto> getDeletedProducts() {
        return productRepository.findByDeletedTrue()
                .stream()
                .map(productMapper::toDto)
                .toList();
    }
    
    // 削除前の検証ロジック
    private void validateProductDeletion(Product product) {
        // 1. 在庫チェック
        if (product.getUnitsInStock() != null && product.getUnitsInStock() > 0) {
            throw new CannotDeleteProductException(
                "Cannot delete product with remaining stock: " + product.getUnitsInStock() + " units. " +
                "Please sell or return all stock before deleting."
            );
        }
        
        // 2. 進行中の注文チェック（将来的に実装）
        // TODO: 注文エンティティが実装されたら、進行中の注文があるかチェック
        
        // 3. 既に削除済みかチェック
        if (product.getDeleted()) {
            throw new CannotDeleteProductException("Product is already deleted");
        }
    }
    
    // 現在のユーザーを取得（将来的にSpring Securityと連携）
    private String getCurrentUser() {
        // TODO: Spring Securityと連携して実際のユーザーを取得
        return "system";
    }
    
    @Transactional
    public ProductDto createProduct(ProductDto productDto) {
        System.out.println("=== ProductService.createProduct called ===");
        System.out.println("ProductDto received: " + productDto);
        
        try {
            // カテゴリーを手動で処理
            Product product = new Product();
            product.setName(productDto.getName());
            product.setCode(productDto.getCode());
            product.setQuantityPerUnit(productDto.getQuantityPerUnit());
            product.setUnitPrice(productDto.getUnitPrice());
            product.setUnitCost(productDto.getUnitCost());
            product.setUnitsInStock(productDto.getUnitsInStock());
            product.setReorderLevel(productDto.getReorderLevel());
            product.setDiscontinued(productDto.getDiscontinued());
            
            // カテゴリーを正しく設定
            if (productDto.getCategory() != null && productDto.getCategory().getCategoryId() != null) {
                Category category = categoryRepository.findById(productDto.getCategory().getCategoryId())
                        .orElseThrow(() -> new RuntimeException("Category not found with id: " + productDto.getCategory().getCategoryId()));
                product.setCategory(category);
            }
            
            System.out.println("Created entity: " + product);
            
            Product savedProduct = productRepository.save(product);
            System.out.println("Saved product: " + savedProduct);
            
            ProductDto result = productMapper.toDto(savedProduct);
            System.out.println("Returning DTO: " + result);
            return result;
        } catch (Exception e) {
            System.out.println("Error creating product: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @Transactional
    public ProductDto updateProduct(Long id, ProductDto productDto) {
        System.out.println("=== ProductService.updateProduct called ===");
        System.out.println("Looking for product with ID: " + id);
        System.out.println("ProductDto received: " + productDto);
        
        return productRepository.findById(id)
                .filter(product -> !product.getDeleted()) // 削除済み商品は更新不可
                .map(existingProduct -> {
                    System.out.println("Found existing product: " + existingProduct);
                    
                    // カテゴリーの更新を手動で処理
                    if (productDto.getCategory() != null && productDto.getCategory().getCategoryId() != null) {
                        // カテゴリーIDが変更されている場合のみ更新
                        if (existingProduct.getCategory() == null || 
                            !existingProduct.getCategory().getCategoryId().equals(productDto.getCategory().getCategoryId())) {
                            System.out.println("Updating category from " + 
                                (existingProduct.getCategory() != null ? existingProduct.getCategory().getCategoryId() : "null") + 
                                " to " + productDto.getCategory().getCategoryId());
                            
                            // データベースから正しいCategoryエンティティを取得
                            Category newCategory = categoryRepository.findById(productDto.getCategory().getCategoryId())
                                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + productDto.getCategory().getCategoryId()));
                            existingProduct.setCategory(newCategory);
                        }
                    }
                    
                    // その他のフィールドを更新（カテゴリー以外）
                    existingProduct.setName(productDto.getName());
                    existingProduct.setCode(productDto.getCode());
                    existingProduct.setQuantityPerUnit(productDto.getQuantityPerUnit());
                    existingProduct.setUnitPrice(productDto.getUnitPrice());
                    existingProduct.setUnitCost(productDto.getUnitCost());
                    existingProduct.setUnitsInStock(productDto.getUnitsInStock());
                    existingProduct.setReorderLevel(productDto.getReorderLevel());
                    existingProduct.setDiscontinued(productDto.getDiscontinued());
                    
                    System.out.println("Updated product: " + existingProduct);
                    Product savedProduct = productRepository.save(existingProduct);
                    System.out.println("Saved product: " + savedProduct);
                    return productMapper.toDto(savedProduct);
                })
                .orElseThrow(() -> {
                    System.out.println("Product not found with id: " + id);
                    return new ProductNotFoundException(id);
                });
    }
    
    @Transactional
    public void deleteProduct(Long id) {
        deleteProduct(id, null);
    }
    
    @Transactional
    public void deleteProduct(Long id, String reason) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
        
        // 削除前の検証
        validateProductDeletion(product);
        
        // 論理削除実行
        product.setDeleted(true);
        product.setDeletedAt(LocalDateTime.now());
        product.setDeletedBy(getCurrentUser());
        product.setDeletionReason(reason);
        
        productRepository.save(product);
        
        System.out.println("Product logically deleted: " + product.getName() + " (ID: " + id + ")");
    }
    
    // 論理削除の取り消し（復元）
    @Transactional
    public void restoreProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
        
        if (!product.getDeleted()) {
            throw new RuntimeException("Product is not deleted");
        }
        
        product.setDeleted(false);
        product.setDeletedAt(null);
        product.setDeletedBy(null);
        product.setDeletionReason(null);
        
        productRepository.save(product);
        
        System.out.println("Product restored: " + product.getName() + " (ID: " + id + ")");
    }
}
