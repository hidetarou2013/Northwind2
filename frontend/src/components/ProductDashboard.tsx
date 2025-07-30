import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  Alert,
  CircularProgress,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { Search, Refresh, Warning } from '@mui/icons-material';
import { Product, productService } from '../services/api';

const ProductDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getAllProducts();
      setProducts(data);
      
      // Load low stock products for alerts
      const lowStock = await productService.getLowStockProducts();
      setLowStockProducts(lowStock);
      
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

  useEffect(() => {
    let filtered = products;
    
    if (showActiveOnly) {
      filtered = filtered.filter(product => !product.discontinued);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredProducts(filtered);
  }, [products, searchTerm, showActiveOnly]);

  const columns: GridColDef[] = [
    { 
      field: 'productId', 
      headerName: 'ID', 
      width: 70 
    },
    { 
      field: 'code', 
      headerName: 'Code', 
      width: 100 
    },
    {
      field: 'name',
      headerName: 'Product Name',
      width: 200,
      flex: 1,
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 150,
      valueGetter: (params: any) => params.row.category?.name || 'N/A',
    },
    {
      field: 'unitPrice',
      headerName: 'Unit Price',
      width: 120,
      type: 'number',
      valueFormatter: (params: any) => `$${params.value?.toFixed(2) || '0.00'}`,
    },
    {
      field: 'unitsInStock',
      headerName: 'Stock',
      width: 100,
      type: 'number',
      renderCell: (params: any) => {
        const isLowStock = lowStockProducts.some(p => p.productId === params.row.productId);
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {params.value}
            {isLowStock && <Warning color="warning" fontSize="small" />}
          </Box>
        );
      },
    },
    {
      field: 'reorderLevel',
      headerName: 'Reorder Level',
      width: 120,
      type: 'number',
    },
    {
      field: 'discontinued',
      headerName: 'Status',
      width: 120,
      renderCell: (params: any) => (
        <Chip
          label={params.value ? 'Discontinued' : 'Active'}
          color={params.value ? 'error' : 'success'}
          size="small"
        />
      ),
    },
  ];

  const handleRowClick = (params: GridRowParams) => {
    console.log('Product clicked:', params.row);
    // Here you could open a detailed view or edit dialog
  };

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
        Product Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {lowStockProducts.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Warning: {lowStockProducts.length} product(s) are at or below reorder level!
          </Typography>
        </Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 3 }}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Products
            </Typography>
            <Typography variant="h4">
              {products.length}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Active Products
            </Typography>
            <Typography variant="h4">
              {products.filter(p => !p.discontinued).length}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Low Stock Items
            </Typography>
            <Typography variant="h4" color="warning.main">
              {lowStockProducts.length}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Discontinued
            </Typography>
            <Typography variant="h4">
              {products.filter(p => p.discontinued).length}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          label="Search products..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
          }}
          sx={{ minWidth: 250 }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={showActiveOnly}
              onChange={(e) => setShowActiveOnly(e.target.checked)}
            />
          }
          label="Active products only"
        />
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={loadProducts}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={filteredProducts}
              columns={columns}
              getRowId={(row) => row.productId}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 25 },
                },
              }}
              pageSizeOptions={[10, 25, 50, 100]}
              checkboxSelection={false}
              disableRowSelectionOnClick={false}
              onRowClick={handleRowClick}
              loading={loading}
              density="compact"
              sx={{
                '& .MuiDataGrid-row:hover': {
                  cursor: 'pointer',
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProductDashboard; 