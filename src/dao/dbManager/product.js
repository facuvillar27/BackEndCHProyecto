import productModel from "../models/products.model.js";
import dotenv from "dotenv"
dotenv.config()
const PORT = process.env.PORT

export default class Products {
    constructor() {
        console.log("Working products with database in MongoDB")
    }

    async getAll() {
        let products = await productModel.find().lean()
        return products
    }

    async getById(id) {
        let product = await productModel.findById(id).lean()
        return product
    }

    async getByCode(code) {
        let product = await productModel.findOne({ code: code }).lean()
        return product
    }

    async getFilteredProducts(req) {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort || '';
        const query = req.query.query || '';
        const stock = parseInt(req.query.stock) || 0;
    
        let filter = this.buildFilter(req.query);
        let sortOptions = this.buildSortOptions(sort);
        let options = this.buildOptions(page, limit, sortOptions);
    
        return await productModel.paginate(filter, options);
    }
    
    buildFilter(query) {
        let filter = {};
    
        for (let key in query) {
            if (['code', 'status', 'price', 'stock', 'description', 'title'].includes(key)) {
                filter[key] = query[key];
            }
        }
    
        return filter;
    }
    
    buildSortOptions(sort) {
        let sortOptions = {};
        if (sort.toLowerCase() === 'asc') {
            sortOptions = { price: 1 };
        } else if (sort.toLowerCase() === 'desc') {
            sortOptions = { price: -1 };
        }
    
        return sortOptions;
    }
    
    buildOptions(page, limit, sortOptions) {
        return {
            page: page,
            limit: limit,
            sort: sortOptions,
            populate: ''
        };
    }
    
    prepareResponse(req, result) {
        const limit = parseInt(req.query.limit) || 10;

        const response = {
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.prevPage ? `localhost:${PORT}/api/products?page=${result.prevPage}&limit=${limit}` : null,
            nextLink: result.nextPage ? `localhost:${PORT}/api/products?page=${result.nextPage}&limit=${limit}` : null,
        };
    
        return response;
    }
    

    async saveProduct(product) {
        let newProduct = new productModel(product)
        let result = await newProduct.save()
        return result
    }

    async updateProduct(id, product) {
        const result = await productModel.updateOne({ _id: id }, product)
        return result
    }

    async deleteProduct(id) {
        const result = await productModel.findByIdAndDelete(id)
        return result
    }
}