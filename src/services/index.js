import ProductRepository from '../repositories/product.repository.js'
import UserRepository from '../repositories/user.repository.js'
import CartRepository from '../repositories/cart.repository.js'

export const ProductService = new ProductRepository()
export const UserService = new UserRepository()
export const CartService = new CartRepository()