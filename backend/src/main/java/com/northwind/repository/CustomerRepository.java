package com.northwind.repository;

import com.northwind.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    
    @Query("SELECT c FROM Customer c WHERE c.companyName LIKE %:companyName%")
    List<Customer> findByCompanyNameContaining(String companyName);
    
    @Query("SELECT c FROM Customer c WHERE c.contactName LIKE %:contactName%")
    List<Customer> findByContactNameContaining(String contactName);
    
    @Query("SELECT c FROM Customer c WHERE c.email = :email")
    List<Customer> findByEmail(String email);
} 