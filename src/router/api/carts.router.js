import CartController from '../../controllers/cart.controller.js'
import { Router } from 'express'

const router = Router()
const controller = new CartController

router.get('/:cid' , controller.getCart)
router.post('/' , controller.createCart)
router.put('/:cid' , controller.updateCart)
router.delete('/:cid' , controller.deleteProductsCart)
router.post('/:cid/products/:pid' , controller.createProductCart)
router.delete('/:cid/products/:pid' , controller.deleteProductCart)
router.put('/:cid/products/:pid' , controller.updateProductQuantity)

export default router