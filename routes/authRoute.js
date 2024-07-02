const express = require('express');
const {registerController,loginController,forgotController, GetAllOrderController, GetAllAdminOrderController, GetAllUsersController}=require('../controllers/authController.js');

const router=express.Router();

//REGISTER
router.post('/register',registerController);

//LOGIN
router.post('/login',loginController);

//forgot password
router.post('/forgot',forgotController);

//orders
router.get('/orders/:uid',GetAllOrderController);

router.get('/all-orders',GetAllAdminOrderController);

//all users
router.get('/all-users',GetAllUsersController);

module.exports=router;