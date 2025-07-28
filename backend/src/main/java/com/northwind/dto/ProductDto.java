package com.northwind.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

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
    private CategorySummaryDto category;
    private SupplierSummaryDto supplier;
}
