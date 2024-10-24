import UserModel from './models/users.model.js'

class UserDao{
    constructor(){
        this.model = UserModel
    }

    //GET
    async getUser(email){
        try{
            const user = await this.model.findOne({ email })

            if(!user){
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
            const users = await this.model.find({})
            return users
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL OBTENER LOS USUARIOS")
        }
    }

    //PUT
    async updateUser(id , updatedUser){
        try{
            await this.model.updateOne({ _id: id } , updatedUser)
            return updatedUser
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL ACTUALIZAR EL USUARIO")
        }
    }

    //POST
    async createUser(newUser){
        try{
            await this.model.create(newUser)
            return newUser
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL CREAR EL USUARIO")
        }
    }

    //DELETE
    async deleteUser(email){
        try{
            return await this.model.deleteOne({ email })
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL ELIMINAR EL USUARIO")
        }
    }
}

export default UserDao