import ProductRepository from '../../repositories/product.repository.js'
import TicketRepository from '../../repositories/ticket.repository.js'
import CartRepository from '../../repositories/cart.repository.js'
import UserController from '../../controllers/user.controller.js'
import { admin , user } from '../../middleware/auth.js'
import nodemailer from 'nodemailer'
import { Router } from 'express'
import crypto from 'crypto'

const productRepository = new ProductRepository
const ticketRepository = new TicketRepository
const cartRepository = new CartRepository
const userController = new UserController
const router = Router()

//TRANSPORTER
const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,

    auth: {
        user: "remiiixxx123@gmail.com",
        pass: "zwlo lifw ynjx zpur"
    }
})

//LOGIN | LOGOUT | REGISTER
router.get('/login' , userController.login)
router.get('/logout' , userController.logout)
router.post('/login' , userController.postLogin)
router.get('/register' , userController.register)
router.post('/register' , userController.postRegister)

//HOME
router.get('/' , user , async (req , res , next) => {
    try{
        const page = parseInt(req.query.page) || 1
        const cartId = req.user.cartId
        const limit = 9
        
        const mongoProducts = await productRepository.getProducts(limit , page , {} , {} , {}) //COPIA DE 'mongoProducts'
        const products = mongoProducts.payload.map(product => ({ ...product._doc }))

        const totalProducts = await productRepository.countProducts({})
        const totalPages = Math.ceil(totalProducts / limit)

        let isProducts = products.length== 0 ? true : false
        products.forEach((product) => {
            product.price = ponerComas(product.price) //AGREGAMOS LAS COMAS
            product.stock = ponerComas(product.stock) //AGREGAMOS LAS COMAS

            product.price = product.price.toString().trim().toUpperCase()
            product.stock = product.stock.toString().trim().toUpperCase()
            product.category = product.category.trim().toUpperCase()
            product.title = product.title.trim().toUpperCase()
            product.code = product.code.trim().toUpperCase()
            product._id = product._id.toString()
        })

        const prevLink = page > 1 ? `/?page=${page - 1}` : null;
        const nextLink = page < totalPages ? `/?page=${page + 1}` : null;

        res.render('home.handlebars' , {
            hasNextPage: page < totalPages,
            user: req.user.first_name,
            totalPages: totalPages,
            isProducts: isProducts,
            hasPrevPage: page > 1,
            products: products,
            prevLink: prevLink,
            nextLink: nextLink,
            currentPage: page,
            style: 'home.css',
            showHeader: true,
            cart: cartId,
            title: 'Home'
        })
    }catch(error){
        console.error(error)
    }
})

//REAL TIME PRODUCTS
router.get('/realTimeProducts', admin, (req, res) => {
    res.render('realTimeProducts.handlebars', {
        style: 'realTimeProducts.css',
        user: req.user.first_name,
        title: 'Real Time',
        showHeader: true
    })
})

//CARTS | CART ID
router.get('/carts/:cid' , user , async (req , res , next) => {
    const { cid } = req.params

    try{
        let message
        const mongoCart = await cartRepository.getCart(cid)
        
        if(mongoCart == -1 || mongoCart == -2){
            message = "CARRITO NO ENCONTRADO"

            res.render('cart.handlebars' , {
                user: req.user.first_name,
                style: 'cart.css',
                showHeader: true,
                message: message,
                title: 'Cart',
                id: cid
            })
        }else{
            const cart = mongoCart.products.map(cart => ({ ...cart._doc })) //COPIA DE 'mongoCart'
            message = "CARRITO"
        
            let isProducts = cart.length== 0 ? true : false
            cart.forEach((productInCart) => {
        
                productInCart.product.price = ponerComas(productInCart.product.price.toString().trim().toUpperCase())
                productInCart.product.stock = ponerComas(productInCart.product.stock.toString().trim().toUpperCase())
                productInCart.quantity = ponerComas(productInCart.quantity.toString().trim().toUpperCase())
                productInCart.product.category = productInCart.product.category.trim().toUpperCase()
                productInCart.product.title = productInCart.product.title.trim().toUpperCase()
                productInCart.product.code = productInCart.product.code.trim().toUpperCase()
                productInCart.product._id = productInCart.product._id.toString()
            })
        
            const cartCopy = cart.map(prod => ({
                _id: prod.product._id.toString(),
                category: prod.product.category,
                title: prod.product.title,
                price: prod.product.price,
                stock: prod.product.stock,
                code: prod.product.code,
                quantity: prod.quantity,
            }))
        
            res.render('cart.handlebars' , {
                user: req.user.first_name,
                isProducts: isProducts,
                cartProducts: cartCopy,
                style: 'cart.css',
                showHeader: true,
                message: message,
                title: 'Cart',
                cart: cid
            })
        }
    }catch(error){
        console.error(error)
    }
})

