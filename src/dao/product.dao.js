import ProductModel from './models/products.model.js'

class ProductDao{
    constructor(){
        this.model = ProductModel
    }

    //GET
    async getProduct(id){
        try{
            const product = await this.model.findOne({ _id: id })
            
            if(!product){
                return -2
            }

            return product
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL OBTENER EL PRODUCTO")
        }
    }

    async getProducts(filter , limit , skip , sort){
        try{
            const products = await this.model.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)

            if(!products){
                return -1
            }

            return products
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL OBTENER LOS PRODUCTOS")
        }
    }

    async getAllProducts(){
        try{
            return await this.model.find({})
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL OBTENER LOS PRODUCTOS")
        }
    }

    async getProductByCode(code){
        try{
            return await this.model.findOne({ code: code })
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL OBTENER EL PRODUCTO")
        }
    }

    async countProducts(filter){
        try{
            return await this.model.countDocuments(filter)
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL CONTRAR LOS PRODUCTOS")
        }
    }

    //PUT
    async updateProduct(updatedProduct , id){
        try{
            await this.model.updateOne({ _id: id } , updatedProduct)
            return updatedProduct
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL ACTUALIZAR EL PRODUCTO")
        }
    }

    //POST
    async createProduct(newProduct){
        try{
            return await this.model.create(newProduct)
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL CREAR EL PRODUCTO")
        }
    }

    //DELETE
    async deleteProduct(id){
        try{
            return await this.model.deleteOne({ _id: id })
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL ELIMINAR EL PRODUCTO")
        }
    }
}

export default ProductDao