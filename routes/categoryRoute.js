const express = require('express');
const {CreateCategoryController,UpdateCategoryController,GetCategoryController,SingleGetCategoryController, DeleteCategoryController}=require('../controllers/CategoryController.js');

const router=express.Router();

router.post('/create-category',CreateCategoryController);

router.put('/update-category/:id',UpdateCategoryController);

router.get('/get-category',GetCategoryController);

router.get('/get-single-category/:slug',SingleGetCategoryController);

router.delete('/delete-category/:id',DeleteCategoryController)

module.exports =router;