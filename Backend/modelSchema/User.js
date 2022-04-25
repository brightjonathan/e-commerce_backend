const mongoose = require('mongoose');


// User Schema
const UserSchema = new mongoose.Schema({
    username: {
      type: String,
      required: [true, 'please enter your name'],
      unique: true
    },
    email: {
        type: String,
        required: [true, 'please enter your email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'please enter your password']
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
  },{
      timestamps: true
  });


  module.exports =  mongoose.model('USER', UserSchema);
  