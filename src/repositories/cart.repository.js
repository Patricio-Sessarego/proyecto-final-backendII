import ProductRepository from './product.repository.js'
import CartDao from '../dao/cart.dao.js'
import mongoose from 'mongoose'

class CartRepository{
    constructor(){
        this.dao = new CartDao()
        this.productRepository = new ProductRepository()
    }

    //GET
    async getCart(id){
        try{
            if(!mongoose.Types.ObjectId.isValid(id)){
                return -1
            }

            const cart = await this.dao.getCart(id)

            if(cart == -2){
                return -2
            }

            return cart
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL OBTENER EL CARRITO")
        }
    }

    //PUT
    async updateCart(id , newProducts){
        try{
            if(!mongoose.Types.ObjectId.isValid(id)){
                return -1
            }

            const cart = await this.dao.getCart(id)

            if(cart == -2){
                return -2
            }

            let noProduct = false
            let dupProduct = false
            let missingData = false
            const seenProducts = new Set()
            for(const product of newProducts){
                let prod = await this.productRepository.getProduct(product._id.toString())
                if(prod == -1 || prod == -2){
                    noProduct = true
                }

                if(!product._id){
                    missingData = true
                }

                if(!product.quantity){
                    product.quantity = 1
                }

                if(seenProducts.has(product._id.toString())){
                    dupProduct = true
                }

                seenProducts.add(product._id.toString())
            }

            if(noProduct){
                return -3
            }else if(dupProduct){
                return -4
            }else if(missingData){
                return -5
            }

            await this.dao.deleteProductsCart(id)
            const updatedCart = await this.dao.getCart(id)

            newProducts.forEach((product) => {
                updatedCart.products.push({ product: product._id , quantity: product.quantity})
            })
            
            await this.dao.updateCart(updatedCart)
            return updatedCart
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL ACTUALIZAR EL CARRITO")
        }
    }

    async updateProductQuantity(cid , pid , quantity){
        try{
            if(!mongoose.Types.ObjectId.isValid(cid)){
                return -1
            }

            if(!mongoose.Types.ObjectId.isValid(pid)){
                return -2
            }

            const cart = await this.dao.getCart(cid)

            if(cart == -2){
                return -3
            }

            const product = await this.productRepository.getProduct(pid)

            if(product == -2){
                return -4
            }

            if(!quantity){
                return -5
            }

            let found = false
            for(let i = 0; i < cart.products.length; i++){
                if(cart.products[i].product._id.toString() == pid){
                    found = true
                    cart.products[i].quantity = quantity
                }
            }

            if(!found){
                return -6
            }

            await this.dao.updateProductQuantity(cart)
            return cart
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL ACTUALIZAR LA CANTIDAD DEL PRODUCTO")
        }
    }

    async updateCartAfterPurchase(id, newCart){
        try{
            if(!mongoose.Types.ObjectId.isValid(id)){
                return -1
            }

            const cart = await this.dao.getCart(id)

            if(cart == -2){
                return -2
            }

            await this.dao.deleteProductsCart(id)
            const updatedCart = await this.dao.getCart(id)

            newCart.forEach((product) => {
                updatedCart.products.push({ product: product.product , quantity: product.quantity})
            })

            await this.dao.updateCartAfterPurchase(id , updatedCart)
            return updatedCart
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL PROCESAR LA COMPRA EN EL CARRITO")
        }
    }

    //POST
    async createCart(){
        try{
            const cart = await this.dao.createCart()
            return cart
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL CREAR EL CARRITO")
        }
    }

    async createProductCart(cid , pid , quantity){
        try{
            if(!mongoose.Types.ObjectId.isValid(cid)){
                return -1
            }

            if(!mongoose.Types.ObjectId.isValid(pid)){
                return -2
            }

            const cart = await this.dao.getCart(cid)

            if(cart == -2){
                return -3
            }

            const product = await this.productRepository.getProduct(pid)

            if(product == -2){
                return -4
            }

            if(!quantity){
                quantity = 1
            }

            let isDup = false
            for(let i = 0; i < cart.products.length; i++){
                if(cart.products[i].product._id.toString() == pid){
                    isDup = true
                    cart.products[i].quantity++
                }
            }

            if(isDup){
                await this.dao.createProductCart(cart)
                return 'YA EXISTE EL PRODUCTO EN EL CARRITO, SE AGREGO 1 ITEM MAS DEL PRODUCTO'
            }else{
                cart.products.push({ product: product._id , quantity: quantity})
                await this.dao.createProductCart(cart)
                return product
            }
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL AGREGAR EL PRODUCTO AL CARRITO")
        }
    }

    //DELETE
    async deleteCart(id){
        try{
            if(!mongoose.Types.ObjectId.isValid(id)){
                return -1
            }

            const cart = await this.dao.getCart(id)

            if(cart == -2){
                return -2
            }

            await this.dao.deleteCart(id)
            return cart
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL ELIMINAR EL CARRITO")
        }
    }

    async deleteProductCart(cid , pid){
        try{
            if(!mongoose.Types.ObjectId.isValid(cid)){
                return -1
            }

            if(!mongoose.Types.ObjectId.isValid(pid)){
                return -2
            }

            const cart = await this.dao.getCart(cid)

            if(cart == -2){
                return -3
            }

            const product = await this.productRepository.getProduct(pid)

            if(product == -2){
                return -4
            }

            let found = false
            for(let i = 0; i < cart.products.length; i++){
                if(cart.products[i].product._id.toString() == pid){
                    found = true
                }
            }

            if(found){
                const updatedProducts = cart.products.filter(product => product.product._id.toString() !== pid)
                await this.dao.deleteProductCart(cart , updatedProducts)
                return product
            }else{
                return -5
            }
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL ELIMINAR EL PRODUCTO DEL CARRITO")
        }
    }

    async deleteProductsCart(id){
        try{
            if(!mongoose.Types.ObjectId.isValid(id)){
                return -1
            }

            const cart = await this.dao.getCart(id)

            if(cart == -2){
                return -2
            }

            await this.dao.deleteProductsCart(id)
            return cart
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL ELIMINAR LOS PRODUCTOS DEL CARRITO")
        }
    }
}

export default CartRepository