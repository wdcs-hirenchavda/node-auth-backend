const {Router} = require('express');
const authController = require('../controller/authController');
const router = Router();

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/product', authController.product_get);
router.post('/product', authController.product_post);
router.put('/product/:id', authController.product_put);
router.delete('/product/:id', authController.product_delete);

module.exports = router;