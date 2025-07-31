package com.northwind.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;

@Entity
@Table(name = "nw_employees")
@Data
@EqualsAndHashCode(callSuper = true)
public class Employee extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employee_id")
    private Long employeeId;
    
    @Column(name = "birth_date")
    private LocalDate birthDate;
    
    @Column(name = "extension")
    private String extension;
    
    @Column(name = "first_name")
    private String firstName;
    
    @Column(name = "hire_date")
    private LocalDate hireDate;
    
    @Column(name = "last_name")
    private String lastName;
    
    @Column(name = "notes")
    private String notes;
    
    @Column(name = "photo")
    private String photo;
    
    @Column(name = "title")
    private String title;
    
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "party_id")
    private Party party;
} 