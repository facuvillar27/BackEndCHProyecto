import express from "express"
import dotenv from "dotenv"
import path from 'path'
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import viewsRouter from "./routes/views.route.js"
// import cartsRouter from "./routes/carts.router.js"
import { __dirname } from "./utils.js"
import handlebars from "express-handlebars"
import mongoose from "mongoose"

dotenv.config()
const app = express()
const PORT = process.env.PORT || 8080
const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/products"

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static(path.join(__dirname, "/public")))


app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")

// app.use(express.static(path.join(__dirname, "public")))

app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/", viewsRouter);

app.listen(PORT, () => {
    console.log(`¡Servidor escuchando en el puerto ${PORT}!`)
})

const environment = async () => {
    try {
        await mongoose.connect(DB_URL)
        console.log("Base de datos conectada")
    } catch (error) {
        console.log(error)
    }
}

mongoose
    .connect(DB_URL)
    .then(() => console.log("Base de datos conectada " + DB_URL))
    .catch((error) => console.log("Error al conectar a la base de datos"))

environment()