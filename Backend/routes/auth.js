const express = require('express');
const User = require('../modelSchema/User');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');

const router = express.Router()


//@desc      user registration
//@route    POST '/api/auth/register'
//@access    public
 router.post('/register', asyncHandler( async (req, res)=>{
    
    const {username, email, password} = req.body;

      //if the input is empty
      if(!username || !email || !password ){
        res.status(400)
        throw new Error('please enter the input fields')
    }

    const userExist = await User.findOne({email});
    if(userExist){
        res.status(400)
        throw new Error('user already Exist')
    }

      //Hashing the password
      const salt = await bcrypt.genSalt(10);
      const hashedpassword = await bcrypt.hash(req.body.password, salt);

    //registering new user
    const newUser = await User.create({
        username,
        email,
        password: hashedpassword,
    });
       
    //if its the newUser 
    if(newUser){
        res.status(200).json({
            _id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            token: generateToken(newUser._id),
        })
    }else{
        res.status(400)
        throw new Error('invalid user data')
    }

 }));



 //@desc      user Login
//@route      POST '/api/auth/login'
//@access    public
router.post('/login', asyncHandler(async (req, res) => {
   
    const {email, password} = req.body;
    //checking for the  email
    const loginUser = await User.findOne({email})
    
    //return true if both operand are true or otherwise that is false
    if(loginUser && (await bcrypt.compare(password, loginUser.password))){
        res.status(200).json({
            _id: loginUser.id,
            username: loginUser.username,
            email:loginUser.email,
            isAdmin: loginUser.isAdmin,
            token: generateToken(loginUser._id)
        })
    }else{
        res.status(400)
        throw new Error('invalid credential')
    }

}));


//generate JWT token
const generateToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn: '7d',
    })
}




module.exports = router;
