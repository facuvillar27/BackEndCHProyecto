import fs from "fs"
const FILE_NAME = "./products.json"

async function createFile(text, filename) {
    try {
        await fs.writeFileSync(filename ?? FILE_NAME, text?? "[]")
    } catch (error) {
        console.log("Error al crear el archivo", error)
    }
}

async function readFile(filename) {
    try {
        const result = await fs.promises.readFile(FILE_NAME)
        const data = await JSON.parse(result.toString())
        return data
    } catch (error) {
        console.log(`Error al leer el archivo ${filename || FILE_NAME}`, error.message)
        return []
    }
}

async function updateFile(text, filename) {
    try {
        await fs.promises.writeFile(filename ?? FILE_NAME, text ?? "Hola mundo")
    } catch (error) {
        console.log("Error al modificar el archivo", error)
    }
}

async function deleteFile(filename) {
    try {
        await fs.promises.unlink(filename ?? FILE_NAME)
    } catch (error) {
        console.log("Error al eliminar el archivo", error)
    }
}

export { createFile, readFile, updateFile, deleteFile }