//CART ID | PURCHASE
router.get('/:cid/purchase' , user , async (req , res , next) => {
    const { cid } = req.params

    try{
        const mongoCart = await cartRepository.getCart(cid)

        if(mongoCart == -1 || mongoCart == -2){
            res.redirect('/logout')
        }else{
            const cart = mongoCart.products.map(cart => ({ ...cart._doc })) //COPIA DE 'mongoCart'
            const afterPurchase = await processPurchase(cart)

            if(afterPurchase.purchaseCart.length == 0){ //NO HAY STOCK
                res.render('purchase.handlebars' , {
                    user: req.user.first_name,
                    style: 'purchase.css',
                    showHeader: true,
                    title: 'Purchase',
                    status: 'error',
                    cart: cid
                })
            }else{ //HAY STOCK
                let totalPurchase = 0
                const ticketCode = crypto.randomBytes(4).toString('hex')
                const newCart = await cartRepository.updateCartAfterPurchase(cid , afterPurchase.newCart)

                let productList = afterPurchase.purchaseCart.map(prod => {
                    totalPurchase += prod.quantity * prod.price
                    return `${prod.quantity} x ${prod.product}`
                }).join('<br>')

                const ticket = {
                    code: ticketCode,
                    amount: totalPurchase,
                    purchaser: req.user.email
                }

                await ticketRepository.createTicket(ticket)

                await transport.sendMail({ //CHAT GPT ME AYUDO UN POCO CON EL DISEÑO :)
                    from: "Compra Gamer <remiiixxx123@gmail.com>",
                    to: `${req.user.email}`,
                    subject: "¡TU COMPRA HA SIDO CONFIRMADA! 🎮",
        
                    html: `
                    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #1c1c1e; color: white; padding: 40px 0; text-align: center;">
            
                        <!-- HEADER -->
                        <div style="max-width: 600px; margin: 0 auto; background-color: #2d2d2f; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">
                            <div style="padding: 20px; background-color: #ff9800; border-radius: 10px 10px 0 0;">
                                <h1 style="color: white; font-size: 26px; margin: 0;">¡Gracias por tu compra, ${req.user.first_name}!</h1>
                                <p style="font-size: 14px; margin: 5px 0;">Tu pedido ha sido confirmado con éxito.</p>
                            </div>
                
                            <!-- DETALLES DE LA COMPRA -->
                            <div style="padding: 20px; text-align: left; background-color: #2d2d2f;">
                                <h2 style="color: #f1c40f; font-size: 20px;">Detalles del pedido</h2>
                                
                                <p style="font-size: 16px; color: #cccccc;">Aquí está un resumen de los productos que adquiriste:</p>
                
                                <ul style="list-style-type: none; padding: 0; margin: 0;">
                                    ${productList.split(',').map(product => `
                                        <li style="background-color: #3c3c3e; padding: 10px; border-radius: 6px; margin-top: 10px; font-size: 16px;">
                                            <span style="color: white;">${product}</span>
                                        </li>
                                    `).join('')}
                                </ul>
                
                                <div style="margin-top: 20px; padding-top: 10px; border-top: 1px solid #555;">
                                    <p style="color: #f1c40f; font-size: 18px;">Total de la compra: <span style="color: white; font-weight: bold;">${ponerComas(totalPurchase)}$</span></p>
                                </div>
                
                                <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #555;">
                                    <p style="color: #f1c40f; font-size: 18px;">Número de orden: <span style="color: white;">${ticketCode}</span></p>
                                </div>
                            </div>
                
                            <!-- LINK A LA PAGINA -->
                            <div style="padding: 20px; text-align: center; background-color: #2d2d2f; border-radius: 0 0 10px 10px;">
                                <a href="http://localhost:8080/login" 
                                style="background-color: #ff9800; color: white; padding: 15px 30px; text-decoration: none; font-size: 18px; font-weight: bold; border-radius: 6px; display: inline-block;">
                                Visita nuestro sitio web
                                </a>
                            </div>
                        </div>
                
                        <!-- FOOTER -->
                        <div style="margin-top: 30px; text-align: center;">
                            <p style="color: #999999; font-size: 14px;">Compra Gamer - Todos los derechos reservados © 2024</p>
                            <p style="color: #666666; font-size: 12px;">¿Necesitas ayuda? <a href="mailto:soporte@compragamer.com" style="color: #ff9800;">Contáctanos</a></p>
                        </div>
                    </div>
            
                    <!-- MEDIA QUERIES -->
                    <style>
                        @media only screen and (max-width: 600px) {
                            h1 {
                                font-size: 22px;
                            }
                            h2 {
                                font-size: 18px;
                            }
                            a {
                                padding: 10px 20px;
                                font-size: 16px;
                            }
                        }
                    </style>
                    `
                })

                res.render('purchase.handlebars' , {
                    user: req.user.first_name,
                    email: req.user.email,
                    style: 'purchase.css',
                    showHeader: true,
                    title: 'Purchase',
                    status: 'success',
                    cart: cid
                })
            }
        }
    }catch(error){
        console.error(error)
    }
})

//FUNCIONES
function ponerComas(value){
    let float = parseFloat(value)
    let parseado = float.toLocaleString('en-US', { maximumFractionDigits: 0 })

    return parseado
}

async function processPurchase(cart){
    const purchaseCart = []
    const newCart = []

    for(const productInCart of cart){
        const product = await productRepository.getProduct(productInCart.product._id.toString())

        if(productInCart.quantity > product.stock){
            newCart.push({ product: product._id , quantity: productInCart.quantity })
        }else{
            purchaseCart.push({ product: product.title , quantity: productInCart.quantity , price: product.price })
            
            product.stock -= productInCart.quantity
            await productRepository.updateProduct(product , product._id)
        }
    }

    return { purchaseCart , newCart }
}

export default router