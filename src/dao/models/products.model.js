import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productCollection = 'products';

const ProductSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    thumbnail: String,
    code: { 
        type: String,
        unique: true,
        index: true
    },
    stock: Number,
    status: Boolean,
    category: String,
});

ProductSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productCollection, ProductSchema);

export default productModel;