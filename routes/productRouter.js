const router = require('express').Router()
const productControl = require('../controllers/productControllers')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.route('/products')
    .get(productControl.getProducts)
    .post(auth, authAdmin, productControl.createProduct)

router.route('/products/:id')
    .delete(auth, authAdmin, productControl.deleteProduct)
    .put(auth, authAdmin, productControl.updateProduct)

module.exports = router