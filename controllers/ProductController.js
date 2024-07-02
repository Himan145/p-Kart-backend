const ProductModel = require("../models/ProductModel");
const fs=require('fs');
const slugify=require('slugify');
const CategoryModel=require("../models/CategoryModel");
const braintree=require('braintree');
const OrderModel = require("../models/OrderModel");
const dotenv=require('dotenv');
dotenv.config();

const CreateProductController=async(req,res)=>{
    try{
        const {name,description,price,category}=req.fields;
        const {photo}=req.files;
        if(!name || !description || !price || !category){
            return res.status(500).send({
                success:false,
                message:'Please fill all the fields',
            })
        }
        if(!photo || photo.size>1000000){
            return res.status(500).send({
                success:false,
                message:'Photo is required and below 16MB'
            })
        }
        const product=new ProductModel({...req.fields,slug:slugify(name)});

        if(photo){
            product.photo.data=fs.readFileSync(photo.path);
            product.photo.contentType=photo.type;
        }
        await product.save();
        res.status(201).send({
            success:true,
            message:'Product is Created',
            product
        })
    }
    catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            message:'Error in Creating Product',
            err
        });
    }
}

const UpdateProductController=async(req,res)=>{
    try{
        const {name,description,price,category}=req.fields;
        const {photo}=req.files;
        if(!name || !description || !price || !category){
            return res.status(500).send({
                success:false,
                message:'Please fill all the fields',
            })
        }
        if(!photo || photo.size>1000000){
            return res.status(500).send({
                success:false,
                message:'Photo is required and below 16MB'
            })
        }
        const product=await ProductModel.findByIdAndUpdate(req.params.id,{...req.fields,slug:slugify(name)},{new:true});

        if(photo){
            product.photo.data=fs.readFileSync(photo.path);
            product.photo.contentType=photo.type;
        }
        await product.save();
        res.status(201).send({
            success:true,
            message:'Product is Updated',
            product
        })
    }
    catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            message:'Error in Updating Product',
            err
        });
    }
}


const GetProductController=async(req,res)=>{
    try{
        const products=await ProductModel.find({}).populate('category').select("-photo").sort({createAt:-1});
        res.status(200).send({
            success:true,
            message:'All Products',
            products,
            total:products.length
        })
    }
    catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            message:'Error in Getting Product',
            err
        });
    }
}


const GetSingleProductController=async(req,res)=>{
    try{
        const {slug}=req.params;
        const product=await ProductModel.findOne({slug}).select("-photo").populate('category');
        res.status(200).send({
            success:true,      
            message:'Single Product',
            product
        })
    }
    catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            message:'Error in Getting this Product',
            err
        });
    }
}


const GetProductPhotoController=async(req,res)=>{
    try{
        const {id}=req.params;
        const product=await ProductModel.findById(id).select('photo');
        if(product.photo.data){
            res.set('Content-type',product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    }
    catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            message:'Error in Getting Product Photo',
            err
        });
    }
}

const DeleteProductController=async(req,res)=>{
    try{
        const {id}=req.params;
        await ProductModel.findByIdAndDelete(id).select('-photo');
        res.status(200).send({
            success:true,
            message:'Product Deleted'
        })
    }
    catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            message:'Error in deleting Product',
            err
        });
    }
}

//filter product

const ProductFilterController=async(req,res)=>{
    try{
        const {checked,radio}=req.body;
        let args={};
        if(checked.length>0)args.category=checked;
        if(radio.length)args.price={$gte:radio[0],$lte:radio[1]}
        const products=await ProductModel.find(args);
        res.status(200).send({
            success:true,
            products
        });
    }
    catch(err){
        console.log(err);
        res.status(400).send({
            success:false,
            message:'Error while filtering',
            err
        })
    }
}

const ProductCountController=async(req,res)=>{
    try{
        const total=await ProductModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success:true,
            total
        })
    }
    catch(err){
        console.log(err);
        res.status(400).send({
            success:false,
            message:'Error while counting product',
            err
        })
    }
}

const ProductListController=async(req,res)=>{
    try{
        const perPage=8
        const page=req.params.page?req.params.page:1;
        const products=await ProductModel.find({}).select('-photo').skip((page-1)*perPage).limit(perPage).sort({createdAt:-1});
        res.status(200).send({
            success:true,
            products
        })
    }
    catch(err){
        console.log(err);
        res.status(400).send({
            success:false, 
            message:'Error in per page ctrl',
            err
        })
    }
}

const SearchProductController=async(req,res)=>{
    try{
        const {keyword}=req.params
        const result=await ProductModel.find({
            $or:[
                {name:{$regex:keyword,$options:"i"}},
                {description:{$regex:keyword,$options:"i"}}
            ]
        }).select('-photo');
        res.json(result);
    }
    catch(err){
        console.log(err);
        res.status(400).send({
            success:false,
            message:'Error in Searching',
            err
        })
    }
}

const RelatedProductController=async(req,res)=>{
    try{
        const {pid,cid}=req.params;
        const products=await ProductModel.find({
            category:cid,
            _id:{$ne:pid}
        }).select('-photo').limit(3).populate("category")
        res.status(200).send({
            success:true,
            products
        })
    }
    catch(err){
        console.log(err);
        res.status(400).send({
            success:false,
            message:'Error while getting similar product',
            err
        })
    }
}

//category wise product
const ProductCategoryController=async(req,res)=>{
    try{
        const category=await CategoryModel.findOne({slug:req.params.slug});
        const products=await ProductModel.find({category}).populate('category')
        res.status(200).send({
            success:true,
            category,
            products
        })
    }
    catch(err){
        console.log(err);
        res.status(400).send({
            success:false,
            message:'Error while getting category wise product',
            err
        })
    }
}


//payment gateway
const pub="zs7g8rv2yzcf8y2b"
const pri="4538b21a0e109661a51afc8ca6fec15b"
const mid="c3qswwkhw45283kp"
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId:process.env.BRAINTREE_MERCHANT_ID,
    publicKey:process.env.BRAINTREE_PUBLIC_KEY,
    privateKey:process.env.BRAINTREE_PRIVATE_KEY
});

const BraintreeTokenController=async(req,res)=>{
    try{
        gateway.clientToken.generate({},function(err,response){
            if(err){
                res.status(500).send(err);
            }
            else{
                res.send(response);
            }
        })
    }
    catch(err){
        console.log(err);
    }
}

const BraintreePaymentController=async(req,res)=>{
    try{
        const {nonce,cartval,user}=req.body;
        let total=0;
        cartval.map(item =>{total+=item.price});
        let newTransaction=gateway.transaction.sale({
            amount:total,
            paymentMethodNonce:nonce,
            options:{
                submitForSettlement:true
            }
        },
        function(error,result){
            if(result){
                const order=new OrderModel({
                    products:cartval,
                    payment:result,
                    buyer:user?._id
                }).save()
                res.json({ok:true})
            }
            else{
                res.status(500).send(error);
            }
        })
    }
    catch(err){
        console.log(err);
    }
}
  

module.exports={CreateProductController,UpdateProductController,GetProductController,GetSingleProductController,GetProductPhotoController,DeleteProductController,ProductFilterController,ProductCountController,ProductListController,SearchProductController,RelatedProductController,ProductCategoryController,BraintreeTokenController,BraintreePaymentController}