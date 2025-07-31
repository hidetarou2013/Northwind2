import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Product {
  productId: number;
  name: string;
  code: string;
  quantityPerUnit: string;
  unitPrice: number;
  unitCost: number;
  unitsInStock: number;
  reorderLevel: number;
  discontinued: boolean;
  deleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
  deletionReason?: string;
  category?: {
    categoryId: number;
    name: string;
  };
  supplier?: {
    supplierId: number;
    companyName: string;
  };
}

export interface Category {
  categoryId: number;
  name: string;
  description: string;
  productCount?: number;
}

export interface Customer {
  customerId: number;
  companyName: string;
  contactName: string;
  contactTitle: string;
  email: string;
  fax: string;
  address: string;
  phone: string;
  postalCode: string;
  city: string;
  region: string;
  country: string;
}

export interface OrderDetail {
  orderDetailId: number;
  discount: number;
  quantity: number;
  unitPrice: number;
  product: Product;
  subtotal: number;
  totalWithDiscount: number;
}

export interface CustomerOrder {
  customerOrderId: number;
  closeDate: string;
  freight: number;
  invoiceDate: string;
  orderDate: string;
  requiredDate: string;
  shipAddress: string;
  shipName: string;
  shipPhone: string;
  shipPostalCode: string;
  shippedDate: string;
  status: string;
  customer: Customer;
  employeeName: string;
  shipperName: string;
  city: string;
  region: string;
  country: string;
  orderDetails: OrderDetail[];
  subtotal: number;
  total: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface DeleteResponse {
  message?: string;
  error?: string;
}

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    const response = await api.get('/products/all');
    return response.data;
  },

  getProducts: async (page: number = 0, size: number = 10): Promise<PageResponse<Product>> => {
    const response = await api.get(`/products?page=${page}&size=${size}`);
    return response.data;
  },

  getProductById: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getActiveProducts: async (): Promise<Product[]> => {
    const response = await api.get('/products/active');
    return response.data;
  },

  searchProducts: async (name: string, page: number = 0, size: number = 10): Promise<PageResponse<Product>> => {
    const response = await api.get(`/products/search?name=${name}&page=${page}&size=${size}`);
    return response.data;
  },

  getProductsByCategory: async (categoryId: number): Promise<Product[]> => {
    const response = await api.get(`/products/category/${categoryId}`);
    return response.data;
  },

  getLowStockProducts: async (): Promise<Product[]> => {
    const response = await api.get('/products/low-stock');
    return response.data;
  },

  getDeletedProducts: async (): Promise<Product[]> => {
    const response = await api.get('/products/deleted');
    return response.data;
  },

  createProduct: async (product: Omit<Product, 'productId'>): Promise<Product> => {
    const response = await api.post('/products', product);
    return response.data;
  },

  updateProduct: async (id: number, product: Product): Promise<Product> => {
    console.log('Updating product with ID:', id, 'Data:', product);
    const response = await api.put(`/products/${id}`, product);
    console.log('Update response:', response.data);
    return response.data;
  },

  deleteProduct: async (id: number): Promise<DeleteResponse> => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  deleteProductWithReason: async (id: number, reason: string): Promise<DeleteResponse> => {
    const response = await api.delete(`/products/${id}/with-reason`, {
      data: { reason }
    });
    return response.data;
  },

  restoreProduct: async (id: number): Promise<DeleteResponse> => {
    const response = await api.post(`/products/${id}/restore`);
    return response.data;
  },
};

export const categoryService = {
  getAllCategories: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data;
  },

  getCategoryById: async (id: number): Promise<Category> => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  createCategory: async (category: Omit<Category, 'categoryId'>): Promise<Category> => {
    const response = await api.post('/categories', category);
    return response.data;
  },

  updateCategory: async (id: number, category: Category): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, category);
    return response.data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};

export const customerService = {
  getAllCustomers: async (): Promise<Customer[]> => {
    const response = await api.get('/customers');
    return response.data;
  },

  getCustomerById: async (id: number): Promise<Customer> => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },

  searchCustomersByCompanyName: async (companyName: string): Promise<Customer[]> => {
    const response = await api.get(`/customers/search/company?companyName=${companyName}`);
    return response.data;
  },

  searchCustomersByContactName: async (contactName: string): Promise<Customer[]> => {
    const response = await api.get(`/customers/search/contact?contactName=${contactName}`);
    return response.data;
  },

  createCustomer: async (customer: Omit<Customer, 'customerId'>): Promise<Customer> => {
    const response = await api.post('/customers', customer);
    return response.data;
  },

  updateCustomer: async (id: number, customer: Customer): Promise<Customer> => {
    const response = await api.put(`/customers/${id}`, customer);
    return response.data;
  },

  deleteCustomer: async (id: number): Promise<DeleteResponse> => {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  },
};

export default api;
