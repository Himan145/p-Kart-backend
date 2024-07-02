const express = require('express');
const { CreateProductController, GetProductController, GetSingleProductController, GetProductPhotoController, DeleteProductController, UpdateProductController, ProductFilterController, ProductCountController, ProductListController, SearchProductController, RelatedProductController, ProductCategoryController, BraintreeTokenController, BraintreePaymentController } = require('../controllers/ProductController');
const formidable=require('express-formidable');

const router=express.Router();

router.post('/create-product',formidable(),CreateProductController);

router.get('/get-product',GetProductController);

router.get('/get-single-product/:slug',GetSingleProductController);

//photo
router.get('/get-photo/:id',GetProductPhotoController);

router.delete('/delete-product/:id',DeleteProductController);

router.post('/update-product/:id',formidable(),UpdateProductController);

//filter-product
router.post('/product-filter',ProductFilterController);

//product count
router.get('/product-count',ProductCountController);

//product per page
router.get('/product-list/:page',ProductListController);

//search product
router.get('/search/:keyword',SearchProductController);

//similar product
router.get('/related-product/:pid/:cid',RelatedProductController);

//category wise
router.get('/product-category/:slug',ProductCategoryController);

//payment
//token
router.get('/braintree/token',BraintreeTokenController);
router.post('/braintree/payment',BraintreePaymentController);


module.exports=router;