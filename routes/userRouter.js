const router = require('express').Router()
const userControl = require('../controllers/userControllers')
const auth = require('../middleware/auth')

router.post('/register', userControl.register)
router.post('/login', userControl.login)
router.get('/logout', userControl.logout)
router.get('/refresh_token', userControl.refreshToken)
router.get('/info', auth, userControl.getUser)
router.patch('/addcart', auth, userControl.addCart)
router.get('/history', auth, userControl.history)

module.exports = router;