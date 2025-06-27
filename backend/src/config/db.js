const mongoose = require("mongoose")
require('dotenv').config()

const connectDb = async () => {
    try {
        const mongodbUrl = process.env.MONGODB_URL || "mongodb+srv://zipping:zipping9904092901@cluster0.vyezr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
        await mongoose.connect(mongodbUrl)
        console.log("Connected to MongoDB successfully")
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message)
        throw error
    }
}

module.exports = { connectDb }