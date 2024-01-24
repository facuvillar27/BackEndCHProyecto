import express from "express";
import productModel from "../dao/models/products.model.js";
import dotenv from "dotenv";
import Products from "../dao/dbManager/product.js";
import CartManager from "../dao/dbManager/cart.js";
import cartModel from "../dao/models/carts.model.js";

dotenv.config();
const router = express.Router();
const productManager = new Products();
const cartManager = new CartManager();

router.get("/products", async (req, res) => {
    try {
        const result = await productManager.getFilteredProducts(req);
        const productsRender = result.docs.map(doc => doc.toObject())
        res.render("products", { products: productsRender })
    } catch (error) {
        console.error(error); // Imprime el error completo
        res.status(500).json({ status: 'error', error: "Error al obtener productos" })
    }
});


router.get("/:cid", async (req, res) => {
    const cid = req.params.cid;

    try {
        // Buscar el carrito por su ID
        const cart = await cartManager.getById(cid);
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        // Convertir el carrito a un documento de Mongoose
        const mongooseCart = await cartModel.findById(cart._id);

        // Popular los productos en el carrito
        const populatedCart = await mongooseCart.populate('products.product')

        // Extraer solo los productos del carrito
        const products = populatedCart.products.map(item => ({
            title: item.product.title,
            thumbnail: item.product.thumbnail,
            description: item.product.description,
            price: item.product.price,
            quantity: item.quantity
        }));

        res.render("cart", { products: products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener el carrito" });
    }
});

router.get('/api/addProduct', async (req, res) => {
    res.render('addProduct');
});

router.post('/api/addProduct', async (req, res) => {
    const requiredFields = ['title', 'description', 'price', 'code', 'stock', 'status', 'category'];
    for (let field of requiredFields) {
        if (!req.body[field]) {
            return res.status(400).json({ error: `El campo ${field} es requerido` });
        }
    }
    const productExists = await productManager.getByCode(req.body.code)
    if (productExists) {
        return res.status(404).json({ error: "Producto existente" });
    }

    const { title, description, price, thumbnail, code, stock, status, category } = req.body;
    try {
        const response = await productManager.saveProduct({
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status,
            category
        })
        return res.json({ message: "Producto agregado", data: response });
    } catch (error) {
        return res.status(500).json({ error: "Error al agregar el producto" });
    }
});






export default router;
