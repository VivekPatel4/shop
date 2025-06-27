const userService = require("../services/user.service.js");
const Address = require("../models/address.model.js");
const bcrypt = require("bcrypt");

const getUserProfile = async (req, res) => {
    try {
        const jwt = req.headers.authorization?.split(" ")[1];
        if (!jwt) {
            return res.status(404).send({ error: "token not found" });
        }
        const user = await userService.getUserProfileByToken(jwt);
        return res.status(200).send(user);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        return res.status(200).send(users);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

// Address Management
const getAddresses = async (req, res) => {
    try {
        const addresses = await Address.find({ user: req.user._id });
        return res.status(200).send(addresses);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

const addAddress = async (req, res) => {
    try {
        const address = new Address({ ...req.body, user: req.user._id });
        await address.save();
        // Optionally add to user's address array
        req.user.address.push(address._id);
        await req.user.save();
        return res.status(201).send(address);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

const updateAddress = async (req, res) => {
    try {
        const address = await Address.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true }
        );
        if (!address) return res.status(404).send({ error: "Address not found" });
        return res.status(200).send(address);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

const deleteAddress = async (req, res) => {
    try {
        const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!address) return res.status(404).send({ error: "Address not found" });
        // Optionally remove from user's address array
        req.user.address = req.user.address.filter(aid => aid.toString() !== req.params.id);
        await req.user.save();
        return res.status(200).send({ message: "Address deleted" });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

// Profile Update
const updateProfile = async (req, res) => {
    try {
        const updates = { ...req.body };
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 8);
        }
        const user = await userService.findUserById(req.user._id);
        if (!user) return res.status(404).send({ error: "User not found" });
        Object.assign(user, updates);
        await user.save();
        return res.status(200).send(user);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

module.exports = {
    getUserProfile,
    getAllUsers,
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    updateProfile,
};