package com.northwind.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "nw_shippers")
@Data
@EqualsAndHashCode(callSuper = true)
public class Shipper extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "shipper_id")
    private Long shipperId;
    
    @Column(name = "company_name")
    private String companyName;
    
    @Column(name = "phone")
    private String phone;
} 