import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  IconButton,
} from '@mui/material';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { Search, Refresh, Add, Visibility, Edit, Delete } from '@mui/icons-material';
import { Category, categoryService, DeleteResponse } from '../services/api';

const CategoryDashboard: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'create'>('view');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  // フォーム状態
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await categoryService.getAllCategories();
      console.log('Categories loaded:', data.length);
      
      setCategories(data);
      setFilteredCategories(data);
    } catch (err) {
      console.error('Error loading categories:', err);
      setError('Failed to load categories. Please make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredCategories(filtered);
  }, [categories, searchTerm]);

  const handleRowClick = (params: GridRowParams) => {
    setSelectedCategory(params.row);
    setDialogMode('view');
    setDialogOpen(true);
  };

  const handleViewCategory = (category: Category) => {
    setSelectedCategory(category);
    setDialogMode('view');
    setDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
    });
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleCreateCategory = () => {
    setSelectedCategory(null);
    setFormData({
      name: '',
      description: '',
    });
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleDeleteCategory = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    setDeleteLoading(true);
    try {
      await categoryService.deleteCategory(categoryToDelete.categoryId);
      setSnackbar({
        open: true,
        message: 'Category deleted successfully',
        severity: 'success'
      });
      await loadCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
      setSnackbar({
        open: true,
        message: 'Failed to delete category. Please try again.',
        severity: 'error'
      });
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleSaveCategory = async () => {
    try {
      if (dialogMode === 'create') {
        await categoryService.createCategory(formData);
        setSnackbar({
          open: true,
          message: 'Category created successfully',
          severity: 'success'
        });
      } else if (dialogMode === 'edit' && selectedCategory) {
        await categoryService.updateCategory(selectedCategory.categoryId, {
          ...selectedCategory,
          ...formData,
        });
        setSnackbar({
          open: true,
          message: 'Category updated successfully',
          severity: 'success'
        });
      }
      
      setDialogOpen(false);
      await loadCategories();
    } catch (err) {
      console.error('Error saving category:', err);
      setSnackbar({
        open: true,
        message: 'Failed to save category. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const columns: GridColDef[] = [
    { field: 'categoryId', headerName: 'ID', width: 80 },
    { field: 'name', headerName: 'Category Name', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1 },
    { field: 'productCount', headerName: 'Products', width: 120, type: 'number' },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleViewCategory(params.row);
            }}
          >
            <Visibility />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleEditCategory(params.row);
            }}
          >
            <Edit />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteCategory(params.row);
            }}
          >
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

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
        Category Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3, mb: 3 }}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Categories
            </Typography>
            <Typography variant="h4">
              {categories.length}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Active Categories
            </Typography>
            <Typography variant="h4">
              {categories.filter(c => c.productCount && c.productCount > 0).length}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Products
            </Typography>
            <Typography variant="h4">
              {categories.reduce((sum, c) => sum + (c.productCount || 0), 0)}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <TextField
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ flexGrow: 1 }}
        />
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={loadCategories}
        >
          REFRESH
        </Button>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateCategory}
        >
          + ADD CATEGORY
        </Button>
      </Box>

      <Card>
        <DataGrid
          rows={filteredCategories}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          onRowClick={handleRowClick}
          autoHeight
          sx={{ minHeight: 400 }}
        />
      </Card>

      {/* Category Detail/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? 'Create Category' : 
           dialogMode === 'edit' ? 'Edit Category' : 'Category Details'}
        </DialogTitle>
        <DialogContent>
          {dialogMode === 'view' && selectedCategory ? (
            <Box>
              <Typography><strong>Name:</strong> {selectedCategory.name}</Typography>
              <Typography><strong>Description:</strong> {selectedCategory.description || 'No description'}</Typography>
              <Typography><strong>Products:</strong> {selectedCategory.productCount || 0}</Typography>
            </Box>
          ) : (
            <Box sx={{ pt: 1 }}>
              <TextField
                fullWidth
                label="Category Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                margin="normal"
                multiline
                rows={3}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            {dialogMode === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {(dialogMode === 'create' || dialogMode === 'edit') && (
            <Button onClick={handleSaveCategory} variant="contained">
              {dialogMode === 'create' ? 'Create' : 'Save'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{categoryToDelete?.name}"? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" disabled={deleteLoading}>
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CategoryDashboard; 