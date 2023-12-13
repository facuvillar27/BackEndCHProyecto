import express from "express"
import path from 'path'
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"

const app = express()
const PORT = 8080

app.use(express.urlencoded({extended:true}))
app.use(express.json())

// app.use(express.static(path.join(__dirname, "public")))

app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)

app.listen(PORT, () => {
    console.log(`¡Servidor escuchando en el puerto ${PORT}!`)
})