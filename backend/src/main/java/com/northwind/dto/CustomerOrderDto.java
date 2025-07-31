package com.northwind.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class CustomerOrderDto {
    private Long customerOrderId;
    private LocalDateTime closeDate;
    private BigDecimal freight;
    private LocalDateTime invoiceDate;
    private LocalDateTime orderDate;
    private LocalDateTime requiredDate;
    private String shipAddress;
    private String shipName;
    private String shipPhone;
    private String shipPostalCode;
    private LocalDateTime shippedDate;
    private String status;
    
    // 関連エンティティ
    private CustomerDto customer;
    private String employeeName;
    private String shipperName;
    private String city;
    private String region;
    private String country;
    
    // 注文明細
    private List<OrderDetailDto> orderDetails;
    
    // 計算フィールド
    private BigDecimal subtotal;
    private BigDecimal total;
    
    public BigDecimal getSubtotal() {
        if (orderDetails != null) {
            return orderDetails.stream()
                    .map(OrderDetailDto::getTotalWithDiscount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        }
        return BigDecimal.ZERO;
    }
    
    public BigDecimal getTotal() {
        BigDecimal subtotal = getSubtotal();
        if (freight != null) {
            return subtotal.add(freight);
        }
        return subtotal;
    }
} 