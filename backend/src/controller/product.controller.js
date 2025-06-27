const productService = require("../services/product.service");

const getAllProducts = async (req, res) => {
    try {
        console.log('Received query params:', req.query); // Debug log
        const products = await productService.getAllProducts(req.query);
        console.log('Products from service:', products); // Debug log
        return res.status(200).send(products);
    } catch (error) {
        console.error('Error in getAllProducts controller:', error); // Debug log
        return res.status(500).send({ error: error.message });
    }
};

const findProductById = async (req, res) => {
    try {
        const product = await productService.findProductById(req.params.id);
        return res.status(200).send(product);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const product = await productService.createProduct(req.body);
        return res.status(201).send(product);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

const createMultipleProduct = async (req, res) => {
    try {
        const products = await productService.createMultipleProduct(req.body);
        return res.status(201).send(products);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await productService.updateProduct(req.params.id, req.body);
        return res.status(200).send(product);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        await productService.deleteProduct(req.params.id);
        return res.status(200).send({ message: "Product deleted successfully" });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

module.exports = {
    getAllProducts,
    findProductById,
    createProduct,
    createMultipleProduct,
    updateProduct,
    deleteProduct
};