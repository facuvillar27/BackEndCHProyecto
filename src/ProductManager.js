import fs from "fs"
import { readFile } from "./helper.js"

const FILE_NAME = "./products.json"

export default class ProductManager {
    constructor() {
        this.products = readFile(FILE_NAME)
    }

    async getProducts(product) {
        try {
            if (fs.existsSync(FILE_NAME)) {
                this.products = await readFile(FILE_NAME)
                return this.products
            }
            else {
                this.products = []
                return this.products
            }
        } catch (error) {
            console.log(`Error al obtener los productos: ${error.message}`)
        }
    }
}

export { ProductManager }