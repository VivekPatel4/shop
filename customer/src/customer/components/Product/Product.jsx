import React, { useEffect, useState, Fragment } from 'react';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import ProductCard from "./ProductCard";
import { filters, singleFilter } from "./FilterData";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { productService, cartService } from '../../../Data/api';
import { FaSearch } from 'react-icons/fa';
import { CircularProgress, Typography, Box, Container, Grid } from '@mui/material';
import { Sort } from '@mui/icons-material';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';

const sortOptions = [
  { name: "Price: Low to High", value: "price_low" },
  { name: "Price: High to Low", value: "price_high" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const colorOptions = ['Red', 'Blue', 'Green', 'Black', 'White']; // Example, replace with your data
const sizeOptions = ['S', 'M', 'L', 'XL']; // Example, replace with your data

const Product = () => {
    const { categoryId, subId } = useParams();
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        category: categoryId,
        subcategory: subId || '',
        color: searchParams.get('color') || '',
        sizes: searchParams.get('sizes') || '',
        price: searchParams.get('price') || '',
        discount: searchParams.get('discount') || '',
        stock: searchParams.get('stock') || '',
        sort: searchParams.get('sort') || '',
        page: searchParams.get('page') || '1',
        pageSize: searchParams.get('pageSize') || '12'
    });
    const navigate = useNavigate();
    const location = useLocation();
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [priceRange, setPriceRange] = useState([0, 1000]);

    useEffect(() => {
        // Reset filters and selected values when category or subcategory changes
        setFilters({
            category: categoryId,
            subcategory: subId || '',
            color: '',
            sizes: '',
            price: '',
            discount: '',
            stock: '',
            sort: '',
            page: '1',
            pageSize: '12',
            minPrice: 0,
            maxPrice: 1000
        });
        setSelectedColor('');
        setSelectedSize('');
        setPriceRange([0, 1000]);
    }, [categoryId, subId]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                console.log('Fetching products with filters:', filters);
                const response = await productService.getAllProducts(filters);
                console.log('Products response:', response);
                setProducts(response.data.content || []);
                setError(null);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError(err.message || 'Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };
        if (categoryId) {
            fetchProducts();
        }
    }, [categoryId, subId, filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: '1' // Reset to first page when filters change
        }));
    };

    const handleSortChange = (value) => {
        handleFilterChange('sort', value);
    };

    const handleApplyFilters = () => {
        setFilters(prev => ({
            ...prev,
            color: selectedColor,
            sizes: selectedSize,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
            page: '1'
        }));
        setFilterDrawerOpen(false);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    if (products.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
                <Typography variant="h6" color="textSecondary">
                    No products found
                </Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Filter and Sort Bar */}
            <Box sx={{
                mb: 4,
                p: 2,
                borderRadius: 2,
                background: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: 1
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<FilterListIcon />}
                        onClick={() => setFilterDrawerOpen(true)}
                    >
                        Filters
                    </Button>
                    <Drawer anchor="left" open={filterDrawerOpen} onClose={() => setFilterDrawerOpen(false)}>
                        <Box sx={{ width: 300, p: 3 }}>
                            <Typography variant="h6" gutterBottom>Filter Products</Typography>
                            <Box mb={2}>
                                <Typography variant="subtitle2">Color</Typography>
                                <select
                                    value={selectedColor}
                                    onChange={e => setSelectedColor(e.target.value)}
                                    style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                                >
                                    <option value="">All</option>
                                    {colorOptions.map(color => (
                                        <option key={color} value={color}>{color}</option>
                                    ))}
                                </select>
                            </Box>
                            <Box mb={2}>
                                <Typography variant="subtitle2">Size</Typography>
                                <select
                                    value={selectedSize}
                                    onChange={e => setSelectedSize(e.target.value)}
                                    style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                                >
                                    <option value="">All</option>
                                    {sizeOptions.map(size => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                </select>
                            </Box>
                            <Box mb={2}>
                                <Typography variant="subtitle2">Price Range</Typography>
                                <Slider
                                    value={priceRange}
                                    onChange={(_, newValue) => setPriceRange(newValue)}
                                    valueLabelDisplay="auto"
                                    min={0}
                                    max={1000}
                                    step={10}
                                />
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="caption">${priceRange[0]}</Typography>
                                    <Typography variant="caption">${priceRange[1]}</Typography>
                                </Box>
                            </Box>
                            <Button variant="contained" color="primary" fullWidth onClick={handleApplyFilters}>
                                Apply Filters
                            </Button>
                        </Box>
                    </Drawer>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Menu as="div" className="relative inline-block text-left">
                        <Menu.Button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                            <Sort className="h-5 w-5 mr-2" />
                            Sort
                        </Menu.Button>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    {sortOptions.map((option) => (
                                        <Menu.Item key={option.value}>
                                            {({ active }) => (
                                                <button
                                                    onClick={() => handleSortChange(option.value)}
                                                    className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700 w-full text-left`}
                                                >
                                                    {option.name}
                                                </button>
                                            )}
                                        </Menu.Item>
                                    ))}
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </Box>
            </Box>
            {/* Product Grid */}
            <Grid container spacing={4}>
                {products.map((product, idx) => (
                    <Grid item key={product.id || product._id || idx} xs={12} sm={6} md={4} lg={3}>
                        <ProductCard product={product} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Product;
