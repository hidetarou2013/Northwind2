package com.northwind.service;

import com.northwind.dto.ProductDto;
import com.northwind.entity.Product;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProductMapper {
    
    ProductDto toDto(Product product);
    
    Product toEntity(ProductDto productDto);
    
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(ProductDto productDto, @MappingTarget Product product);
}
