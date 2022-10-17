const {Router} = require('express');
const authController = require('../controller/authController');
const router = Router();
const fileUpload = require('express-fileupload')

router.use(fileUpload({
    useTempFiles: true
}))

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/product/:id', authController.product_get_id);
router.get('/product/user/:id', authController.product_get_user);
router.get('/product', authController.product_get);
router.post('/product', authController.product_post);
router.put('/product/:id', authController.product_put);
router.delete('/product/:id', authController.product_delete);
router.get('/user', authController.user_get);
router.put('/user/:id', authController.user_put);
router.get('/category', authController.category);

module.exports = router; 