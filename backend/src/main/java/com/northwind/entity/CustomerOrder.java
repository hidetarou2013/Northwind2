package com.northwind.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "nw_customer_orders")
@Data
@EqualsAndHashCode(callSuper = true)
public class CustomerOrder extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_order_id")
    private Long customerOrderId;
    
    @Column(name = "close_date")
    private LocalDateTime closeDate;
    
    @Column(name = "freight")
    private BigDecimal freight;
    
    @Column(name = "invoice_date")
    private LocalDateTime invoiceDate;
    
    @Column(name = "order_date")
    private LocalDateTime orderDate;
    
    @Column(name = "required_date")
    private LocalDateTime requiredDate;
    
    @Column(name = "ship_address")
    private String shipAddress;
    
    @Column(name = "ship_name")
    private String shipName;
    
    @Column(name = "ship_phone")
    private String shipPhone;
    
    @Column(name = "ship_postal_code")
    private String shipPostalCode;
    
    @Column(name = "shipped_date")
    private LocalDateTime shippedDate;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private OrderStatus status;
    
    @ManyToOne
    @JoinColumn(name = "city_id")
    private City city;
    
    @ManyToOne
    @JoinColumn(name = "country_id")
    private Country country;
    
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;
    
    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;
    
    @ManyToOne
    @JoinColumn(name = "region_id")
    private Region region;
    
    @ManyToOne
    @JoinColumn(name = "shipper_id")
    private Shipper shipper;
    
    @OneToMany(mappedBy = "customerOrder", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderDetail> orderDetails = new ArrayList<>();
    
    public enum OrderStatus {
        PENDING("Pending"),
        CONFIRMED("Confirmed"),
        SHIPPED("Shipped"),
        DELIVERED("Delivered"),
        CANCELLED("Cancelled");
        
        private final String displayName;
        
        OrderStatus(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
} 