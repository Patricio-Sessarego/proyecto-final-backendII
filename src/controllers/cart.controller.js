import { CartService } from '../services/index.js'

class CartController{
    //GET
    async getCart(req , res){
        const { cid } = req.params

        try{
            const response = await CartService.getCart(cid)

            if(response == -1){
                res.status(400).send({status: 'error' , message: 'ID INVALIDO'})
            }else if(response == -2){
                res.status(400).send({status: 'error' , message: 'NO EXISTE UN CARRITO CON ESE ID'})
            }else{
                res.status(200).send({status: 'success' , data: response })
            }
        }catch(error){
            console.error(error)
            res.status(500).send({status: 'error' , message: "ERROR AL OBTENER EL CARRITO"})
        }
    }

    //PUT
    async updateCart(req , res){
        const { body } = req
        const { cid } = req.params

        try{
            const response = await CartService.updateCart(cid , body)

            if(response == -1){
                res.status(400).send({status: 'error' , message: 'ID DE CARRITO INVALIDO'})
            }else if(response == -2){
                res.status(400).send({status: 'error' , message: 'NO EXISTE UN CARRITO CON ESE ID'})
            }else if(response == -3){
                res.status(400).send({status: 'error' , message: 'NO EXISTE UN PRODUCTO CON ESE ID'})
            }else if(response == -4){
                res.status(400).send({status: 'error' , message: 'UNO O MAS PRODUCTOS ESTAN REPETIDOS'})
            }else if(response == -5){
                res.status(400).send({status: 'error' , message: 'FALTAN LLENAR UNO O MAS CAMPOS DE LOS PRODUCTOS'})
            }else{
                res.status(200).send({status: 'success' , message: 'CARRITO ACTUALIZADO CORRECTAMENTE' , data: response})
            }
        }catch(error){
            console.error(error)
            res.status(500).send({status: 'error' , message: "ERROR AL ACTUALIZAR EL CARRITO"})
        }
    }

    async updateProductQuantity(req , res){
        const { body } = req
        const { cid , pid } = req.params

        try{
            const response = await CartService.updateProductQuantity(cid , pid , body.quantity)

            if(response == -1){
                res.status(400).send({status: 'error' , message: 'ID DE CARRITO INVALIDO'})
            }else if(response == -2){
                res.status(400).send({status: 'error' , message: 'ID DE PRODUCTO INVALIDO'})
            }else if(response == -3){
                res.status(400).send({status: 'error' , message: 'NO EXISTE UN CARRITO CON ESE ID'})
            }else if(response == -4){
                res.status(400).send({status: 'error' , message: 'NO EXISTE UN PRODUCTO CON ESE ID'})
            }else if(response == -5){
                res.status(400).send({status: 'error' , message: 'ENVIE EL VALOR DE CANTIDAD PARA ACTUALIZAR'})
            }else if(response == -6){
                res.status(400).send({status: 'error' , message: 'NO EXISTE UN PRODUCTO CON ESE ID EN EL CARRITO'})
            }else{
                res.status(200).send({status: 'success' , message: 'CANTIDAD DEL PRODUCTO ACTUALIZADA CORRECTAMENTE' , data: response})
            }
        }catch(error){
            console.error(error)
            res.status(500).send({status: 'error' , message: "ERROR AL ACTUALIZAR LA CANTIDAD DEL PRODUCTO"})
        }
    }

    //POST
    async createCart(req , res){
        try{
            const response = await CartService.createCart()
            res.status(200).send({status: 'success' , message: 'CARRITO CREADO CORRECTAMENTE' , data: response})
        }catch(error){
            console.error(error)
            res.status(500).send({status: 'error' , message: "ERROR AL CREAR EL CARRITO"})
        }
    }

    async createProductCart(req , res){
        const { body } = req
        const { cid , pid } = req.params

        try{
            const response = await CartService.createProductCart(cid , pid , body.quantity)

            if(response == -1){
                res.status(400).send({status: 'error' , message: 'ID DE CARRITO INVALIDO'})
            }else if(response == -2){
                res.status(400).send({status: 'error' , message: 'ID DE PRODUCTO INVALIDO'})
            }else if(response == -3){
                res.status(400).send({status: 'error' , message: 'NO EXISTE UN CARRITO CON ESE ID'})
            }else if(response == -4){
                res.status(400).send({status: 'error' , message: 'NO EXISTE UN PRODUCTO CON ESE ID'})
            }else{
                res.status(200).send({status: 'success' , message: 'PRODUCTO AGREGADO AL CARRITO CORRECTAMENTE' , data: response})
            }
        }catch(error){
            console.error(error)
            res.status(500).send({status: 'error' , message: "ERROR AL AGREGAR EL PRODUCTO AL CARRITO"})
        }
    }

    //DELETE
    async deleteProductCart(req , res){
        const { cid , pid } = req.params

        try{
            const response = await CartService.deleteProductCart(cid , pid)

            if(response == -1){
                res.status(400).send({status: 'error' , message: 'ID DE CARRITO INVALIDO'})
            }else if(response == -2){
                res.status(400).send({status: 'error' , message: 'ID DE PRODUCTO INVALIDO'})
            }else if(response == -3){
                res.status(400).send({status: 'error' , message: 'NO EXISTE UN CARRITO CON ESE ID'})
            }else if(response == -4){
                res.status(400).send({status: 'error' , message: 'NO EXISTE UN PRODUCTO CON ESE ID'})
            }else if(response == -5){
                res.status(400).send({status: 'error' , message: 'NO EXISTE UN PRODUCTO CON ESE ID EN EL CARRITO'})
            }else{
                res.status(200).send({status: 'success' , message: 'PRODUCTO ELIMINADO DEL CARRITO CORRECTAMENTE' , data: response})
            }
        }catch(error){
            console.error(error)
            res.status(500).send({status: 'error' , message: "ERROR AL ELIMINAR EL PRODUCTO DEL CARRITO"})
        }
    }

    async deleteProductsCart(req , res){
        const { cid } = req.params

        try{
            const response = await CartService.deleteProductsCart(cid)

            if(response == -1){
                res.status(400).send({status: 'error' , message: 'ID INVALIDO'})
            }else if(response == -2){
                res.status(400).send({status: 'error' , message: 'NO EXISTE UN CARRITO CON ESE ID'})
            }else{
                res.status(200).send({status: 'success' , message: 'CARRITO VACIADO CORRECTAMENTE' , data: response })
            }
        }catch(error){
            console.error(error)
            res.status(500).send({status: 'error' , message: "ERROR AL ELIMINAR LOS PRODUCTOS DEL CARRITO"})
        }
    }
}

export default CartController