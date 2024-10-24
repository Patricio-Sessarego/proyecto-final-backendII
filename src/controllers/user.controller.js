import { UserService } from '../services/index.js'
import UserDTO from '../dto/user.dto.js'
import jwt from 'jsonwebtoken'

class UserController{
    //CURRENT
    async current(req , res){
        try{
            if(req.user){
                const user = req.user
                const userDto = new UserDTO(user)
                res.status(200).send({status: 'success' , message: 'COOKIE EXTRAIDA CORRECTAMENTE' , data: userDto})
            }else{
                res.status(401).send({status: 'error' , message: 'NO TENES AUTORIZACION PARA ACCEDER A ESTA PAGINA'})
            }
        }catch(error){
            console.error(error)
            res.status(500).send({status: 'error' , message: "ERROR AL EXTRAER LA COOKIE"})
        }
    }

    //LOGIN
    async login(req , res){
        res.render('login.handlebars' , {
            style: 'login.css',
            showHeader: false,
            title: 'Login'
        })
    }

    async postLogin(req , res){
        const { email , password } = req.body
        
        try{
            const user = await UserService.login(email , password)
        
            if(user == -1 || user == -2){
                res.status(400).json({ error: 400 })
            }else{ 
                //TOKEN
                const token = jwt.sign({ first_name: user.first_name , last_name: user.last_name , cartId: user.cart._id , email: user.email , role: user.role } , "coderhouse" , { expiresIn: "1h" })
    
                //COOKIE
                res.cookie("userToken" , token , {
                    maxAge: 3600000,
                    httpOnly: true
                })
    
                res.status(200).json({ message: 'LOGIN EXITOSO ' , role: user.role })
            }
        }catch(error){
            console.error(error)
        }
    }

    //LOGOUT
    async logout(req , res){
        res.clearCookie("userToken")
        res.redirect("/login")
    }

    //REGISTER
    async register(req , res){
        res.render('register.handlebars' , {
            style: 'register.css',
            showHeader: false,
            title: 'Register'
        })
    }

    async postRegister(req , res){
        const { first_name , last_name , password , email , age } = req.body

        try{
            const user = await UserService.register(first_name , last_name , password , email , age)
        
            if(user == -1 || user == -2){
                res.status(400).json({ error: 400 })
            }else{
                //TOKEN
                const token = jwt.sign({ first_name: user.first_name , last_name: user.last_name , cartId: user.cart._id , email: user.email , role: user.role } , "coderhouse" , { expiresIn: "1h" })
    
                //COOKIE
                res.cookie("userToken" , token , {
                    maxAge: 3600000,
                    httpOnly: true
                })
    
                res.status(200).json({ message: 'REGISTRO EXITOSO ' , role: user.role })
            }
        }catch(error){
            console.error(error)
        }
    }

    //GET
    async getUser(req , res){
        const { email } = req.params
        
        try{
            const response = await UserService.getUser(email)

            if(response == -1){
                res.status(400).send({status: 'error' , message: 'NO EXISTE UN USUARIO CON ESE EMAIL'})
            }else{
                res.status(200).send({status: 'success' , data: response})
            }
        }catch(error){
            console.error(error)
            res.status(500).send({status: 'error' , message: "ERROR AL OBTENER EL USUARIO"})
        }
    }
    
    async getUsers(req , res){
        try{
            const response = await UserService.getUsers()

            if(!response){
                res.status(200).send({status: 'success' , message: 'NO HAY USUARIOS CARGADOS'})
            }else{
                res.status(200).send({status: 'success' , data: response})
            }
        }catch(error){
            console.error(error)
            res.status(500).send({status: 'error' , message: "ERROR AL OBTENER LOS USUARIOS"})
        }
    }

    //PUT
    async updateUser(req , res){
        const { body } = req
        const { email } = req.params

        try{
            const response = await UserService.updateUser(email , body)

            if(response == -1){
                res.status(400).send({status: 'error' , message: 'NO EXISTE UN USUARIO CON ESE EMAIL'})
            }else if(response == -2){
                res.status(400).send({status: 'error' , message: 'NO PUEDE ACTUALIZAR EL ID DEL CARRITO'})
            }else if(response == -3){
                res.status(400).send({status: 'error' , message: 'YA EXISTE UN USUARIO CON EL EMAIL QUE DESEA ACTUALIZAR'})
            }else{
                res.status(200).send({status: 'success' , message: 'USUARIO ACTUALIZADO CORRECTAMENTE' , data: response})
            }
        }catch(error){
            console.error(error)
            res.status(500).send({status: 'error' , message: "ERROR AL ACTUALIZAR EL USUARIO"})
        }
    }

    //POST
    async createUser(req , res){
        const { body } = req

        try{
            const response = await UserService.createUser(body)

            if(response == -1){
                res.status(400).send({ status: 'error' , message: 'LLENE TODOS LOS CAMPOS' })
            }else if(response == -2){
                res.status(400).send({ status: 'error' , message: 'YA EXISTE UN USUARIO CON ESE EMAIL' })
            }else{
                res.status(200).send({ status: 'success' , message: 'USUARIO REGISTRADO CORRECTAMENTE' , data: response })
            }
        }catch(error){
            console.error(error)
            res.status(500).send({status: 'error' , message: "ERROR AL CREAR EL USUARIO"})
        }
    }

    //DELETE
    async deleteUser(req , res){
        const { email } = req.params

        try{
            const response = await UserService.deleteUser(email)

            if(response == -1){
                res.status(400).send({status: 'error' , message: 'NO EXISTE UN USUARIO CON ESE EMAIL'})
            }else{
                res.status(200).send({status: 'success' , message: 'USUARIO ELIMINADO CORRECTAMENTE' , data: response})
            }
        }catch(error){
            console.error(error)
            res.status(500).send({status: 'error' , message: "ERROR AL ELIMINAR EL USUARIO"})
        }
    }
}

export default UserController