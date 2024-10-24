import ProductDao from '../dao/product.dao.js'
import mongoose from 'mongoose'

class ProductRepository{
    constructor(){
        this.dao = new ProductDao()
    }

    //GET
    async getProduct(id){
        try{
            if(!mongoose.Types.ObjectId.isValid(id)){
                return -1
            }

            const product = await this.dao.getProduct(id)

            if(product == -2){
                return -2
            }

            return product
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL OBTENER EL PRODUCTO")
        }
    }

    async getProducts(limit , page , sort , category , available){
        try{
            const limitInt = isNaN(parseInt(limit)) ? 9 : parseInt(limit)
            const pageInt = isNaN(parseInt(page)) ? 1 : parseInt(page)

            let filter = {}
            if(category && typeof category === 'string'){
                filter.category = category
            }

            if(available){
                filter.stock = { $gt: 0 }
            }

            let sortObj = {}
            if(sort === 'asc'){
                sortObj = { price: 1 }
            }else if(sort === 'desc'){
                sortObj = { price: -1 }
            }

            const products = await this.dao.getProducts(filter , limitInt , (pageInt - 1) * limitInt , sortObj)
            const totalProducts = await this.dao.countProducts(filter)
            const totalPages = Math.ceil(totalProducts / limitInt)

            if(products == -1){
                return -1
            }

            const response = {
                payload: products,
                currentPage: pageInt,
                totalPages: totalPages,
                hasPrevPage: pageInt > 1,
                hasNextPage: pageInt < totalPages,
                prevPage: pageInt > 1 ? pageInt - 1 : null,
                nextPage: pageInt < totalPages ? pageInt + 1 : null,
                prevLink: pageInt > 1 ? `/api/products/?limit=${limitInt}&page=${pageInt - 1}${sort ? `&sort=${sort}` : ''}${category ? `&category=${category}` : ``}${available ? `&available=${available}` : ''}` : null,
                nextLink: pageInt < totalPages ? `/api/products/?limit=${limitInt}&page=${pageInt + 1}${sort ? `&sort=${sort}` : ''}${category ? `&category=${category}` : ``}${available ? `&available=${available}` : ''}` : null
            }

            return response
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL OBTENER LOS PRODUCTOS")
        }
    }

    async getAllProducts(){
        try{
            const products = await this.dao.getAllProducts()
            return products
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL OBTENER LOS PRODUCTOS")
        }
    }

    async getProductByCode(code){
        try{
            const product = await this.dao.getProductByCode(code)
            return product
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL OBTENER EL PRODUCTO")
        }
    }

    async countProducts(filter){
        try{
            const totalProducts = this.dao.countProducts(filter)
            return totalProducts
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL CONTRAR LOS PRODUCTOS")
        }
    }

    //PUT
    async updateProduct(updatedProduct , id){
        try{
            if(!mongoose.Types.ObjectId.isValid(id)){
                return -1
            }

            const productToUpdate = await this.dao.getProduct(id)

            if(productToUpdate == -2){
                return -2
            }

            if(updatedProduct.code && productToUpdate.code != updatedProduct.code){
                return -3
            }

            const response = await this.dao.updateProduct(updatedProduct , id)
            return response
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL ACTUALIZAR EL PRODUCTO")
        }
    }

    //POST
    async createProduct(newProduct){
        try{
            if(!newProduct.category || !newProduct.title || !newProduct.price || !newProduct.stock || !newProduct.code){
                return -1
            }

            const products = await this.dao.getProducts()
            const flag = products.some(product => product.code == newProduct.code)

            if(flag){
                return -2
            }else{
                return await this.dao.createProduct(newProduct)
            }
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL CREAR EL PRODUCTO")
        }
    }

    //DELETE
    async deleteProduct(id){
        try{
            if(!mongoose.Types.ObjectId.isValid(id)){
                return -1
            }

            const product = await this.dao.getProduct(id)

            if(product == -2){
                return -2
            }

            await this.dao.deleteProduct(id)
            return product
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL ELIMINAR EL PRODUCTO")
        }
    }
}

export default ProductRepository