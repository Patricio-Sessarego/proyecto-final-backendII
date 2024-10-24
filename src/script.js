import ProductRepository from './repositories/product.repository.js'
import CartRepository from './repositories/cart.repository.js'
import initializePassport from './config/passport.config.js'
import handlebars from 'express-handlebars'
import routerApp from './router/index.js'
import configObject from './config/config.js'
import cookieParser from 'cookie-parser'
import { fileURLToPath } from 'url'
import { Server } from 'socket.io'
import passport from 'passport'
import express from 'express'
import path from 'path'
import './database.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const productRepository = new ProductRepository
const cartRepository = new CartRepository

const { PORT } = configObject
const app = express()

//MIDDLEWARE
initializePassport()
app.use(cookieParser())
app.use(express.json())
app.use(passport.initialize())
app.use(express.urlencoded({ extended: true }))
app.use('/static' , express.static(__dirname + '/public'))

//HANDLEBARS HELPERS
const hbs = handlebars.create({
    helpers: { //LOS USO EN 'home.handlebars'
        range: function(start, end, options) {
            let ret = [];
            for (let i = start; i <= end; i++) {
                ret.push(i);
            }
            return ret;
        },
        not: function(value) {
            return !value;
        },
        eq: function (a, b) {
            return a === b;
        }
    }
})

//HANDLEBARS CONFIG
app.engine('handlebars' , hbs.engine)
app.set('views' , __dirname + '/views')
app.set('view engine' , 'handlebars')

//RUTAS
app.use(routerApp)

//ERROR
app.use((error , req , res , next) => {
    console.error(error)
    res.status(500).send('ERROR DE SERVER')
})

//SERVER
const httpServer = app.listen(PORT , () => {
    console.log(`ESCUCHANDO EN EL PUERTO ${PORT}`)
})

//SOCKETS
const io = new Server(httpServer)

io.on('connection' , async (socket) => {

    //REAL TIME PRODUCTS
    socket.on('getProducts' , async (page) => {
        const limit = 9

        const productsMongo = await productRepository.getProducts(limit , page , {} , {} , {})
        const totalProducts = await productRepository.countProducts({})
        const totalPages = Math.ceil(totalProducts / limit)
        const products = productsMongo.payload

        socket.emit('initialProducts' , {
            products,
            totalPages,
            currentPage: page
        })
    })

    socket.on('newProduct' , async (product) => {
        let page = product.newPage
        const limit = 9

        const allProducts = await productRepository.getAllProducts()
        let flag = false

        for(let i = 0; i < allProducts.length; i++){
            let prod = allProducts[i]
            if(prod.code.toUpperCase() == product.newProduct.code.toUpperCase()){
                flag = true
                break
            }
        }

        if(!flag){
            product = await productRepository.createProduct(product.newProduct)

            const productsMongo = await productRepository.getProducts(limit , page , {} , {} , {})
            const totalProducts = await productRepository.countProducts({})
            const totalPages = Math.ceil(totalProducts / limit)
            const updatedProducts = productsMongo.payload

            io.emit('productAdded' , {
                page,
                totalPages,
                updatedProducts
            })
        }else{
            const productToUpdate = await productRepository.getProductByCode(product.newProduct.code)
            product = await productRepository.updateProduct(product.newProduct , productToUpdate._id)

            const productsMongo = await productRepository.getProducts(limit , page , {} , {} , {})
            const totalProducts = await productRepository.countProducts({})
            const totalPages = Math.ceil(totalProducts / limit)
            const updatedProducts = productsMongo.payload

            io.emit('dupCode' , {
                page,
                totalPages,
                updatedProducts
            })
        }
    })

    socket.on('deletedProduct' , async ({ productId , currentPage }) => {
        let page = currentPage
        const limit = 9

        await productRepository.deleteProduct(productId)

        const productsMongo = await productRepository.getProducts(limit , page , {} , {} , {})
        const totalProducts = await productRepository.countProducts({})
        const totalPages = Math.ceil(totalProducts / limit)
        const updatedProducts = productsMongo.payload

        io.emit('productDeleted' , {
            page,
            totalPages,
            updatedProducts
        })
    })

    //HOME
    socket.on('productAddedToCart' , async (productId , cartId) => {
        await cartRepository.createProductCart(cartId , productId , 1)
    })

    //CART
    let cartId
    let cart
    socket.on('getCartId' , async (id) => {
        cartId = id
        cart = await cartRepository.getCart(cartId.toString())
        socket.emit('initialCart' , cart)
    })

    socket.on('productDeletedFromCart' , async (productId) => {
        await cartRepository.deleteProductCart(cartId , productId)
        cart = await cartRepository.getCart(cartId)
        io.emit('updatingCart' , cart)
    })
})