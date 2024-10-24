import TicketModel from './models/tickets.model.js'

class TicketDao{
    constructor(){
        this.model = TicketModel
    }

    //POST
    async createTicket(ticket){
        try{
            return await this.model.create(ticket)
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL CREAR EL TICKET DE COMPRA")
        }
    }
}

export default TicketDao