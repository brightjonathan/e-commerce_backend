const express = require('express');
const app = express(); 
require('dotenv').config();
const cors = require('cors');
const colour = require('colors');
const connectDB = require('./Config/database');
const {errorHandler} = require('./middleware/errorHandle');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const productRoute = require('./routes/product')
const cartRoute = require('./routes/cart')
const orderRoute = require('./routes/order')
const stripeRoute = require('./routes/Stripe')



//database connection
connectDB()


//internal middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors())


//all routes
app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/products', productRoute)
app.use('/api/carts', cartRoute)
app.use('/api/orders', orderRoute)
app.use('/api/checkout', stripeRoute)


//for error handler
app.use(errorHandler)


//local host connection
const port = process.env.PORT || 4000;
app.listen(port, ()=>{
 console.log('server is running...');
});

