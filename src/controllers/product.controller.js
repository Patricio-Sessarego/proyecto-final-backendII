import { ProductService } from '../services/index.js'

class ProductController{
    //GET
    async getProduct(req , res){
        const { pid } = req.params

        try{
            const response = await ProductService.getProduct(pid)

            if(response == -1){
                res.status(400).send({status: 'error' , message: 'ID INVALIDO'})
            }else if(response == -2){
                res.status(400).send({status: 'error' , message: 'NO EXISTE UN PRODUCTO CON ESE ID'})
            }else{
                res.status(200).send({status: 'success' , data: response })
            }
        }catch(error){
            console.error(error)
            res.status(500).send({status: 'error' , message: "ERROR AL OBTENER EL PRODUCTO"})
        }
    }

    async getProducts(req , res){
        const { limit = 9 , page = 1 , sort , category , available } = req.query

        try{
            const response = await ProductService.getProducts(limit , page , sort , category , available)

            if(response == -1){
                res.status(200).send({status: 'success' , message: 'NO HAY PRODUCTOS REGISTRADOS'})
            }else{
                res.status(200).send({status: 'success' , data: response})
            }


        }catch(error){
            console.error(error)
            res.status(500).send({status: 'error' , message: "ERROR AL OBTENER LOS PRODUCTOS"})
        }
    }

    //PUT
    async updateProduct(req , res){
        const { body } = req
        const { pid } = req.params

        try{
            const response = await ProductService.updateProduct(body , pid)

            if(response == -1){
                res.status(400).send({ status: 'error' , message: 'ID INVALIDO' })
            }else if(response == -2){
                res.status(400).send({ status: 'error' , message: 'NO EXISTE UN PRODUCTO CON ESE ID'})
            }else if(response == -3){
                res.status(400).send({status: 'error' , message: 'NO PUEDE ACTUALIZAR EL CODE DEL PRODUCTO'})
            }else{
                res.status(200).send({ status: 'success' , message: 'PRODUCTO ACTUALIZADO CORRECTAMENTE' , data: response})
            }
        }catch(error){
            console.error(error)
            res.status(500).send({status: 'error' , message: "ERROR AL ACTUALIZAR EL PRODUCTO"})
        }
    }

    //POST
    async createProduct(req , res){
        const { body } = req

        try{
            const response = await ProductService.createProduct(body)

            if(response == -1){
                res.status(400).send({ status: 'error' , message: 'LLENE TODOS LOS CAMPOS' })
            }else if(response == -2){
                res.status(400).send({ status: 'error' , message: 'YA EXISTE UN PRODUCTO CON ESE CODIGO' })
            }else{
                res.status(200).send({status: 'success' , message: 'PRODUCTO REGISTRADO CORRECTAMENTE' , data: response})
            }
        }catch(error){
            console.error(error)
            res.status(500).send({status: 'error' , message: "ERROR AL CREAR EL PRODUCTO"})
        }
    }

    //DELETE
    async deleteProduct(req , res){
        const { pid } = req.params

        try{
            const response = await ProductService.deleteProduct(pid)

            if(response == -1){
                res.status(400).send({ status: 'error' , message: 'ID INVALIDO' })
            }else if(response == -2){
                res.status(400).send({ status: 'error' , message: 'NO EXISTE UN PRODUCTO CON ESE ID'})
            }else{
                res.status(200).send({ status: 'success' , message: 'PRODUCTO ELIMINADO CORRECTAMENTE' , data: response})
            }
        }catch(error){
            console.error(error)
            res.status(500).send({status: 'error' , message: "ERROR AL ELIMINAR EL PRODUCTO"})
        }
    }
}

export default ProductController