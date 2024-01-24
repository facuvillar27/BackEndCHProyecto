import express from "express"
const router = express.Router()
import Carts from "../dao/dbManager/cart.js"
import Products from "../dao/dbManager/product.js"

const cartManager = new Carts()
const productManager = new Products()


router.get("/", async (req,res) => {
    try {
        const carts = await cartManager.getAll()
        const response = {
            message: "Lista de carritos",
            data: carts.length > 0 ? carts : "No hay carritos"
        }
        res.json({response})
    } catch (error) {
        res.status(500).json({ error: "Error al obtener carritos" })
    }
})

router.post("/", async (req,res) => {
    try {
        const response = await cartManager.saveCart({
            products: []
        })
        res.json({ message: "Carrito agregado correctamente", data: response })
        } catch (error) {
            res.status(500).json({ error: "Error al agregar el carrito" })
        }
})

router.get("/:cid", async (req,res) => {
    const cid = req.params.cid

    try {
        const cart = await cartManager.getById(cid)

        if(!cart) {
            return res.status(404).json({error: "Carrito no encontrado"})
        }

        await cart.populate("products.product")

        const response = {
            message: "Carrito encontrado",
            data: cart
        }
        res.json({response})
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el carrito" });
    }
    
})

router.post("/:cid", async (req,res) => {
    const cid = req.params.cid
    const products = req.body.products

    try {
        const result = await cartManager.updateCart(cid, { products: products })
        res.json({ message: "Carrito actualizado", data: result })
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el carrito" })
    }
})

router.post("/:cid/product/:pid", async (req,res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity || 1;
    try {
        const result = await cartManager.addProductToCart(cid, pid, quantity);
        res.json({ message: "Producto agregado al carrito", data: result });
    } catch (error) {
        res.status(500).json({ error: "Error al agregar el producto al carrito" });
    }
});

router.put("/:cid/product/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const result = await cartManager.addProductToCart(cid, pid, quantity);
        res.json({ message: "Producto agregado al carrito", data: result });
    } catch (error) {
        console.error(error); // Imprime el error completo
        res.status(500).json({ error: "Error al agregar el producto al carrito" });
    }
});

router.delete("/:cid/product/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    try {
        const result = await cartManager.deleteProductFromCart(cid, pid);
        res.json({ message: "Producto eliminado del carrito", data: result });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto del carrito" });
    }
});

router.delete("/:cid", async (req,res) => {
    const cid = req.params.cid

    try {
        const result = await cartManager.emptyCart(cid)
        res.json({ message: "Carrito vaciado", data: result })
    } catch (error) {
        res.status(500).json({ error: "Error al vaciar el carrito" })
    }
})
  

export default router