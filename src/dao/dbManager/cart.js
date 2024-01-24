import cartModel from '../models/carts.model.js'

export default class Carts {
    constructor() {
        console.log("Working carts with database in MongoDB")
    }

    async getAll() {
        let carts = await cartModel.find().lean()
        return carts
    }

    async getById(id) {
        let cart = await cartModel.findById(id)
        return cart
    }

    async saveCart(cart) {
        let newCart = new cartModel(cart)
        let result = await newCart.save()
        return result
    }

    async updateCart(id, cart) {
        const result = await cartModel.updateOne({ _id: id }, cart)
        return result
    }

    async deleteCart(id) {
        const result = await cartModel.findByIdAndDelete(id)
        return result
    }

    async addProductToCart(cartId, productId, quantity) {
        const cart = await this.getById(cartId)
        if (!cart) {
            throw new Error('Carrito no encontrado')
        }
        const product = cart.products.find(p => p.product.toString() === productId)
        if (product) {
            product.quantity += quantity
        } else {
            cart.products.push({
                product: productId,
                quantity: quantity
            })
        }
        const result = await this.updateCart(cartId, cart)
        return result
    }

    async deleteProductFromCart(cartId, productId) {
        const result = await cartModel.updateOne(
            { _id: cartId },
            { $pull: { products: { product: productId } } }
        );
        if (result.nModified === 0) {
            throw new Error('Producto no encontrado en el carrito');
        }
        return result;
    }

    async updateProductQuantityInCart(cartId, productId, quantity) {
        const cart = await this.getById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
    
        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
        if (productIndex === -1) {
            throw new Error('Producto no encontrado en el carrito');
        }
    
        cart.products[productIndex].quantity = quantity;
    
        const result = await this.updateCart(cartId, cart);
        return result;
    }

    async emptyCart(cartId) {
        const result = await this.updateCart(cartId, { products: [] });
        return result;
    }
    
}