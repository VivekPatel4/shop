import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, MoreHorizontal, Edit, Trash, Eye, Upload, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

interface Category {
  _id: string;
  name: string;
  description: string;
  parentCategory: string | null;
  subcategories?: Category[];
}

interface Product {
  _id: string;
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  category: string;
  subcategory?: string;
  images: string[];
  imageUrl?: string;
  sizes: string[];
  colors: string[];
  stock: number;
  isActive: boolean;
  featured: boolean;
  status?: string;
}

const PLACEHOLDER_IMAGE = '/placeholder.png'; // Use your actual placeholder path

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    discountedPrice: '',
    category: '',
    subcategory: '',
    images: [] as string[],
    sizes: [] as string[],
    colors: [] as string[],
    stock: '',
    isActive: true,
    featured: false,
  });
  const [uploadingImages, setUploadingImages] = useState(false);
  const { toast } = useToast();
  const [addProductErrors, setAddProductErrors] = useState<{ [key: string]: string }>({});

  // Fetch products and categories on component mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Re-process selected product when categories are loaded
  useEffect(() => {
    if (selectedProduct && categories.length > 0 && isEditDialogOpen) {
      // Re-process the product to ensure correct category/subcategory mapping
      const categoryId = typeof selectedProduct.category === 'object' && selectedProduct.category
        ? (selectedProduct.category as { _id: string })._id
        : selectedProduct.category;
      
      const subcategoryId = typeof selectedProduct.subcategory === 'object' && selectedProduct.subcategory
        ? (selectedProduct.subcategory as { _id: string })._id
        : selectedProduct.subcategory;

      // Helper function to find parent category for a subcategory
      const findParentCategory = (catId: string) => {
        const mainCategory = categories.find(cat => cat._id === catId && !cat.parentCategory);
        if (mainCategory) {
          return catId;
        }
        
        for (const category of categories) {
          if (category.subcategories) {
            const subcategory = category.subcategories.find(sub => sub._id === catId);
            if (subcategory) {
              return category._id;
            }
          }
        }
        
        return catId;
      };

      const actualCategoryId = findParentCategory(categoryId);
      const actualSubcategoryId = actualCategoryId !== categoryId ? categoryId : subcategoryId;

      if (selectedProduct.category !== actualCategoryId || selectedProduct.subcategory !== actualSubcategoryId) {
        setSelectedProduct(prev => prev ? {
          ...prev,
          category: actualCategoryId,
          subcategory: actualSubcategoryId || '',
        } : null);
      }
    }
  }, [categories, selectedProduct, isEditDialogOpen]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      const data = Array.isArray(response.data) ? response.data : (response.data.categories || []);
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      });
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      const productsData = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data.content)
          ? response.data.content
          : [];
      setProducts(productsData);
    } catch (error) {
      setProducts([]);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (isEditDialogOpen && selectedProduct) {
      setSelectedProduct({
        ...selectedProduct,
        [name]: value,
      });
    } else {
      setNewProduct({
        ...newProduct,
        [name]: value,
      });
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    if (isEditDialogOpen && selectedProduct) {
      setSelectedProduct({
        ...selectedProduct,
        featured: checked,
      });
    } else {
      setNewProduct({
        ...newProduct,
        featured: checked,
      });
    }
  };

  const handleCategoryChange = (value: string) => {
    if (isEditDialogOpen && selectedProduct) {
      setSelectedProduct({
        ...selectedProduct,
        category: value,
        subcategory: '', // Reset subcategory when category changes
      });
    } else {
      setNewProduct({
        ...newProduct,
        category: value,
        subcategory: '', // Reset subcategory when category changes
      });
    }
  };

  const handleSubcategoryChange = (value: string) => {
    if (isEditDialogOpen && selectedProduct) {
      setSelectedProduct({
        ...selectedProduct,
        subcategory: value,
      });
    } else {
      setNewProduct({
        ...newProduct,
        subcategory: value,
      });
    }
  };

  const getSubcategoriesForCategory = (categoryId: string) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category?.subcategories || [];
  };

  const getSubcategoryName = (subcategoryId: string) => {
    if (!subcategoryId) return '-';
    
    // If subcategoryId is already a name (string), return it
    if (typeof subcategoryId === 'string' && !subcategoryId.match(/^[0-9a-fA-F]{24}$/)) {
      return subcategoryId;
    }
    
    // Search through all categories to find the subcategory
    for (const category of categories) {
      if (category.subcategories) {
        const subcategory = category.subcategories.find(sub => sub._id === subcategoryId);
        if (subcategory) {
          return subcategory.name;
        }
      }
    }
    
    return '-';
  };

  const getCategoryName = (categoryId: string) => {
    if (!categoryId) return '';
    
    // If categoryId is already a name (string), return it
    if (typeof categoryId === 'string' && !categoryId.match(/^[0-9a-fA-F]{24}$/)) {
      return categoryId;
    }
    
    // Search for the category
    const category = categories.find(cat => cat._id === categoryId);
    return category?.name || categoryId;
  };

  const filteredProducts = products.filter(product => {
    const categoryId = typeof product.category === 'object' && product.category
      ? (product.category as { _id?: string })._id || ''
      : product.category || '';
    const subcategoryId = typeof product.subcategory === 'object' && product.subcategory
      ? (product.subcategory as { _id?: string })._id || ''
      : product.subcategory || '';
    
    const categoryName = getCategoryName(categoryId);
    const subcategoryName = getSubcategoryName(subcategoryId);
    
    return product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           subcategoryName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const validateAddProduct = () => {
    const errors: { [key: string]: string } = {};
    if (!newProduct.name.trim()) errors.name = 'Product name is required.';
    if (!newProduct.description.trim()) errors.description = 'Description is required.';
    if (!newProduct.price || isNaN(Number(newProduct.price))) errors.price = 'Valid price is required.';
    if (!newProduct.category) errors.category = 'Category is required.';
    if (!newProduct.stock || isNaN(Number(newProduct.stock))) errors.stock = 'Valid stock is required.';
    return errors;
  };

  const handleAddProduct = async () => {
    const errors = validateAddProduct();
    setAddProductErrors(errors);
    if (Object.keys(errors).length > 0) return;
    try {
      const payload = {
        name: newProduct.name,
        description: newProduct.description,
        price: Number(newProduct.price),
        discountedPrice: newProduct.discountedPrice ? Number(newProduct.discountedPrice) : undefined,
        category: newProduct.category,
        subcategory: newProduct.subcategory || undefined,
        images: Array.isArray(newProduct.images) ? newProduct.images : [],
        sizes: Array.isArray(newProduct.sizes) ? newProduct.sizes : [],
        colors: Array.isArray(newProduct.colors) ? newProduct.colors : [],
        stock: Number(newProduct.stock),
        isActive: newProduct.isActive,
        featured: newProduct.featured,
      };
      const response = await api.post('/products', payload);
      setProducts([...products, response.data]);
      setIsAddDialogOpen(false);
      setNewProduct({
        name: '',
        description: '',
        price: '',
        discountedPrice: '',
        category: '',
        subcategory: '',
        images: [],
        sizes: [],
        colors: [],
        stock: '',
        isActive: true,
        featured: false,
      });
      setAddProductErrors({});
      toast({
        title: "Success",
        description: "Product added successfully",
      });
    } catch (error: any) {
      console.error(error?.response?.data || error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;

    // Validate form
    if (!selectedProduct.name || !selectedProduct.category || selectedProduct.price === undefined || selectedProduct.stock === undefined) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      await api.put(`/products/${selectedProduct.id}`, selectedProduct);
      await fetchProducts(); // Fetch latest products from backend
      setIsEditDialogOpen(false);
      setSelectedProduct(null);

      toast({
        title: "Product Updated",
        description: "Product has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      await api.delete(`/products/${selectedProduct.id}`);
      
      const updatedProducts = products.filter(product => product.id !== selectedProduct.id);
      setProducts(updatedProducts);
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const openViewDialog = (product) => {
    setSelectedProduct(product);
    setIsViewDialogOpen(true);
  };

  const getStockBadge = (stock: number, isActive: boolean = true) => {
    if (!isActive) {
      return <Badge variant="secondary">Inactive</Badge>;
    }

    if (stock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (stock <= 10) {
      return <Badge variant="warning">Low Stock</Badge>;
    } else {
      return <Badge variant="success">In Stock</Badge>;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploadingImages(true);
    const formData = new FormData();
    
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (isEditDialogOpen && selectedProduct) {
        setSelectedProduct({
          ...selectedProduct,
          images: [...selectedProduct.images, ...response.data.urls],
        });
      } else {
        setNewProduct({
          ...newProduct,
          images: [...newProduct.images, ...response.data.urls],
        });
      }

      toast({
        title: "Success",
        description: "Images uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    if (isEditDialogOpen && selectedProduct) {
      const updatedImages = [...selectedProduct.images];
      updatedImages.splice(index, 1);
      setSelectedProduct({
        ...selectedProduct,
        images: updatedImages,
      });
    } else {
      const updatedImages = [...newProduct.images];
      updatedImages.splice(index, 1);
      setNewProduct({
        ...newProduct,
        images: updatedImages,
      });
    }
  };

  const handleEditProduct = (product: Product) => {
    // Helper function to find parent category for a subcategory
    const findParentCategory = (categoryId: string) => {
      // First check if it's a main category
      const mainCategory = categories.find(cat => cat._id === categoryId && !cat.parentCategory);
      if (mainCategory) {
        return categoryId;
      }
      
      // If not found as main category, check if it's a subcategory
      for (const category of categories) {
        if (category.subcategories) {
          const subcategory = category.subcategories.find(sub => sub._id === categoryId);
          if (subcategory) {
            return category._id; // Return parent category ID
          }
        }
      }
      
      return categoryId; // Fallback to original ID
    };

    const categoryId = typeof product.category === 'object' && product.category
      ? (product.category as { _id: string })._id
      : product.category;
    
    const subcategoryId = typeof product.subcategory === 'object' && product.subcategory
      ? (product.subcategory as { _id: string })._id
      : product.subcategory;

    // Check if the category is actually a subcategory
    const actualCategoryId = findParentCategory(categoryId);
    const actualSubcategoryId = actualCategoryId !== categoryId ? categoryId : subcategoryId;

    const editProduct = {
      ...product,
      id: product._id, // Map _id to id for compatibility
      category: actualCategoryId,
      subcategory: actualSubcategoryId || '',
    };

    setSelectedProduct(editProduct);
    setIsEditDialogOpen(true);
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct({
      ...product,
      id: product._id, // Map _id to id for compatibility
    });
    setIsViewDialogOpen(true);
  };

  const handleDeleteProductClick = (product: Product) => {
    setSelectedProduct({
      ...product,
      id: product._id, // Map _id to id for compatibility
    });
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Product Management</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-center mb-6">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="py-3 px-4 text-left font-medium">Product</th>
                    <th className="py-3 px-4 text-left font-medium">Category</th>
                    <th className="py-3 px-4 text-left font-medium">Subcategory</th>
                    <th className="py-3 px-4 text-left font-medium">Price</th>
                    <th className="py-3 px-4 text-left font-medium">Stock</th>
                    <th className="py-3 px-4 text-left font-medium">Status</th>
                    <th className="py-3 px-4 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr
                      key={product._id || product.id}
                      className="border-t hover:bg-muted/50"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={
                              product.images && product.images.length > 0
                                ? `http://localhost:5454${product.images[0]}`
                                : PLACEHOLDER_IMAGE
                            } 
                            alt={product.name}
                            className="h-10 w-10 rounded object-cover"
                            onError={e => { e.currentTarget.src = PLACEHOLDER_IMAGE; }}
                          />
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {(() => {
                          const categoryId = typeof product.category === 'object' && product.category
                            ? (product.category as { _id?: string })._id || ''
                            : product.category || '';
                          return getCategoryName(categoryId);
                        })()}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {(() => {
                          const subcategoryId = typeof product.subcategory === 'object' && product.subcategory
                            ? (product.subcategory as { _id?: string })._id || ''
                            : product.subcategory || '';
                          return getSubcategoryName(subcategoryId);
                        })()}
                      </td>
                      <td className="py-3 px-4">${Number(product.price).toFixed(2)}</td>
                      <td className="py-3 px-4">{product.stock}</td>
                      <td className="py-3 px-4">{getStockBadge(product.stock, product.isActive)}</td>
                      <td className="py-3 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewProduct(product)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteProductClick(product)}
                              className="text-red-600"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredProducts.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">
                  No products found matching your search.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Fill in the product details and save to add a new product.
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[70vh] overflow-y-auto grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name*</Label>
              <Input
                id="name"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                required
              />
              {addProductErrors.name && <div className="text-red-500 text-xs mt-1">{addProductErrors.name}</div>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category*</Label>
                <Select onValueChange={handleCategoryChange} value={newProduct.category}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(cat => !cat.parentCategory).map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {addProductErrors.category && <div className="text-red-500 text-xs mt-1">{addProductErrors.category}</div>}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="subcategory">Subcategory</Label>
                <Select 
                  onValueChange={handleSubcategoryChange} 
                  value={newProduct.subcategory}
                  disabled={!newProduct.category}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {getSubcategoriesForCategory(newProduct.category).map((subcategory) => (
                      <SelectItem key={subcategory._id} value={subcategory._id}>
                        {subcategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price*</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
                {addProductErrors.price && <div className="text-red-500 text-xs mt-1">{addProductErrors.price}</div>}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="stock">Stock*</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={newProduct.stock}
                  onChange={handleInputChange}
                  placeholder="0"
                />
                {addProductErrors.stock && <div className="text-red-500 text-xs mt-1">{addProductErrors.stock}</div>}
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="images">Images</Label>
              <Input
                id="images"
                name="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImages}
              />
              <div className="flex gap-2 mt-2 flex-wrap">
                {newProduct.images.map((img, idx) => (
                  <div key={img} className="relative">
                    <img src={img} alt="preview" className="h-12 w-12 object-cover rounded" />
                    <Button size="icon" variant="ghost" className="absolute -top-2 -right-2" onClick={() => removeImage(idx)}><X className="h-4 w-4" /></Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sizes">Sizes</Label>
              <Input
                id="sizes"
                name="sizes"
                value={newProduct.sizes.join(',')}
                onChange={e => setNewProduct({ ...newProduct, sizes: e.target.value.split(',').map(s => s.trim()) })}
                placeholder="e.g. S, M, L, XL"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="colors">Colors</Label>
              <Input
                id="colors"
                name="colors"
                value={newProduct.colors.join(',')}
                onChange={e => setNewProduct({ ...newProduct, colors: e.target.value.split(',').map(c => c.trim()) })}
                placeholder="e.g. red, blue, green"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={newProduct.isActive}
                onCheckedChange={checked => setNewProduct({ ...newProduct, isActive: checked })}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={newProduct.featured}
                onCheckedChange={checked => setNewProduct({ ...newProduct, featured: checked })}
              />
              <Label htmlFor="featured">Featured Product</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddProduct}>Add Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the product details and save changes.
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="max-h-[70vh] overflow-y-auto grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Product Name*</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={selectedProduct.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Category*</Label>
                  <Select
                    onValueChange={handleCategoryChange}
                    value={selectedProduct.category || ''}
                    key={`category-${selectedProduct.category}`}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(cat => !cat.parentCategory).map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-subcategory">Subcategory</Label>
                  <Select 
                    onValueChange={handleSubcategoryChange}
                    value={selectedProduct.subcategory || ''}
                    disabled={!selectedProduct.category}
                    key={`subcategory-${selectedProduct.subcategory}-${selectedProduct.category}`}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSubcategoriesForCategory(selectedProduct.category || '').map((subcategory) => (
                        <SelectItem key={subcategory._id} value={subcategory._id}>
                          {subcategory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-price">Price*</Label>
                  <Input
                    id="edit-price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={selectedProduct.price}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-stock">Stock*</Label>
                  <Input
                    id="edit-stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={selectedProduct.stock}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={selectedProduct.description}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-images">Images</Label>
                <Input
                  id="edit-images"
                  name="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImages}
                />
                <div className="flex gap-2 mt-2 flex-wrap">
                  {selectedProduct.images.map((img, idx) => (
                    <div key={img} className="relative">
                      <img src={img} alt="preview" className="h-12 w-12 object-cover rounded" />
                      <Button size="icon" variant="ghost" className="absolute -top-2 -right-2" onClick={() => removeImage(idx)}><X className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-sizes">Sizes</Label>
                <Input
                  id="edit-sizes"
                  name="sizes"
                  value={selectedProduct.sizes.join(',')}
                  onChange={e => setSelectedProduct({ ...selectedProduct, sizes: e.target.value.split(',').map(s => s.trim()) })}
                  placeholder="e.g. S, M, L, XL"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-colors">Colors</Label>
                <Input
                  id="edit-colors"
                  name="colors"
                  value={selectedProduct.colors.join(',')}
                  onChange={e => setSelectedProduct({ ...selectedProduct, colors: e.target.value.split(',').map(c => c.trim()) })}
                  placeholder="e.g. red, blue, green"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-isActive"
                  checked={selectedProduct.isActive}
                  onCheckedChange={checked => setSelectedProduct({ ...selectedProduct, isActive: checked })}
                />
                <Label htmlFor="edit-isActive">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-featured"
                  checked={selectedProduct.featured}
                  onCheckedChange={checked => setSelectedProduct({ ...selectedProduct, featured: checked })}
                />
                <Label htmlFor="edit-featured">Featured Product</Label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateProduct}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Product Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="flex items-center gap-3 py-4">
              <img 
                src={
                  selectedProduct.images && selectedProduct.images.length > 0
                    ? `http://localhost:5454${selectedProduct.images[0]}`
                    : PLACEHOLDER_IMAGE
                } 
                alt={selectedProduct.name}
                className="h-16 w-16 rounded object-cover"
              />
              <div>
                <p className="font-medium">{selectedProduct.name}</p>
                <p className="text-sm text-muted-foreground">{selectedProduct.category}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Product Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <img 
                  src={
                    selectedProduct.images && selectedProduct.images.length > 0
                      ? `http://localhost:5454${selectedProduct.images[0]}`
                      : PLACEHOLDER_IMAGE
                  } 
                  alt={selectedProduct.name}
                  className="h-48 w-48 object-contain"
                />
              </div>
              
              <div className="space-y-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                  <p className="text-base">{selectedProduct.name}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                  <p className="text-base">
                    {(() => {
                      const categoryId = typeof selectedProduct.category === 'object' && selectedProduct.category
                        ? (selectedProduct.category as { _id?: string })._id || ''
                        : selectedProduct.category || '';
                      return getCategoryName(categoryId);
                    })()}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Subcategory</h3>
                  <p className="text-base">
                    {(() => {
                      const subcategoryId = typeof selectedProduct.subcategory === 'object' && selectedProduct.subcategory
                        ? (selectedProduct.subcategory as { _id?: string })._id || ''
                        : selectedProduct.subcategory || '';
                      return getSubcategoryName(subcategoryId);
                    })()}
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Price</h3>
                    <p className="text-base">${Number(selectedProduct.price).toFixed(2)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Stock</h3>
                    <p className="text-base">{selectedProduct.stock}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                    <div className="mt-1">{getStockBadge(selectedProduct.stock, selectedProduct.isActive)}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                  <p className="text-base">{selectedProduct.description}</p>
                </div>
              </div>
              
              <div className="flex gap-2 justify-end mt-6">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setIsViewDialogOpen(false);
                  handleEditProduct(selectedProduct);
                }}>
                  Edit
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
