import CartModel from './models/carts.model.js'

class CartDao{
    constructor(){
        this.model = CartModel
    }

    //GET
    async getCart(id){
        try{
            const cart = await this.model.findOne({ _id: id })
            
            if(!cart){
                return -2
            }

            return cart
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL OBTENER EL CARRITO")
        }
    }

    //PUT
    async updateCart(updatedCart){
        try{
            await this.model.updateOne({ _id: updatedCart._id } , updatedCart)
            return updatedCart
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL ACTUALIZAR EL CARRITO")
        }
    }

    async updateProductQuantity(cart){
        try{
            await this.model.updateOne({ _id: cart._id } , cart)
            return cart
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL ACTUALIZAR LA CANTIDAD DEL PRODUCTO")
        }
    }

    async updateCartAfterPurchase(id , newCart){
        try{
            return await this.model.updateOne({_id: id } , newCart)
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL PROCESAR LA COMPRA EN EL CARRITO")
        }
    }

    //POST
    async createCart(){
        try{
            const cart = await this.model.create({})
            return cart
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL CREAR EL CARRITO")
        }
    }

    async createProductCart(cart){
        try{
            await this.model.updateOne({ _id: cart._id } , cart)
            return cart
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL AGREGAR EL PRODUCTO AL CARRITO")
        }
    }

    //DELETE
    async deleteCart(id){
        try{
            return await this.model.deleteOne({ _id: id })
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL ELIMINAR EL CARRITO")
        }
    }

    async deleteProductCart(cart , updatedProducts){
        try{
            await this.model.updateOne({ _id: cart._id } , { $set: { products: updatedProducts } })
            return cart
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL ELIMINAR EL PRODUCTO DEL CARRITO")
        }
    }

    async deleteProductsCart(id){
        try{
            return await this.model.updateOne({ _id: id } , { $set: { products: [] } })
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL ELIMINAR LOS PRODUCTOS DEL CARRITO")
        }
    }
}

export default CartDao