const jwt = require('jsonwebtoken'); 
const asyncHandler = require('express-async-handler');
const User  = require('../modelSchema/User');

//ACCESS CONTROL ENGINE

const verify = asyncHandler( async (req, res, next) =>{
   
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            //get token from header
            token = req.headers.authorization.split(' ')[1]

            //verifying token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            //Get user from the token
            req.user = await User.findById(decoded.id)
            next()
        } catch (error) {
             console.log(error)
             res.status(401)
             throw new Error('Not authorized')
        }
    }

      //if there is no token
      if(!token){
        res.status(401)
        throw new Error('Not authorized, no token')
    };
 
});

//checking if the id matches and if you are an admin
const verifyTokenAndAuthorization = asyncHandler( (req, res, next) => {
    verify(req, res, () => {
      if (req.user.id === req.params.id || req.user.isAdmin ) {
        next();
      } else {
        res.status(403).json("sorry, You are not allowed to do that!");
      }
    });
  })

  //verifying the Admin
  const verifyTokenAndAdmin = asyncHandler( (req, res, next) => {
    verify(req, res, () => {
      if (req.user.isAdmin) {
        next();
      }
      
      if(!req.user.isAdmin){
        res.status(403).json("sorry, You are not allowed to do that!");
      }
    })
  });


module.exports = {
     verify,
     verifyTokenAndAuthorization,
     verifyTokenAndAdmin
};

