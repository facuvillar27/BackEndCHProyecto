import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import productModel from './products.model.js';

const cartCollection = 'carts';

const CartSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: productModel.modelName,
        },
        quantity: Number,
    }],
});

CartSchema.plugin(mongoosePaginate);

const cartModel = mongoose.model(cartCollection, CartSchema);

export default cartModel;
