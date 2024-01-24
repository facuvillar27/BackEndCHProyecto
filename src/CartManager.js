import fs from "fs"
import { readFile } from "./helper.js"

const FILE_NAME = "./carts.json"

export default class CartManager {
    constructor() {
        this.carts = readFile(FILE_NAME)
    }

    async getCarts(cart) {
        try {
            if (fs.existsSync(FILE_NAME)) {
                this.carts = JSON.parse(await fs.promises.readFile(FILE_NAME, 'utf8'));
                return this.carts;
            }
            else {
                this.carts = [];
                return this.carts;
            }
        } catch (error) {
            console.log(`Error al obtener los carritos: ${error.message}`)
        }
     }
     
}

export { CartManager }