package com.northwind.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDto {
    
    private Long productId;
    private String name;
    private String code;
    private String quantityPerUnit;
    private BigDecimal unitPrice;
    private BigDecimal unitCost;
    private Integer unitsInStock;
    private Integer reorderLevel;
    private Boolean discontinued;
    
    // 論理削除用フィールド
    private Boolean deleted;
    private LocalDateTime deletedAt;
    private String deletedBy;
    private String deletionReason;
    
    private CategorySummaryDto category;
    private SupplierSummaryDto supplier;
}
