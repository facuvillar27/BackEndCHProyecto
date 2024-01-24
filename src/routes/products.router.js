import express from "express"
import Products from "../dao/dbManager/product.js"
import productModel from "../dao/models/products.model.js"
import dotenv from "dotenv"
const router = express.Router()

dotenv.config()
const PORT = process.env.PORT
const productManager = new Products()

router.get("/", async (req, res) => {
    try {
        const result = await productManager.getFilteredProducts(req);
        const response = productManager.prepareResponse(req, result);

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', error: "Error al obtener productos" });
    }
});

router.get("/:pid", async (req, res) => {
    const pid = req.params.pid

    try {
        const product = await productManager.getById(pid)

        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" })
        }

        const response = {
            message: "Producto encontrado",
            data: product
        }
        res.json(response)
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el producto" })
    }
})

router.post("/", async (req, res) => {
    const requiredFields = ['title', 'description', 'price', 'code', 'stock', 'status', 'category'];
    for (let field of requiredFields) {
        if (!req.body[field]) {
            return res.status(400).json({ error: `El campo ${field} es requerido` });
        }
    }
    const productExists = await productManager.getByCode(req.body.code)
    if (productExists) {
        return res.status(404).json({ error: "Producto existente" })
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
        alert("Producto agregado")
        res.json({ message: "Producto agregado", data: response })
    } catch (error) {
        res.status(500).json({ error: "Error al agregar el producto" })
    }
})

router.put("/:pid", async (req, res) => {
    const pid = req.params.pid
    const requiredFields = ['title', 'description', 'price', 'code', 'stock', 'status', 'category'];

    // Verificar que todos los campos requeridos estén presentes en req.body
    for (let field of requiredFields) {
        if (!req.body[field]) {
            return res.status(400).json({ error: `El campo ${field} es requerido` });
        }
    }

    const product = req.body
    try {
        const response = await productManager.updateProduct(pid, product)
        res.json({ message: "Producto actualizado", data: response })
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el producto" })
    }
})

router.delete("/:pid", async (req, res) => {
    const pid = req.params.pid

    try {
        const response = await productManager.deleteProduct(pid)
        res.json({ message: "Producto eliminado", data: response })
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto" })
    }
})

export default router