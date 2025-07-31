package com.northwind.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderDetailDto {
    private Long orderDetailId;
    private BigDecimal discount;
    private Integer quantity;
    private BigDecimal unitPrice;
    private ProductDto product;
    
    // 計算フィールド
    private BigDecimal subtotal;
    private BigDecimal totalWithDiscount;
    
    public BigDecimal getSubtotal() {
        if (unitPrice != null && quantity != null) {
            return unitPrice.multiply(BigDecimal.valueOf(quantity));
        }
        return BigDecimal.ZERO;
    }
    
    public BigDecimal getTotalWithDiscount() {
        BigDecimal subtotal = getSubtotal();
        if (discount != null && discount.compareTo(BigDecimal.ZERO) > 0) {
            return subtotal.multiply(BigDecimal.ONE.subtract(discount.divide(BigDecimal.valueOf(100))));
        }
        return subtotal;
    }
} 