package com.northwind.service;

import com.northwind.dto.CustomerDto;
import com.northwind.entity.Customer;
import com.northwind.exception.CustomerNotFoundException;
import com.northwind.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CustomerService {
    
    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;
    
    public List<CustomerDto> getAllCustomers() {
        return customerRepository.findAll()
                .stream()
                .map(customerMapper::toDto)
                .toList();
    }
    
    public Optional<CustomerDto> getCustomerById(Long id) {
        return customerRepository.findById(id)
                .map(customerMapper::toDto);
    }
    
    public List<CustomerDto> searchCustomersByCompanyName(String companyName) {
        return customerRepository.findByCompanyNameContaining(companyName)
                .stream()
                .map(customerMapper::toDto)
                .toList();
    }
    
    public List<CustomerDto> searchCustomersByContactName(String contactName) {
        return customerRepository.findByContactNameContaining(contactName)
                .stream()
                .map(customerMapper::toDto)
                .toList();
    }
    
    @Transactional
    public CustomerDto createCustomer(CustomerDto customerDto) {
        Customer customer = customerMapper.toEntity(customerDto);
        Customer savedCustomer = customerRepository.save(customer);
        return customerMapper.toDto(savedCustomer);
    }
    
    @Transactional
    public CustomerDto updateCustomer(Long id, CustomerDto customerDto) {
        return customerRepository.findById(id)
                .map(existingCustomer -> {
                    // 更新ロジックを実装
                    existingCustomer.setCompanyName(customerDto.getCompanyName());
                    existingCustomer.setContactName(customerDto.getContactName());
                    existingCustomer.setContactTitle(customerDto.getContactTitle());
                    existingCustomer.setEmail(customerDto.getEmail());
                    existingCustomer.setFax(customerDto.getFax());
                    
                    Customer savedCustomer = customerRepository.save(existingCustomer);
                    return customerMapper.toDto(savedCustomer);
                })
                .orElseThrow(() -> new CustomerNotFoundException(id));
    }
    
    @Transactional
    public void deleteCustomer(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new CustomerNotFoundException(id);
        }
        customerRepository.deleteById(id);
    }
} 