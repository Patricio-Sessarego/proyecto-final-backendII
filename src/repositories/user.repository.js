import { createHash , isValidPassword } from '../utils/utils.js'
import CartRepository from './cart.repository.js'
import UserDao from '../dao/user.dao.js'


class UserRepository{
    constructor(){
        this.dao = new UserDao()
        this.cart = new CartRepository()
    }

    //LOGIN
    async login(email , password){
        try{
            const user = await this.dao.getUser(email)

            if(user == -1){
                return -1
            }

            if(!isValidPassword(password , user)){
                return -2
            }

            return user
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL INTENTAR INICIAR SESION")
        }
    }

    //REGISTER
    async register(first_name , last_name , password , email , age){
        try{
            const user = {
                first_name: first_name,
                last_name: last_name,
                password: password,
                email: email,
                age: age
            }

            const newUser = await this.createUser(user)

            if(newUser == -1){
                return -1
            }

            if(newUser == -2){
                return -2
            }

            return newUser
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL INTERAR REGISTRAR EL USUARIO")
        }
    }

    //GET
    async getUser(email){
        try{
            const user = this.dao.getUser(email)

            if(user == -1){
                return -1
            }

            return user
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL OBTENER EL USUARIO")
        }
    }

    async getUsers(){
        try{
            const users = this.dao.getUsers()
            return users
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL OBTENER LOS USUARIOS")
        }
    }

    //PUT
    async updateUser(email , updatedUser){
        try{
            const userToUpdate = await this.dao.getUser(email)

            if(userToUpdate == -1){
                return -1
            }
    
            if(updatedUser.cart != userToUpdate.cart && updatedUser.cart){
                return -2
            }
    
            if(updatedUser.email){
                const users = await this.dao.getUsers()
                const flag = users.some(user => user.email == updatedUser.email)
    
                if(flag){
                    return -3
                }
            }
    
            if(updatedUser.password){
                updatedUser.password = createHash(updatedUser.password)
            }
            
            return await this.dao.updateUser(userToUpdate._id , updatedUser)
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL ACTUALIZAR EL USUARIO")
        }
    }

    //POST
    async createUser(newUser){
        try{
            if(!newUser.first_name || !newUser.last_name || !newUser.password || !newUser.email || !newUser.age){
                return -1
            }

            const users = await this.getUsers()
            const flag = users.some(user => user.email == newUser.email)
    
            if(flag){
                return -2
            }

            newUser.password = createHash(newUser.password)
            const cart = await this.cart.createCart()

            newUser = {
                ...newUser,
                role: "user",
                cart: cart._id
            }

            return await this.dao.createUser(newUser)
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL CREAR EL USUARIO")
        }
    }

    //DELETE
    async deleteUser(email){
        try{
            const user = await this.dao.getUser(email)

            if(user == -1){
                return -1
            }

            await this.dao.deleteUser(email)
            await this.cart.deleteCart(user.cart._id)

            return user
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL ELIMINAR EL USUARIO")
        }
    }
}

export default UserRepository