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
import { Search, Refresh, Warning, Add, Visibility, Edit, Delete } from '@mui/icons-material';
import { Product, productService } from '../services/api';
import ProductDetailDialog from './ProductDetailDialog';

const ProductDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [dataReady, setDataReady] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'create'>('view');

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      setDataReady(false);
      
      // Load products and low stock products in parallel
      const [data, lowStock] = await Promise.all([
        productService.getAllProducts(),
        productService.getLowStockProducts()
      ]);
      
      console.log('Products loaded:', data.length);
      console.log('Low stock products:', lowStock.length);
      
      // Ensure data is valid before setting state
      if (data && Array.isArray(data) && data.length > 0) {
        setProducts(data);
        setLowStockProducts(lowStock);
        // Wait for next render cycle before setting dataReady
        setTimeout(() => {
          setDataReady(true);
        }, 200);
      } else {
        setError('No product data received from server');
      }
      
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
    if (products.length > 0) {
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
      
      // Pre-process data for DataGrid
      const processedData = filtered.map(product => ({
        ...product,
        categoryName: product.category?.name || 'N/A',
        formattedPrice: product.unitPrice ? `$${Number(product.unitPrice).toFixed(2)}` : '$0.00'
      }));
      
      setFilteredProducts(processedData);
    }
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
      flex: 1
    },
    {
      field: 'categoryName',
      headerName: 'Category',
      width: 150,
    },
    {
      field: 'formattedPrice',
      headerName: 'Unit Price',
      width: 120,
    },
    {
      field: 'unitsInStock',
      headerName: 'Stock',
      width: 100,
      type: 'number',
      renderCell: (params: any) => {
        if (!params.row) {
          return <Box>N/A</Box>;
        }
        const isLowStock = lowStockProducts.some(p => p.productId === params.row.productId);
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {params.value || 0}
            {isLowStock && <Warning color="warning" fontSize="small" />}
          </Box>
        );
      },
    },
    {
      field: 'reorderLevel',
      headerName: 'Reorder Level',
      width: 120,
      type: 'number'
    },
    {
      field: 'discontinued',
      headerName: 'Status',
      width: 120,
      renderCell: (params: any) => {
        if (params.value == null) {
          return <Chip label="Unknown" color="default" size="small" />;
        }
        return (
          <Chip
            label={params.value ? 'Discontinued' : 'Active'}
            color={params.value ? 'error' : 'success'}
            size="small"
          />
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params: any) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Button
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleViewProduct(params.row);
            }}
            startIcon={<Visibility />}
            sx={{ minWidth: 'auto', px: 1 }}
          >
            View
          </Button>
          <Button
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleEditProduct(params.row);
            }}
            startIcon={<Edit />}
            sx={{ minWidth: 'auto', px: 1 }}
          >
            Edit
          </Button>
          <Button
            size="small"
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteProduct(params.row);
            }}
            startIcon={<Delete />}
            sx={{ minWidth: 'auto', px: 1 }}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  const handleRowClick = (params: GridRowParams) => {
    setSelectedProduct(params.row);
    setDialogMode('view');
    setDialogOpen(true);
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setDialogMode('view');
    setDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleDeleteProduct = async (product: Product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        await productService.deleteProduct(product.productId);
        await loadProducts(); // Reload the product list
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  const handleSaveProduct = async (savedProduct: Product) => {
    await loadProducts(); // Reload the product list
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
         <Button
           variant="contained"
           startIcon={<Add />}
           onClick={handleCreateProduct}
           disabled={loading}
         >
           Add Product
         </Button>
      </Box>

      <Card>
        <CardContent>
          <Box sx={{ height: 600, width: '100%' }}>
                         {dataReady && filteredProducts.length > 0 && !loading ? (
               <DataGrid
                 key={`dataGrid-${filteredProducts.length}-${dataReady}`}
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
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <Typography variant="body1" color="textSecondary">
                  {loading ? 'Loading products...' : 'No products found'}
                </Typography>
              </Box>
            )}
          </Box>
                 </CardContent>
       </Card>

       <ProductDetailDialog
         open={dialogOpen}
         product={selectedProduct}
         onClose={() => setDialogOpen(false)}
         onSave={handleSaveProduct}
         mode={dialogMode}
       />
     </Box>
   );
 };

export default ProductDashboard; 