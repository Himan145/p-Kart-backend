const express = require('express');
const dotenv=require('dotenv');
const connectDB = require('./config/db.js');
const cors=require('cors');
const authRoutes=require('./routes/authRoute.js');
const categoryRoute=require('./routes/categoryRoute.js');
const productRoute=require('./routes/productRoute.js');

const app=express();

//configure dotenv
dotenv.config();
const port=process.env.PORT || 5000;

//connect with database
connectDB();

app.use(express.json({
    verify: (req, res, buf) => {
    req.rawBody = buf.toString()
    },
    limit: '50mb'
}));
app.use(cors());
app.use(express.urlencoded({ extended: true, limit:'50mb' }));

//routes
app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/category',categoryRoute);
app.use('/api/v1/product',productRoute);


app.listen(port,()=>{
    console.log(`Application started at port ${port}`);
})
