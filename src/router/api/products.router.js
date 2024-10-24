import ProductController from '../../controllers/product.controller.js'
import { Router } from 'express'

const router = Router()
const controller = new ProductController

router.get('/' , controller.getProducts)
router.get('/:pid' , controller.getProduct)
router.post('/' , controller.createProduct)
router.put('/:pid' , controller.updateProduct)
router.delete('/:pid' , controller.deleteProduct)

export default router