package com.northwind.service;

import com.northwind.dto.ProductDto;
import com.northwind.entity.Category;
import com.northwind.entity.Product;
import com.northwind.repository.CategoryRepository;
import com.northwind.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        return productRepository.findAll()
                .stream()
                .map(productMapper::toDto)
                .toList();
    }
    
    public Page<ProductDto> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable)
                .map(productMapper::toDto);
    }
    
    public Optional<ProductDto> getProductById(Long id) {
        return productRepository.findById(id)
                .map(productMapper::toDto);
    }
    
    public List<ProductDto> getActiveProducts() {
        return productRepository.findByDiscontinuedFalse()
                .stream()
                .map(productMapper::toDto)
                .toList();
    }
    
    public Page<ProductDto> searchProducts(String name, Pageable pageable) {
        return productRepository.findByNameContainingIgnoreCase(name, pageable)
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
    
    @Transactional
    public ProductDto createProduct(ProductDto productDto) {
        Product product = productMapper.toEntity(productDto);
        Product savedProduct = productRepository.save(product);
        return productMapper.toDto(savedProduct);
    }
    
    @Transactional
    public ProductDto updateProduct(Long id, ProductDto productDto) {
        System.out.println("=== ProductService.updateProduct called ===");
        System.out.println("Looking for product with ID: " + id);
        System.out.println("ProductDto received: " + productDto);
        
        return productRepository.findById(id)
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
                    return new RuntimeException("Product not found with id: " + id);
                });
    }
    
    @Transactional
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
