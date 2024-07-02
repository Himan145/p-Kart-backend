const mongoose=require('mongoose');

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log('connect to database');
    }
    catch(err){
        console.log(err);
    }
}

module.exports=connectDB;


//xzycB9U0Qn2Ma4sM
//mongodb+srv://Himan_Biswas:xzycB9U0Qn2Ma4sM@p-kart.tz6sjcx.mongodb.net/?retryWrites=true&w=majority
