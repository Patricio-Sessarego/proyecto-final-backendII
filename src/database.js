import configObject from './config/config.js'
import mongoose from 'mongoose'

const { MONGO_URL} = configObject

mongoose.connect(MONGO_URL)
    .then(() => console.log("BASE DE DATOS CONECTADA"))
    .catch((error) => console.error(error))