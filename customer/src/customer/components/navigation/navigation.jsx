import { Fragment, useState, useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  XMarkIcon,
  UserIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { FaUserCircle, FaUser, FaBoxOpen, FaSignOutAlt } from 'react-icons/fa';
import { Menu, MenuItem, Badge, InputBase } from "@mui/material";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import { motion, AnimatePresence } from "framer-motion";
import { authService, userService } from "../../../Data/api";
import axios from 'axios';

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const openUserMenu = Boolean(anchorEl);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [openCategoryId, setOpenCategoryId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    if (token) {
      userService.getProfile().then(res => setUser(res.data)).catch(() => setUser(null));
    } else {
      setUser(null);
    }
    // Fetch categories from API
    axios.get('/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Failed to fetch categories', err));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleUserClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    handleCloseUserMenu();
  };

  const handleCategoryClick = (category, section, item) => {
    navigate(`/${category.id}/${section.id}/${item.id}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  // Helper for avatar initials
  const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return '?';
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <motion.div 
      className={classNames(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0 mr-10">
            <button onClick={() => navigate("/")} className="text-2xl font-bold text-indigo-600">
              ShopNow
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            <nav className="flex space-x-6">
              {categories.map((category) => (
                <div key={category._id} className="relative">
                  <button
                    className="text-base font-semibold px-3 py-2 rounded-md transition-colors duration-200 text-gray-700 hover:text-indigo-600 focus:text-indigo-600 focus:outline-none bg-transparent"
                    onClick={() => setOpenCategoryId(openCategoryId === category._id ? null : category._id)}
                      >
                        {category.name}
                  </button>
                  {openCategoryId === category._id && category.subcategories && category.subcategories.length > 0 && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-20 border border-gray-100">
                      <ul className="py-2">
                        {category.subcategories.map((sub) => (
                          <li key={sub._id}>
                            <button
                              onClick={() => {
                                navigate(`/category/${category._id}/sub/${sub._id}`);
                                setOpenCategoryId(null);
                                          }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded transition-colors duration-150"
                                        >
                              {sub.name}
                                        </button>
                          </li>
                                      ))}
                      </ul>
                              </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-4">
            <form onSubmit={handleSearch} className="relative">
                <InputBase
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 rounded-lg px-4 py-2"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </button>
            </form>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/wishlist")}
              className="text-gray-700 hover:text-indigo-600"
            >
              <HeartIcon className="h-6 w-6" />
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="text-gray-700 hover:text-indigo-600 relative"
            >
                <ShoppingBagIcon className="h-6 w-6" />
              {cartItems.length > 0 && (
                <Badge
                  badgeContent={cartItems.length}
                  color="primary"
                  className="absolute -top-2 -right-2"
                />
              )}
            </button>

            {isAuthenticated && user ? (
              <>
            <button
              onClick={handleUserClick}
                  className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 focus:outline-none"
            >
                  {/* Avatar or initials */}
                  {user.firstName || user.lastName ? (
                    <span className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-lg font-bold shadow">
                      {getInitials(user.firstName, user.lastName)}
                    </span>
                  ) : (
                    <FaUserCircle className="w-8 h-8 text-indigo-300" />
                  )}
                  {/* Show first name */}
                  <span className="hidden sm:inline font-medium text-gray-800 ml-1">{user.firstName}</span>
                </button>
                <Menu
                  anchorEl={anchorEl}
                  open={openUserMenu}
                  onClose={handleCloseUserMenu}
                  className="mt-2"
                  PaperProps={{
                    className: 'rounded-xl shadow-lg min-w-[220px] p-0',
                    style: { padding: 0 }
                  }}
                >
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3 bg-gray-50 rounded-t-xl">
                    {user.firstName || user.lastName ? (
                      <span className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl font-bold shadow">
                        {getInitials(user.firstName, user.lastName)}
                      </span>
                    ) : (
                      <FaUserCircle className="w-10 h-10 text-indigo-300" />
                    )}
                    <div>
                      <div className="font-semibold text-gray-900">{user.firstName} {user.lastName}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <MenuItem onClick={() => { navigate("/profile"); handleCloseUserMenu(); }} className="flex items-center gap-2 px-4 py-2">
                    <FaUser className="text-indigo-500" /> Profile
                  </MenuItem>
                  <MenuItem onClick={() => { navigate("/account/order"); handleCloseUserMenu(); }} className="flex items-center gap-2 px-4 py-2">
                    <FaBoxOpen className="text-indigo-500" /> Orders
                  </MenuItem>
                  <MenuItem onClick={handleLogout} className="flex items-center gap-2 px-4 py-2">
                    <FaSignOutAlt className="text-red-500" /> Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate("/login")}
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Sign Up
            </button>
          </div>
            )}

          {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="lg:hidden text-gray-700 hover:text-indigo-600"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="relative z-50 lg:hidden"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:-translate-x-full"
          >
            <div className="flex px-4 pb-2 pt-5">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <TabGroup className="mt-2">
              <div className="border-b border-gray-200">
                <TabList className="-mb-px flex space-x-8 px-4">
                  {categories.map((category) => (
                    <Tab
                      key={category._id}
                      className="flex-1 whitespace-nowrap border-b-2 border-transparent px-1 py-4 text-base font-medium text-gray-900 data-[selected]:border-indigo-600 data-[selected]:text-indigo-600"
                    >
                      {category.name}
                    </Tab>
                  ))}
                </TabList>
              </div>
              <TabPanels className="mt-2 max-h-[70vh] overflow-y-auto">
                {categories.map((category) => (
                  <TabPanel key={category._id} className="px-4 py-6">
                    <div>
                      {category.subcategories.map((sub) => (
                              <button
                          key={sub._id}
                                onClick={() => {
                                  setOpen(false);
                            setTimeout(() => navigate(`/category/${category._id}/sub/${sub._id}`), 200);
                                }}
                                className="block p-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 rounded-md"
                              >
                          {sub.name}
                              </button>
                      ))}
                    </div>
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>

            {/* Mobile Authentication Links */}
            <div className="border-t border-gray-200 px-4 py-6">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => { navigate("/profile"); setOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 rounded-md"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => { navigate("/account/order"); setOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 rounded-md"
                  >
                    Orders
                  </button>
                  <button
                    onClick={() => { handleLogout(); setOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 rounded-md"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { navigate("/login"); setOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 rounded-md"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { navigate("/register"); setOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 rounded-md"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </motion.div>
  );
}
