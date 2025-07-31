import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Typography,
  Box,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Product, Category, productService, categoryService } from '../services/api';

interface ProductDetailDialogProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
  mode: 'view' | 'edit' | 'create';
}

const ProductDetailDialog: React.FC<ProductDetailDialogProps> = ({
  open,
  product,
  onClose,
  onSave,
  mode,
}) => {
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  useEffect(() => {
    if (open) {
      loadCategories();
      if (product) {
        setFormData(product);
      } else if (mode === 'create') {
        setFormData({
          name: '',
          code: '',
          quantityPerUnit: '',
          unitPrice: 0,
          unitCost: 0,
          unitsInStock: 0,
          reorderLevel: 0,
          discontinued: false,
        });
      }
    }
  }, [open, product, mode]);

     // カテゴリーが読み込まれた後にフォームデータを再設定
   useEffect(() => {
     if (categoriesLoaded && product && open) {
       console.log('Setting form data with product:', product); // デバッグログ追加
       setFormData(product);
     }
   }, [categoriesLoaded, product, open]);

  const loadCategories = async () => {
    try {
      setCategoriesLoaded(false);
      const data = await categoryService.getAllCategories();
      setCategories(data);
      setCategoriesLoaded(true);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setCategoriesLoaded(true);
    }
  };

  const handleInputChange = (field: keyof Product, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

             // データを整形して送信（不要なフィールドを削除）
       const { categoryName, formattedPrice, ...cleanFormData } = formData as any;
       const productData = {
         ...cleanFormData,
         category: formData.category ? {
           categoryId: formData.category.categoryId
         } : null,
         supplier: formData.supplier ? {
           supplierId: formData.supplier.supplierId
         } : null
       };

      console.log('Sending product data:', productData);

      let savedProduct: Product;
      if (mode === 'create') {
        savedProduct = await productService.createProduct(productData as Omit<Product, 'productId'>);
      } else {
        savedProduct = await productService.updateProduct(product!.productId, productData as Product);
      }

      onSave(savedProduct);
      onClose();
    } catch (err) {
      setError('Failed to save product. Please try again.');
      console.error('Error saving product:', err);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return formData.name && formData.code && formData.unitPrice !== undefined;
  };

  const getDialogTitle = () => {
    switch (mode) {
      case 'create':
        return 'Add New Product';
      case 'edit':
        return 'Edit Product';
      case 'view':
        return 'Product Details';
      default:
        return 'Product';
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
             <DialogTitle>
         <Box>
           <Typography variant="h6" component="div">
             {getDialogTitle()}
           </Typography>
           {mode === 'view' && product && (
             <Typography variant="body2" color="textSecondary">
               ID: {product.productId}
             </Typography>
           )}
         </Box>
       </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

                 <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mt: 1 }}>
           <TextField
             fullWidth
             label="Product Name"
             value={formData.name || ''}
             onChange={(e) => handleInputChange('name', e.target.value)}
             disabled={mode === 'view'}
             required
           />
           
           <TextField
             fullWidth
             label="Product Code"
             value={formData.code || ''}
             onChange={(e) => handleInputChange('code', e.target.value)}
             disabled={mode === 'view'}
             required
           />

           <TextField
             fullWidth
             label="Quantity Per Unit"
             value={formData.quantityPerUnit || ''}
             onChange={(e) => handleInputChange('quantityPerUnit', e.target.value)}
             disabled={mode === 'view'}
             placeholder="e.g., 10 boxes x 20 bags"
             sx={{ gridColumn: { xs: '1 / -1', sm: '1 / -1' } }}
           />

           <TextField
             fullWidth
             label="Unit Price"
             type="number"
             value={formData.unitPrice || ''}
             onChange={(e) => handleInputChange('unitPrice', parseFloat(e.target.value) || 0)}
             disabled={mode === 'view'}
             required
             InputProps={{
               startAdornment: '$',
             }}
           />

           <TextField
             fullWidth
             label="Unit Cost"
             type="number"
             value={formData.unitCost || ''}
             onChange={(e) => handleInputChange('unitCost', parseFloat(e.target.value) || 0)}
             disabled={mode === 'view'}
             InputProps={{
               startAdornment: '$',
             }}
           />

           <TextField
             fullWidth
             label="Units In Stock"
             type="number"
             value={formData.unitsInStock || ''}
             onChange={(e) => handleInputChange('unitsInStock', parseInt(e.target.value) || 0)}
             disabled={mode === 'view'}
           />

           <TextField
             fullWidth
             label="Reorder Level"
             type="number"
             value={formData.reorderLevel || ''}
             onChange={(e) => handleInputChange('reorderLevel', parseInt(e.target.value) || 0)}
             disabled={mode === 'view'}
           />

                                   <FormControl fullWidth disabled={mode === 'view'}>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoriesLoaded && formData.category?.categoryId ? String(formData.category.categoryId) : ''}
                                 onChange={(e) => {
                   const category = categories.find(c => c.categoryId === Number(e.target.value));
                   console.log('Selected category:', category); // デバッグログ追加
                   console.log('Selected categoryId:', e.target.value); // 選択されたIDもログ
                   console.log('All categories:', categories); // 全カテゴリーもログ
                   handleInputChange('category', category);
                 }}
                label="Category"
              >
                {categoriesLoaded && categories.length > 0 ? (
                  categories.map((category) => (
                    <MenuItem key={category.categoryId} value={String(category.categoryId)}>
                      {category.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>
                    {categoriesLoaded ? 'No categories available' : 'Loading categories...'}
                  </MenuItem>
                )}
              </Select>
            </FormControl>

           <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
             <FormControlLabel
               control={
                 <Switch
                   checked={formData.discontinued || false}
                   onChange={(e) => handleInputChange('discontinued', e.target.checked)}
                   disabled={mode === 'view'}
                 />
               }
               label="Discontinued"
             />
             {formData.discontinued && (
               <Chip label="Discontinued" color="error" size="small" sx={{ ml: 1 }} />
             )}
           </Box>
         </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {mode === 'view' ? 'Close' : 'Cancel'}
        </Button>
        {(mode === 'edit' || mode === 'create') && (
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={loading || !isFormValid()}
            startIcon={loading ? <CircularProgress size={16} /> : null}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ProductDetailDialog; 