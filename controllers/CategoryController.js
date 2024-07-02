const CategoryModel = require("../models/CategoryModel");
const slugify=require('slugify');

const CreateCategoryController=async(req,res)=>{
    try{
        const {name}=req.body;
        if(!name){
            return res.status(401).send({message:'Name is required'})
        }
        const existingCategory=await CategoryModel.findOne({name});
        if(existingCategory){
            return res.status(200).send({
                success:true,
                message:'Category alreay exist'
            })
        }
        const category=await new CategoryModel({name,slug:slugify(name)}).save();
        res.status(201).send({
            success:true,
            message:'new category created',
            category
        });
    }
    catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            err,
            message:'Error in Create Category'
        });
    }
}

const UpdateCategoryController=async(req,res)=>{
    try{
        const {name}=req.body;
        const {id}=req.params;
        const category=await CategoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true});
        res.status(200).send({
            success:true,
            message:'category updated successfully',
            category
        })
    }
    catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            err,
            message:'Error in Update Category'
        })
    }
}

const GetCategoryController=async(req,res)=>{
    try{
        const category=await CategoryModel.find({});
        res.status(200).send({
            success:true,
            message:'All categories',
            category
        })
    }
    catch(err){
        console.log(err);
        res.status(500).send({
            success:true,
            err,
            message:'Error while getiing category'
        })
    }
}

const SingleGetCategoryController=async(req,res)=>{
    try{
        const {slug}=req.params;
        const category=await CategoryModel.findOne({slug});
        res.status(200).send({
            success:true,
            message:'Single categories',
            category
        })

    }
    catch(err){
        console.log(err);
        res.status(500).send({
            success:true,
            err,
            message:'Error while getiing single category'
        })
    }
}

const DeleteCategoryController=async(req,res)=>{
    try{
        const {id}=req.params;
        await CategoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success:true,
            message:'Delete categories'
        })
    }
    catch(err){
        console.log(err);
        res.status(500).send({
            success:true,
            err,
            message:'Error while deleting category'
        })
    }
}

module.exports={CreateCategoryController,UpdateCategoryController,GetCategoryController,SingleGetCategoryController,DeleteCategoryController};