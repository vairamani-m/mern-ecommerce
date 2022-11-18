const Products = require('../models/productModel')

// Filter, Sorting and paginating

class APIfeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }
    filtering(){
        const queryObj ={ ...this.queryString } // queryString = req.query
        const excludedFields = ['page', 'sort', 'limit']
        excludedFields.forEach(el => delete(queryObj[el]))
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)
        // console.log({ queryStr });
        // gte -> greater than or equal
        // lte -> lesser than or equal
        // gt -> greater than
        // lt -> lesser than
        this.query.find(JSON.parse(queryStr))
        return this
    }

    sorting(){
        if(this.queryString.sort){
        const sortBy = this.queryString.sort.split(',').join(" ")
        this.query = this.query.sort(sortBy)
        }else{
            this.query = this.query.sort('-createdAt')
        }

        return this;
    }

    pagination(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

const productControl ={
    getProducts: async(req, res) => {
        try {
            const features = new APIfeatures(Products.find(), req.query).filtering().sorting().pagination()
            const products = await features.query
            res.json({
                status:'success',
                result: products.length,
                products: products
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    createProduct: async(req, res) => {
        try {
            const { product_id, title, price, description, content, images, category } = req.body;
            if(!images) return res.status(400).json({ message:'No image upload'})
            const product = await Products.findOne({ product_id })
            if(product) return res.status(400).json({ message:'This product already exists.'})
            const newProduct = new Products({
                product_id, title: title.toLowerCase(), price, description, content, images, category
            })
            await newProduct.save()
            res.json({ message: 'Created a product'})
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    updateProduct: async(req, res) => {
        try {
            const { product_id, title, price, description, content, images, category } = req.body;
            if(!images) return res.status(400).json({ message:'No image upload'})
            await Products.findOneAndUpdate({_id:req.params.id}, {
                product_id, title:title.toLowerCase(), price, description, content, images, category
            })
            res.json({ message: 'Updated a product'})
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    deleteProduct: async(req, res) => {
        try {
            await Products.findByIdAndDelete(req.params.id)
            res.json({ message: 'Deleted a product successfully'})
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

module.exports = productControl;
