import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { Product, productService } from '../services/api';

const ProductDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getAllProducts();
      setProducts(data);
      console.log('Products loaded:', data);
    } catch (err) {
      setError('Failed to load products. Please make sure the backend server is running.');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Product Management - API Test
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Typography variant="body1" gutterBottom>
        Total Products: {products.length}
      </Typography>

      {products.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Sample Products:
          </Typography>
          {products.slice(0, 3).map((product) => (
            <Typography key={product.productId} variant="body2">
              {product.name} - ${product.unitPrice}
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ProductDashboard; 