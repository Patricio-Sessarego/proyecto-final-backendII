import UserController from '../../controllers/user.controller.js'
import { current } from '../../middleware/auth.js'
import { Router } from 'express'

const router = Router()
const controller = new UserController()

//CURRENT
router.get('/current' , current , controller.current)


router.get('/' , controller.getUsers)
router.post('/' , controller.createUser)
router.get('/:email' , controller.getUser)
router.put('/:email' , controller.updateUser)
router.delete('/:email' , controller.deleteUser)

export default router