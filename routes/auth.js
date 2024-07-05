const express= require('express');
const authControl = require('../controllers/authController');
//const isAuth = require('../middlewares/isAuth');
const schema = require('../middlewares/validate/schemas');
const validateRequest= require('../middlewares/validate/validate');

const router = express.Router();

router
    .route('/register')
    .post(
        validateRequest(schema.register),
        authControl.register);

router
    .route('/login')
    .post(authControl.login);


module.exports = router;