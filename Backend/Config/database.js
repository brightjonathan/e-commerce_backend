const mongoose = require('mongoose');
require('dotenv').config();

//using asyncHandler dependency... to handle all error in a func...
const asyncHandler = require('express-async-handler')

//connection configuration
const connectDB = asyncHandler( async () => {
        const conn = await mongoose
        .connect(process.env.MONGODB_URl);
        console.log(`DATABASE Connected: ${conn.connection.host}`.cyan.underline);
  });
  
  module.exports = connectDB;
