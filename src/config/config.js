import program from '../utils/commander.js'
import dotenv from 'dotenv'

let { mode } = program.opts()

dotenv.config({
    path: mode == "PRODUCCION" ? "./.env.produccion" : "./.env.desarrollo"
})

const configObject = {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL
}

export default configObject