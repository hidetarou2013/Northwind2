package com.northwind.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "nw_customers")
@Data
@EqualsAndHashCode(callSuper = true)
public class Customer extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private Long customerId;
    
    @Column(name = "company_name")
    private String companyName;
    
    @Column(name = "contact_name")
    private String contactName;
    
    @Column(name = "contact_title")
    private String contactTitle;
    
    @Column(name = "email")
    private String email;
    
    @Column(name = "fax")
    private String fax;
    
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "party_id")
    private Party party;
} 