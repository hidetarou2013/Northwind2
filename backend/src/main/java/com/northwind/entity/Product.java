package com.northwind.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "nw_products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long productId;
    
    @Column(name = "name")
    private String name;
    
    @Column(name = "code")
    private String code;
    
    @Column(name = "quantity_per_unit")
    private String quantityPerUnit;
    
    @Column(name = "unit_price", precision = 19, scale = 2)
    private BigDecimal unitPrice;
    
    @Column(name = "unit_cost", precision = 19, scale = 2)
    private BigDecimal unitCost;
    
    @Column(name = "units_in_stock")
    private Integer unitsInStock;
    
    @Column(name = "reorder_level")
    private Integer reorderLevel;
    
    @Column(name = "discontinued")
    @Builder.Default
    private Boolean discontinued = false;
    
    // 論理削除用フィールド
    @Column(name = "deleted")
    @Builder.Default
    private Boolean deleted = false;
    
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
    
    @Column(name = "deleted_by")
    private String deletedBy;
    
    @Column(name = "deletion_reason")
    private String deletionReason;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category", referencedColumnName = "category_id")
    private Category category;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier", referencedColumnName = "supplier_id")
    private Supplier supplier;
}
