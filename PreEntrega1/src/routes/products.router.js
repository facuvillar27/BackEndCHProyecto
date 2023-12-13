import express from "express"
const router = express.Router()
import { ProductManager } from "../ProductManager.js"
import { createFile, updateFile } from "../helper.js"
const FILE_NAME = "./products.json"

const productManager = new ProductManager()


router.get("/", async (req,res) => {
    try {
        const { limit } = req.query
        const products = await productManager.getProducts()
        const productsLimited = limit ? products.slice(0, parseInt(limit, 10)) : products;
        res.json({products: productsLimited})
    } catch (error) {
        res.status(500).json({ error: "Error al obtener productos" })
    }
})

router.get("/:pid", async (req,res) => {
    try {
        let pid = req.params.pid
        const products = await productManager.getProducts()
        let product = products.find(p => p.id == pid)
    
        if(!product) {
            return res.status(404).json({error: "Producto no encontrado"})
        }
        res.json({ product })
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el producto"})
    }
})

router.post("/", async (req,res) => {
    const requiredFields = ['title', 'description', 'price', 'code', 'stock', 'status', 'category'];

   // Verificar que todos los campos requeridos estén presentes en req.body
    for (let field of requiredFields) {
        if (!req.body[field]) {
            return res.status(400).json({ error: `El campo ${field} es requerido` });
        }
    }

    try {
        const product = req.body
        const products = await productManager.getProducts()
        const productExists = products.some(existingProduct => existingProduct.code === product.code)
        if (productExists) {
            return res.status(404).json({error: "Producto existente"})
        } else {
            const existingIds = new Set(products.map(product => product.id));
                        let newId = 1;
                        while (existingIds.has(newId)) {
                            newId++;
                        }
                        product.id = newId;
                        products.push(product);
                        createFile(JSON.stringify(products), FILE_NAME);
        }
    } catch (error) {
        res.status(500).json({ error: "Error al agregar el producto"})
    }
})

router.put("/:pid", async (req,res) => {
    const requiredFields = ['title', 'description', 'price', 'code', 'stock', 'status', 'category'];

   // Verificar que todos los campos requeridos estén presentes en req.body
    for (let field of requiredFields) {
        if (!req.body[field]) {
            return res.status(400).json({ error: `El campo ${field} es requerido` });
        }
    }
    try {
        let pid = req.params.pid
        const updatedProduct = req.body
        const products = await productManager.getProducts()
        const existingProductIndex = products.findIndex(product => product.id == pid)
        
        if (existingProductIndex !== -1) {
            // Actualizar el producto existente con las nuevas propiedades
            products[existingProductIndex] = { ...products[existingProductIndex], ...updatedProduct };
            await updateFile(JSON.stringify(products), FILE_NAME);
            return res.status(200).json({status: "Producto actualizado"})
        } else {
            return res.status(404).json({error: "Producto no encontrado"})
        }
    } catch (error) {
        res.status(500).json({ error: "Error al modificar el producto"})
    }
})

router.delete("/:pid", async (req,res) => {

    try {
        let pid = req.params.pid
        const products = await productManager.getProducts()
        const productIndex = products.findIndex(product => product.id == pid)

        if (productIndex !== -1) {
            products.splice(productIndex, 1);
            await updateFile(JSON.stringify(products), FILE_NAME)
            return res.status(200).json({status: "Producto eliminado"})
        } else {
            return res.status(404).json({error: "Producto no encontrado"})
        }
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto"})
    }
})

export default router