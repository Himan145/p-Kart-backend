const userModel=require('../models/userModel.js');
const {hashPassword,comparePassword}=require('../helpers/authHelper.js');
const jwt=require('jsonwebtoken');
const OrderModel = require('../models/OrderModel.js');

const registerController=async(req,res)=>{
    try{
        const {name,email,password,phone,address}=req.body;
        //validation
        if(!name || !email || !password || !phone ||!address){
            return res.send({error:'please fill all the field'});
        }
        //exist or not
        const user=await userModel.findOne({email});
        if(user){
            return res.status(200).send({
                success:true,
                message:'Account already exist'
            })
        }
        //register user
        const hashedPassword=await hashPassword(password);
        //save
        const newUser=await new userModel({name,email,phone,address,password:hashedPassword}).save()
        res.status(201).send({
            success:true,
            message:'User Register Successfully',
            newUser
        })
    }
    catch(err){
        console.log(err);
    }
}


const loginController=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(404).send({
                success:false,
                message:'Please fill all the field'
            })
        }
        const user=await userModel.findOne({email});
        if(!user){
            return res.status(200).send({
                success:false,
                message:'Account does not exist'
            })
        }
        const match=await comparePassword(password,user.password);
        if(!match){
            return res.status(200).send({
                success:false,
                message:'Invalid password'
            })
        }
        //Token
        const token=await jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})
        res.status(200).send({
            success:true,
            message:'Login Successfully',
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address
            },
            token
        })
    }
    catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            message:'Error in login',
            err
        })
    }
}


const forgotController=async(req,res)=>{
    try{
        const {email,newPassword}=req.body;
        if(!email || !newPassword){
            res.status(400).send({message:'Please fill all the field'});
        }
        const user=await userModel.findOne({email});
        if(!user){
            return res.status(200).send({
                success:false,
                message:'Invalid email'
            });
        }
        const hashed=await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id,{password:hashed});
        res.status(200).send({
            success:true,
            message:"password reset successfully"
        });
    }
    catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            message:'Error in login',
            err
        })
    }
}

//get all orders of users
const GetAllOrderController=async(req,res)=>{
    try{
        const {uid}=req.params;
        const orders=await OrderModel.find({buyer:uid}).populate("products","-photo").populate("buyer","name");
        res.json(orders);
    }
    catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            message:'Error while getting orders',
            err
        })
    }
}

//get all orders of admin
const GetAllAdminOrderController=async(req,res)=>{
    try{
        const orders=await OrderModel.find({}).populate("products","-photo").populate("buyer","name");
        res.json(orders);
    }
    catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            message:'Error while getting orders',
            err
        })
    }
}

//get all users
const GetAllUsersController=async(req,res)=>{
    try{
        const users=await userModel.find({});
        res.json(users);
    }
    catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            message:'Error while getting all users',
            err
        })
    }
}

module.exports={registerController,loginController,forgotController,GetAllOrderController,GetAllAdminOrderController,GetAllUsersController};