package com.northwind.dto;

import lombok.Data;

@Data
public class CustomerDto {
    private Long customerId;
    private String companyName;
    private String contactName;
    private String contactTitle;
    private String email;
    private String fax;
    private String address;
    private String phone;
    private String postalCode;
    private String city;
    private String region;
    private String country;
} 