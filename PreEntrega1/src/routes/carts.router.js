import express from "express"
const router = express.Router()
import { CartManager } from "../CartManager.js"
import { createFile, updateFile } from "../helper.js"
import { ProductManager } from "../ProductManager.js"
const FILE_NAME = "./carts.json"

const cartManager = new CartManager()
const productManager = new ProductManager()

router.get("/", async (req,res) => {
    try {
        const carts = await cartManager.getCarts()
        res.json({carts: carts})
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el carrito" })
    }
})

router.post("/", async (req,res) => {
    try {
        let carts = await cartManager.getCarts()
        const existingIds = new Set(carts.map(cart => cart.id));
        let newIdCart = 1
        while (existingIds.has(newIdCart)) {
            newIdCart++;
        }
        const cart = {
        id: newIdCart,
        products: []
        }
        carts.push(cart)
        createFile(JSON.stringify(carts), FILE_NAME);
        return res.status(200).json({status: "Carrito agregado correctamente"})
    } catch (error) {
        console.error('Error al agregar el carrito:', error)
        res.status(500).json({ error: "Error al agregar el carrito"})
    }
 })

router.get("/:cid", async (req,res) => {
    try {
        let cid = req.params.cid
        const carts = await cartManager.getCarts()
        let cart = carts.find(c => c.id == cid)
    
        if(!cart) {
            return res.status(404).json({error: "Carrito no encontrado"})
        }
        let cartProducts = cart.products
        res.json({ cartProducts })
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el carrito"})
    }
})

router.post("/:cid/product/:pid", async (req,res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const productsForChoose = await productManager.getProducts()
        const carts = await cartManager.getCarts()
        const existingProductIndex = productsForChoose.findIndex(product => product.id == pid)
        const existingCartIndex = carts.findIndex(cart => cart.id == cid)
        if (existingCartIndex !== -1) {
            if(existingProductIndex !== -1) {
                const product = carts[existingCartIndex].products.find(product => product.id == pid)
                if(product) {
                    product.quantity++;
                } else {
                    carts[existingCartIndex].products.push({
                        id: pid,
                        quantity: 1
                    });
                }
                await updateFile(JSON.stringify(carts), FILE_NAME)
                return res.status(200).json({status: "Producto agregado al carrito exitosamente"})
            } else {
                return res.status(404).json({error: "Producto no encontrado"})
            }
        } else {
            return res.status(404).json({error: "Carrito no encontrado"})
        }  
    } catch (error) {
        res.status(500).json({ error: "Error al agregar el producto"})
    }
})
 
  

export default router