const Category=require("../models/category.model")
const Product=require("../models/product.model")
const mongoose = require('mongoose');

async function createProduct(reqData) {
    // Directly use the category and subcategory IDs from the frontend
    const product = new Product({
        name: reqData.name,
        description: reqData.description,
        price: reqData.price,
        discountedPrice: reqData.discountedPrice,
        category: reqData.category,
        subcategory: reqData.subcategory,
        images: reqData.images,
        sizes: reqData.sizes,
        colors: reqData.colors,
        stock: reqData.stock,
        isActive: reqData.isActive,
        featured: reqData.featured,
    });
    return await product.save();
}

async function deleteProduct(productId) {
    const product=await findProductById(productId);
    
    await Product.findByIdAndDelete(productId);
    return "Product deleted Successfully";
}

async function updateProduct(productId,reqData) {
    return await Product.findByIdAndUpdate(productId,reqData);
    
}

async function findProductById(id){
    const product =await Product.findById(id).populate("category").exec();

    if(!product){
        throw new Error("Product not found with id "+id);
    }
    return product;
}

async function getAllProducts(reqQuery) {
    let {category,color,sizes,minPrice,maxPrice,minDiscount,sort,stock,pageNumber,pageSize} = reqQuery;
    pageSize = Number(pageSize) || 10;
    pageNumber = Number(pageNumber) || 1;

    let useAggregate = !!sort;
    let aggregatePipeline = [];

    // Add $addFields for effectivePrice
    aggregatePipeline.push({
        $addFields: {
            effectivePrice: {
                $cond: [
                    { $and: [ { $ifNull: [ "$discountedPrice", false ] }, { $gt: [ "$discountedPrice", 0 ] } ] },
                    "$discountedPrice",
                    "$price"
                ]
            }
        }
    });

    // Filtering
    let matchStage = {};
    if (category) matchStage.category = mongoose.Types.ObjectId.isValid(category) ? new mongoose.Types.ObjectId(category) : category;
    if (reqQuery.subcategory) matchStage.subcategory = mongoose.Types.ObjectId.isValid(reqQuery.subcategory) ? new mongoose.Types.ObjectId(reqQuery.subcategory) : reqQuery.subcategory;
    if (color) matchStage.colors = { $regex: new RegExp(color, "i") };
    if (sizes) matchStage.sizes = { $in: sizes.split(",").map(s => s.trim()) };
    if (stock) {
        if (stock === "in_stock") matchStage.stock = { $gt: 0 };
        else if (stock === "out_of_stock") matchStage.stock = 0;
    }
    if (minPrice && maxPrice) {
        matchStage.$expr = {
            $and: [
                { $gte: [ "$effectivePrice", Number(minPrice) ] },
                { $lte: [ "$effectivePrice", Number(maxPrice) ] }
            ]
        };
    }
    if (Object.keys(matchStage).length > 0) {
        aggregatePipeline.push({ $match: matchStage });
    }

    // Sorting
    if (sort) {
        const sortDirection = sort === "price_high" ? -1 : 1;
        aggregatePipeline.push({ $sort: { effectivePrice: sortDirection } });
    }

    // Pagination
    const skip = (pageNumber - 1) * pageSize;
    aggregatePipeline.push({ $skip: skip }, { $limit: pageSize });

    // Populate category
    aggregatePipeline.push({
        $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category"
        }
    }, {
        $unwind: { path: "$category", preserveNullAndEmptyArrays: true }
    });

    // Get products
    const products = await Product.aggregate(aggregatePipeline);

    // For total count, run the same pipeline without $skip/$limit
    const countPipeline = aggregatePipeline.filter(stage => !stage.$skip && !stage.$limit && !stage.$sort);
    countPipeline.push({ $count: "count" });
    const totalProductsArr = await Product.aggregate(countPipeline);
    const totalProducts = totalProductsArr[0]?.count || 0;
    const totalPages = Math.ceil(totalProducts / pageSize);

    return {
        content: products,
        currentPage: pageNumber,
        totalPages: totalPages,
        totalProducts: totalProducts
    };
}

async function createMultipleProduct(products) {
    for(let product of products){
        await createProduct(product);
    }    
}

module.exports={
    createProduct,
    deleteProduct,
    updateProduct,
    getAllProducts,
    findProductById,
    createMultipleProduct
}