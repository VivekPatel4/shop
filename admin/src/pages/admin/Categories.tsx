import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Search, Plus, MoreHorizontal, Edit, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import axios from 'axios';

interface Category {
    _id: string;
    name: string;
    description: string;
    parentCategory: string | null;
    subcategories?: Category[];
}

export default function Categories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [newCategory, setNewCategory] = useState({
        name: '',
        description: '',
        parentCategory: null
    });
    const { toast } = useToast();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/categories');
            const data = Array.isArray(response.data) ? response.data : (response.data.categories || []);
            setCategories(data);
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch categories",
                variant: "destructive",
            });
            setLoading(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredCategories = categories.filter(category => 
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getAuthHeaders = () => {
        const token = localStorage.getItem('admin_token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const handleCreateCategory = async () => {
        try {
            await axios.post('/api/categories', newCategory, { headers: getAuthHeaders() });
            toast({
                title: "Success",
                description: "Category created successfully",
            });
            setNewCategory({ name: '', description: '', parentCategory: null });
            setIsAddDialogOpen(false);
            fetchCategories();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create category",
                variant: "destructive",
            });
        }
    };

    const handleUpdateCategory = async () => {
        if (!selectedCategory) return;
        try {
            await axios.put(`/api/categories/${selectedCategory._id}`, selectedCategory, { headers: getAuthHeaders() });
            toast({
                title: "Success",
                description: "Category updated successfully",
            });
            setIsEditDialogOpen(false);
            fetchCategories();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update category",
                variant: "destructive",
            });
        }
    };

    const handleDeleteCategory = async () => {
        if (!selectedCategory) return;
        try {
            await axios.delete(`/api/categories/${selectedCategory._id}`, { headers: getAuthHeaders() });
            toast({
                title: "Success",
                description: "Category deleted successfully",
            });
            setIsDeleteDialogOpen(false);
            fetchCategories();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete category",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                </Button>
            </div>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle>Category Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center mb-6">
                        <div className="relative max-w-sm">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search categories..."
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
                                        <th className="py-3 px-4 text-left font-medium">Name</th>
                                        <th className="py-3 px-4 text-left font-medium">Description</th>
                                        <th className="py-3 px-4 text-left font-medium">Parent Category</th>
                                        <th className="py-3 px-4 text-left font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={4} className="py-12 text-center text-muted-foreground">Loading...</td>
                                        </tr>
                                    ) : filteredCategories.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="py-12 text-center text-muted-foreground">No categories found matching your search.</td>
                                        </tr>
                                    ) : (
                                        filteredCategories.map((category) => [
                                            <tr key={category._id} className="border-t hover:bg-muted/50">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">{category.name}</span>
                                                        {!category.parentCategory && <Badge variant="secondary">Main</Badge>}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">{category.description}</td>
                                                <td className="py-3 px-4">
                                                    {category.parentCategory
                                                        ? categories.find(c => c._id === category.parentCategory)?.name
                                                        : <span className="text-muted-foreground">—</span>}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Button variant="outline" size="sm" className="mr-2" onClick={() => { setSelectedCategory(category); setIsEditDialogOpen(true); }}>
                                                        <Edit className="h-4 w-4 mr-1" /> Edit
                                                    </Button>
                                                    <Button variant="destructive" size="sm" onClick={() => { setSelectedCategory(category); setIsDeleteDialogOpen(true); }}>
                                                        <Trash className="h-4 w-4 mr-1" /> Delete
                                                    </Button>
                                                </td>
                                            </tr>,
                                            ...(category.subcategories && category.subcategories.length > 0
                                                ? category.subcategories.map((sub) => (
                                                    <tr key={sub._id} className="border-t bg-muted/30">
                                                        <td className="py-3 px-4 pl-10">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium">{sub.name}</span>
                                                                <Badge variant="outline">Subcategory</Badge>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4">{sub.description}</td>
                                                        <td className="py-3 px-4">
                                                            {category.name}
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <Button variant="outline" size="sm" className="mr-2" onClick={() => { setSelectedCategory(sub); setIsEditDialogOpen(true); }}>
                                                                <Edit className="h-4 w-4 mr-1" /> Edit
                                                            </Button>
                                                            <Button variant="destructive" size="sm" onClick={() => { setSelectedCategory(sub); setIsDeleteDialogOpen(true); }}>
                                                                <Trash className="h-4 w-4 mr-1" /> Delete
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))
                                                : [])
                                        ])
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Add Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Category</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="Category Name"
                                value={newCategory.name}
                                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Category Description"
                                value={newCategory.description}
                                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="parent">Parent Category</Label>
                            <Select
                                value={newCategory.parentCategory || 'main'}
                                onValueChange={(value) => setNewCategory({ ...newCategory, parentCategory: value === 'main' ? null : value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select parent category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="main">Main Category</SelectItem>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateCategory}>Create Category</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                    </DialogHeader>
                    {selectedCategory && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Name</Label>
                                <Input
                                    id="edit-name"
                                    value={selectedCategory.name}
                                    onChange={(e) => setSelectedCategory({ ...selectedCategory, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-description">Description</Label>
                                <Textarea
                                    id="edit-description"
                                    value={selectedCategory.description}
                                    onChange={(e) => setSelectedCategory({ ...selectedCategory, description: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-parent">Parent Category</Label>
                                <Select
                                    value={selectedCategory.parentCategory || 'main'}
                                    onValueChange={(value) => setSelectedCategory(selectedCategory ? { ...selectedCategory, parentCategory: value === 'main' ? null : value } : null)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select parent category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="main">Main Category</SelectItem>
                                        {categories
                                            .filter(cat => cat._id !== selectedCategory?._id)
                                            .map((cat) => (
                                                <SelectItem key={cat._id} value={cat._id}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdateCategory}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Category</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete this category? This action cannot be undone.</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteCategory}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
} 