const User = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const jwtProvider = require("../config/jwtProvider.js");

// Admin Login
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, role: "ADMIN" });
        if (!user) return res.status(401).json({ error: "Invalid credentials" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });
        const token = jwtProvider.generateToken(user._id);
        res.json({ token, user: { _id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Admin Management
exports.getAllAdmins = async (req, res) => {
    const admins = await User.find({ role: "ADMIN" }).select("-password");
    res.json(admins);
};
exports.createAdmin = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: "Email already in use" });
        const hash = await bcrypt.hash(password, 10);
        const admin = new User({ firstName, lastName, email, password: hash, role: "ADMIN" });
        await admin.save();
        res.status(201).json({ message: "Admin created", admin: { _id: admin._id, email: admin.email, firstName: admin.firstName, lastName: admin.lastName, role: admin.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user._id.toString() === id) return res.status(400).json({ error: "Cannot delete yourself" });
        await User.deleteOne({ _id: id, role: "ADMIN" });
        res.json({ message: "Admin deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Customer Management
exports.getAllCustomers = async (req, res) => {
    const customers = await User.find({ role: "CUSTOMER" }).select("-password");
    res.json(customers);
};
exports.getCustomerById = async (req, res) => {
    const customer = await User.findOne({ _id: req.params.id, role: "CUSTOMER" }).select("-password");
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
};
exports.blockOrUnblockCustomer = async (req, res) => {
    const customer = await User.findOne({ _id: req.params.id, role: "CUSTOMER" });
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    customer.blocked = !customer.blocked;
    await customer.save();
    res.json({ message: customer.blocked ? "Customer blocked" : "Customer unblocked" });
};
exports.deleteCustomer = async (req, res) => {
    await User.deleteOne({ _id: req.params.id, role: "CUSTOMER" });
    res.json({ message: "Customer deleted" });
};
exports.updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = (({ firstName, lastName, email, mobile }) => ({ firstName, lastName, email, mobile }))(req.body);
        const customer = await User.findOneAndUpdate(
            { _id: id, role: "CUSTOMER" },
            updates,
            { new: true, runValidators: true, context: 'query' }
        ).select("-password");
        if (!customer) return res.status(404).json({ error: "Customer not found" });
        res.json(customer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.createCustomer = async (req, res) => {
    try {
        const { firstName, lastName, email, password, mobile } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: "Email already in use" });
        const hash = await bcrypt.hash(password, 10);
        const customer = new User({ firstName, lastName, email, password: hash, mobile, role: "CUSTOMER" });
        await customer.save();
        res.status(201).json({ message: "Customer created", customer: { _id: customer._id, email: customer.email, firstName: customer.firstName, lastName: customer.lastName, mobile: customer.mobile, role: customer.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// First Admin Creation (no auth required)
exports.createFirstAdmin = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        
        // Check if any admin exists
        const existingAdmin = await User.findOne({ role: "ADMIN" });
        if (existingAdmin) {
            return res.status(400).json({ error: "First admin already exists" });
        }

        // Check if email is already in use
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use" });
        }

        const hash = await bcrypt.hash(password, 10);
        const admin = new User({ 
            firstName, 
            lastName, 
            email, 
            password: hash, 
            role: "ADMIN" 
        });
        
        await admin.save();
        const token = jwtProvider.generateToken(admin._id);
        
        res.status(201).json({ 
            token,
            admin: { 
                _id: admin._id, 
                email: admin.email, 
                firstName: admin.firstName, 
                lastName: admin.lastName, 
                role: admin.role 
            } 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}; 