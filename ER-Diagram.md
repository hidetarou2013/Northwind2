# Northwind Database ER Diagram

```mermaid
erDiagram
    %% User Authentication Tables
    login_role {
        bigint login_role_id PK
        varchar(50) description
        varchar(20) name
        bigint version
    }
    
    user_login {
        bigint user_login_id PK
        timestamp from_date
        boolean locked
        boolean need_change_password
        varchar(255) password
        timestamp thru_date
        varchar(30) username UK
        bigint version
    }
    
    user_login_role {
        bigint user_login_role_id PK
        bigint version
        bigint login_role FK
        bigint user_login FK
    }
    
    %% Geographic Tables
    nw_countries {
        bigint country_id PK
        varchar(255) description
        bigint version
    }
    
    nw_regions {
        bigint region_id PK
        varchar(255) description
        bigint version
        bigint country FK
    }
    
    nw_cities {
        bigint city_id PK
        varchar(255) description
        bigint version
        bigint region FK
    }
    
    %% Core Business Tables
    nw_parties {
        bigint party_id PK
        varchar(255) address
        varchar(255) phone
        varchar(255) postal_code
        bigint version
        bigint city FK
        bigint country FK
        bigint region FK
    }
    
    nw_customers {
        bigint party_id PK
        varchar(255) company_name
        varchar(255) contact_name
        varchar(255) contact_title
        varchar(255) email
        varchar(255) fax
    }
    
    nw_employees {
        bigint party_id PK
        timestamp birth_date
        varchar(255) extension
        varchar(255) first_name
        timestamp hire_date
        varchar(255) last_name
        varchar(255) notes
        varchar(255) photo
        varchar(255) title
    }
    
    nw_suppliers {
        bigint supplier_id PK
        varchar(255) address
        varchar(255) company_name
        varchar(255) contact_name
        varchar(255) contact_title
        varchar(255) fax
        varchar(255) phone
        varchar(255) postal_code
        bigint version
        varchar(255) web
        bigint city FK
        bigint country FK
        bigint region FK
    }
    
    nw_shippers {
        bigint shipper_id PK
        varchar(255) company_name
        varchar(255) phone
        bigint version
    }
    
    %% Product Management
    nw_categories {
        bigint category_id PK
        varchar(255) created_by
        timestamp created_date
        varchar(255) description
        varchar(255) modified_by
        timestamp modified_date
        varchar(255) name
        bigint version
    }
    
    nw_products {
        bigint product_id PK
        varchar(255) code
        boolean discontinued
        varchar(255) name
        varchar(255) quantity_per_unit
        integer reorder_level
        decimal unit_cost
        decimal unit_price
        integer units_in_stock
        bigint version
        bigint category FK
        bigint supplier FK
    }
    
    %% Order Management
    nw_customer_orders {
        bigint customer_order_id PK
        timestamp close_date
        decimal freight
        timestamp invoice_date
        timestamp order_date
        timestamp required_date
        varchar(255) ship_address
        varchar(255) ship_name
        varchar(255) ship_phone
        varchar(255) ship_postal_code
        timestamp shipped_date
        varchar(255) status
        bigint version
        bigint city FK
        bigint country FK
        bigint customer FK
        bigint employee FK
        bigint region FK
        bigint shipper FK
    }
    
    nw_order_details {
        bigint order_detail_id PK
        decimal discount
        integer quantity
        decimal unit_price
        bigint version
        bigint customer_order FK
        bigint product FK
    }
    
    nw_purchase_orders {
        bigint purchase_order_id PK
        timestamp order_date
        integer quantity
        decimal unit_cost
        bigint version
        bigint employee FK
        bigint product FK
    }
    
    %% Store Management
    nw_stores {
        bigint store_id PK
        varchar(255) address
        varchar(255) name
        varchar(255) phone
        varchar(255) postal_code
        bigint version
        bigint city FK
        bigint country FK
        bigint region FK
    }
    
    %% Reports
    nw_reports {
        bigint report_id PK
        varchar(255) type
        bigint version
    }
    
    nw_sold_product_view {
        bigint id PK
        bigint version
    }
    
    %% Relationships
    login_role ||--o{ user_login_role : has
    user_login ||--o{ user_login_role : belongs_to
    
    nw_countries ||--o{ nw_regions : contains
    nw_regions ||--o{ nw_cities : contains
    
    nw_countries ||--o{ nw_parties : located_in
    nw_regions ||--o{ nw_parties : located_in
    nw_cities ||--o{ nw_parties : located_in
    
    nw_parties ||--|| nw_customers : is_a
    nw_parties ||--|| nw_employees : is_a
    
    nw_countries ||--o{ nw_suppliers : located_in
    nw_regions ||--o{ nw_suppliers : located_in
    nw_cities ||--o{ nw_suppliers : located_in
    
    nw_countries ||--o{ nw_stores : located_in
    nw_regions ||--o{ nw_stores : located_in
    nw_cities ||--o{ nw_stores : located_in
    
    nw_categories ||--o{ nw_products : categorizes
    nw_suppliers ||--o{ nw_products : supplies
    
    nw_customers ||--o{ nw_customer_orders : places
    nw_employees ||--o{ nw_customer_orders : processes
    nw_shippers ||--o{ nw_customer_orders : ships
    nw_countries ||--o{ nw_customer_orders : ships_to
    nw_regions ||--o{ nw_customer_orders : ships_to
    nw_cities ||--o{ nw_customer_orders : ships_to
    
    nw_customer_orders ||--o{ nw_order_details : contains
    nw_products ||--o{ nw_order_details : ordered_as
    
    nw_employees ||--o{ nw_purchase_orders : creates
    nw_products ||--o{ nw_purchase_orders : purchases
```

## Database Schema Overview

### Core Features:
1. **User Authentication System**: Multi-role user login system
2. **Geographic Hierarchy**: Countries → Regions → Cities
3. **Party Model**: Unified person/organization structure for customers and employees
4. **Product Management**: Categories and suppliers for products
5. **Order Processing**: Customer orders with detailed line items
6. **Purchase Management**: Purchase orders for inventory
7. **Store Management**: Physical store locations
8. **Reporting**: Built-in reporting capabilities

### Key Business Processes:
- Customer order management with shipping details
- Inventory management through purchase orders
- Multi-location store support
- Role-based user access control
- Supplier and category management for products
