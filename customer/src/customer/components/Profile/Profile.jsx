import React, { useState, useEffect } from 'react';
import { userService } from '../../../Data/api';
import Navigation from '../navigation/navigation';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaEnvelope, FaPhone, FaUserTag, FaCalendarAlt, FaMapMarkerAlt, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const emptyAddress = {
    firstName: '',
    lastName: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    mobile: ''
};

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editProfile, setEditProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', email: '', mobile: '', password: '' });
    const [addresses, setAddresses] = useState([]);
    const [addressForm, setAddressForm] = useState(emptyAddress);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [addressError, setAddressError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const response = await userService.getProfile();
                setUser(response.data);
                setProfileForm({
                    firstName: response.data.firstName || '',
                    lastName: response.data.lastName || '',
                    email: response.data.email || '',
                    mobile: response.data.mobile || '',
                    password: ''
                });
            } catch (err) {
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
                setError(err.response?.data?.message || 'Failed to load profile');
            } finally {
                setLoading(false);
            }
        };
        const fetchAddresses = async () => {
            try {
                const res = await userService.getAddresses();
                setAddresses(res.data);
            } catch (err) {
                setAddressError('Failed to load addresses');
            }
        };
        fetchUserProfile();
        fetchAddresses();
    }, [navigate]);

    // Profile update handlers
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileForm(prev => ({ ...prev, [name]: value }));
    };
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            // Only include password if not empty
            const updateData = { ...profileForm };
            if (!updateData.password) {
                delete updateData.password;
            }
            await userService.updateProfile(updateData);
            setEditProfile(false);
            window.location.reload();
        } catch (err) {
            setError('Failed to update profile');
        }
    };

    // Address handlers
    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddressForm(prev => ({ ...prev, [name]: value }));
    };
    const handleAddOrUpdateAddress = async (e) => {
        e.preventDefault();
        try {
            if (editingAddressId) {
                await userService.updateAddress(editingAddressId, addressForm);
            } else {
                await userService.addAddress(addressForm);
            }
            setShowAddressForm(false);
            setEditingAddressId(null);
            setAddressForm(emptyAddress);
            const res = await userService.getAddresses();
            setAddresses(res.data);
        } catch (err) {
            setAddressError('Failed to save address');
        }
    };
    const handleEditAddress = (address) => {
        setEditingAddressId(address._id);
        setAddressForm(address);
        setShowAddressForm(true);
    };
    const handleDeleteAddress = async (id) => {
        try {
            await userService.deleteAddress(id);
            const res = await userService.getAddresses();
            setAddresses(res.data);
        } catch (err) {
            setAddressError('Failed to delete address');
        }
    };
    const handleAddAddressClick = () => {
        setEditingAddressId(null);
        setAddressForm(emptyAddress);
        setShowAddressForm(true);
    };
    const handleCancelAddress = () => {
        setShowAddressForm(false);
        setEditingAddressId(null);
        setAddressForm(emptyAddress);
    };

    if (loading) {
        return (
            <>
                <Navigation />
                <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-50 flex flex-col justify-center items-center mt-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </>
        );
    }
    if (error) {
        return (
            <>
                <Navigation />
                <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-50 flex flex-col justify-center items-center mt-16">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        <p>{error}</p>
                    </div>
                </div>
            </>
        );
    }
    // Helper for avatar initials
    const getInitials = (firstName, lastName) => {
        if (!firstName && !lastName) return '?';
        return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
    };

    return (
        <>
            <Navigation />
            <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 mt-16">
                <div className="max-w-3xl mx-auto space-y-10">
                    {/* Profile Card */}
                    <div className="bg-white shadow-xl rounded-2xl p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center md:items-start w-full md:w-1/3">
                            {user?.firstName || user?.lastName ? (
                                <div className="w-28 h-28 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-5xl font-bold shadow">
                                    {getInitials(user?.firstName, user?.lastName)}
                                </div>
                            ) : (
                                <FaUserCircle className="w-28 h-28 text-indigo-300" />
                            )}
                            <h2 className="mt-4 text-2xl font-bold text-gray-900 text-center md:text-left">
                                {user?.firstName} {user?.lastName}
                            </h2>
                            <button
                                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition font-medium"
                                onClick={() => setEditProfile(!editProfile)}
                            >
                                {editProfile ? 'Cancel' : 'Edit Profile'}
                            </button>
                        </div>
                        {/* Details Section */}
                        <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex items-center gap-3">
                                <FaEnvelope className="text-indigo-500 text-xl" />
                                <div>
                                    <div className="text-xs text-gray-500">Email</div>
                                    <div className="font-medium text-gray-800 break-all">{user?.email || 'Not provided'}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaPhone className="text-indigo-500 text-xl" />
                                <div>
                                    <div className="text-xs text-gray-500">Mobile</div>
                                    <div className="font-medium text-gray-800">{user?.mobile || 'Not provided'}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaUserTag className="text-indigo-500 text-xl" />
                                <div>
                                    <div className="text-xs text-gray-500">Role</div>
                                    <div className="font-medium text-gray-800">{user?.role || 'Not provided'}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaCalendarAlt className="text-indigo-500 text-xl" />
                                <div>
                                    <div className="text-xs text-gray-500">Member Since</div>
                                    <div className="font-medium text-gray-800">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Not provided'}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Edit Form */}
                    {editProfile && (
                        <form onSubmit={handleProfileUpdate} className="bg-white shadow rounded-lg p-6 space-y-4">
                            <h3 className="text-xl font-bold mb-2">Edit Profile</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                                    <input type="text" name="firstName" value={profileForm.firstName} onChange={handleProfileChange} className="mt-1 p-2 border rounded w-full" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                    <input type="text" name="lastName" value={profileForm.lastName} onChange={handleProfileChange} className="mt-1 p-2 border rounded w-full" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input type="email" name="email" value={profileForm.email} onChange={handleProfileChange} className="mt-1 p-2 border rounded w-full" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Mobile</label>
                                    <input type="text" name="mobile" value={profileForm.mobile} onChange={handleProfileChange} className="mt-1 p-2 border rounded w-full" />
                                </div>
                            </div>
                            <div className="flex gap-4 mt-4">
                                <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">Save Changes</button>
                                <button type="button" className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300" onClick={() => setEditProfile(false)}>Cancel</button>
                            </div>
                        </form>
                    )}

                    {/* Address Management */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold">Addresses</h3>
                            <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700" onClick={handleAddAddressClick}>
                                <FaPlus /> Add Address
                            </button>
                        </div>
                        {addressError && <div className="text-red-500 mb-2">{addressError}</div>}
                        {addresses.length === 0 ? (
                            <div className="text-gray-500">No addresses found.</div>
                        ) : (
                            <div className="space-y-4">
                                {addresses.map(address => (
                                    <div key={address._id} className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-gray-50">
                                        <div className="flex items-center gap-3">
                                            <FaMapMarkerAlt className="text-indigo-500 text-xl" />
                                            <div>
                                                <div className="font-semibold">{address.firstName} {address.lastName}</div>
                                                <div className="text-sm text-gray-600">{address.streetAddress}, {address.city}, {address.state} {address.zipCode}</div>
                                                <div className="text-sm text-gray-600">Mobile: {address.mobile}</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-2 sm:mt-0">
                                            <button className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200" onClick={() => handleEditAddress(address)}><FaEdit /> Edit</button>
                                            <button className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200" onClick={() => handleDeleteAddress(address._id)}><FaTrash /> Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* Address Form */}
                        {showAddressForm && (
                            <form onSubmit={handleAddOrUpdateAddress} className="mt-6 bg-white border rounded-lg p-6 space-y-4 shadow">
                                <h4 className="text-lg font-bold mb-2">{editingAddressId ? 'Edit Address' : 'Add Address'}</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                                        <input type="text" name="firstName" value={addressForm.firstName} onChange={handleAddressChange} className="mt-1 p-2 border rounded w-full" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                        <input type="text" name="lastName" value={addressForm.lastName} onChange={handleAddressChange} className="mt-1 p-2 border rounded w-full" required />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Street Address</label>
                                        <input type="text" name="streetAddress" value={addressForm.streetAddress} onChange={handleAddressChange} className="mt-1 p-2 border rounded w-full" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">City</label>
                                        <input type="text" name="city" value={addressForm.city} onChange={handleAddressChange} className="mt-1 p-2 border rounded w-full" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">State</label>
                                        <input type="text" name="state" value={addressForm.state} onChange={handleAddressChange} className="mt-1 p-2 border rounded w-full" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Zip Code</label>
                                        <input type="text" name="zipCode" value={addressForm.zipCode} onChange={handleAddressChange} className="mt-1 p-2 border rounded w-full" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Mobile</label>
                                        <input type="text" name="mobile" value={addressForm.mobile} onChange={handleAddressChange} className="mt-1 p-2 border rounded w-full" required />
                                    </div>
                                </div>
                                <div className="flex gap-4 mt-4">
                                    <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">{editingAddressId ? 'Update Address' : 'Add Address'}</button>
                                    <button type="button" className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300" onClick={handleCancelAddress}>Cancel</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile; 