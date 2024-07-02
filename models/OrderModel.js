const mongoose=require('mongoose');

const OrderSchema=new mongoose.Schema({
    products:[
        {
            type:mongoose.ObjectId ,
            ref:"Products",
        },
    ],
    payment:{},
    buyer:{
        type:mongoose.ObjectId,
        ref:"users"
    },
    status:{
        type:String,
        default:'Payment Complete',
    }
},
{timestamps:true}
);

module.exports=mongoose.model("Order",OrderSchema);