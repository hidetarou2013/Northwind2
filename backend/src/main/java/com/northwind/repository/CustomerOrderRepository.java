package com.northwind.repository;

import com.northwind.entity.CustomerOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Long> {
    
    @Query("SELECT co FROM CustomerOrder co WHERE co.customer.customerId = :customerId")
    List<CustomerOrder> findByCustomerId(@Param("customerId") Long customerId);
    
    @Query("SELECT co FROM CustomerOrder co WHERE co.status = :status")
    List<CustomerOrder> findByStatus(@Param("status") CustomerOrder.OrderStatus status);
    
    @Query("SELECT co FROM CustomerOrder co WHERE co.orderDate BETWEEN :startDate AND :endDate")
    List<CustomerOrder> findByOrderDateBetween(@Param("startDate") LocalDateTime startDate, 
                                             @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT co FROM CustomerOrder co WHERE co.employee.employeeId = :employeeId")
    List<CustomerOrder> findByEmployeeId(@Param("employeeId") Long employeeId);
    
    @Query("SELECT co FROM CustomerOrder co WHERE co.shipper.shipperId = :shipperId")
    List<CustomerOrder> findByShipperId(@Param("shipperId") Long shipperId);
    
    @Query("SELECT co FROM CustomerOrder co WHERE co.customer.companyName LIKE %:companyName%")
    Page<CustomerOrder> findByCustomerCompanyNameContaining(@Param("companyName") String companyName, Pageable pageable);
    
    @Query("SELECT co FROM CustomerOrder co ORDER BY co.orderDate DESC")
    Page<CustomerOrder> findAllOrderByOrderDateDesc(Pageable pageable);
} 