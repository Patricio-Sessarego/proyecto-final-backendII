import TicketDao from '../dao/ticket.dao.js'

class TicketRepository{
    constructor(){
        this.dao = new TicketDao()
    }

    //POST
    async createTicket(ticket){
        try{
            const newTicket = await this.dao.createTicket(ticket)
            return newTicket
        }catch(error){
            console.error(error)
            throw new Error("ERROR AL CREAR EL TICKET DE COMPRA")
        }
    }
}

export default TicketRepository