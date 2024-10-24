import { Schema , model } from 'mongoose'
const collectionName = "tickets"

const ticketSchema = new Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    },
    purchase_datetime: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const TicketModel = model(collectionName , ticketSchema)

export default TicketModel