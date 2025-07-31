package com.northwind.service;

import com.northwind.dto.CustomerDto;
import com.northwind.entity.Customer;
import org.springframework.stereotype.Component;

@Component
public class CustomerMapper {
    
    public CustomerDto toDto(Customer customer) {
        if (customer == null) {
            return null;
        }
        
        CustomerDto dto = new CustomerDto();
        dto.setCustomerId(customer.getCustomerId());
        dto.setCompanyName(customer.getCompanyName());
        dto.setContactName(customer.getContactName());
        dto.setContactTitle(customer.getContactTitle());
        dto.setEmail(customer.getEmail());
        dto.setFax(customer.getFax());
        
        if (customer.getParty() != null) {
            dto.setAddress(customer.getParty().getAddress());
            dto.setPhone(customer.getParty().getPhone());
            dto.setPostalCode(customer.getParty().getPostalCode());
            
            if (customer.getParty().getCity() != null) {
                dto.setCity(customer.getParty().getCity().getDescription());
            }
            if (customer.getParty().getRegion() != null) {
                dto.setRegion(customer.getParty().getRegion().getDescription());
            }
            if (customer.getParty().getCountry() != null) {
                dto.setCountry(customer.getParty().getCountry().getDescription());
            }
        }
        
        return dto;
    }
    
    public Customer toEntity(CustomerDto dto) {
        if (dto == null) {
            return null;
        }
        
        Customer customer = new Customer();
        customer.setCustomerId(dto.getCustomerId());
        customer.setCompanyName(dto.getCompanyName());
        customer.setContactName(dto.getContactName());
        customer.setContactTitle(dto.getContactTitle());
        customer.setEmail(dto.getEmail());
        customer.setFax(dto.getFax());
        
        return customer;
    }
} 