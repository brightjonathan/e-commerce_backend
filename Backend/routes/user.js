const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const User = require('../modelSchema/User');
const bcrypt = require('bcryptjs');
const {
    verify,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin     
    } = require('../middleware/VerifyToken');



  // @desc    Update user only the user and Admin can update
  // @route   PUT /api/users/:id
  // @access  Private
router.put('/:id', verifyTokenAndAuthorization, asyncHandler( async (req, res)=>{

        //Hashing the updated password
      const salt = await bcrypt.genSalt(10);
     const hashedpassword = await bcrypt.hash(req.body.password, salt);
 
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
        $set : {
            username: req.body.username,
            email: req.body.email,
            password: hashedpassword
        }
      })
    
      
      res.status(200).json(updatedUser)


    //   res.status(200).json({
    //       username: updatedUser.username,
    //       email: updatedUser.email,
    //       isAdmin:updatedUser.isAdmin
    //   });

}))


  // @desc    Delete user only the user and the Admin can delete
  // @route   DELETE '/api/users/:id'
  // @access  Private
router.delete('/:id', verifyTokenAndAuthorization, asyncHandler(async (req, res) =>{
       const deleteUser = await User.findById(req.params.id)

       if(!deleteUser){
           res.status(400)
           throw new Error('User not found')
       }

       //checking for the user
       if(!req.user){
           res.status(400)
           throw new Error('user not found')
       }

       await deleteUser.remove()
       res.status(200).json('user deleted...')

}));



  // @desc    Get single user only the admin
  // @route   GET '/api/users/find/:id'
  // @access  Private only for Admin
router.get('/find/:id', verifyTokenAndAdmin, asyncHandler(async(req, res)=>{
   const user =  await User.findById(req.params.id)
     res.status(200).json(user)
     
}))



  // @desc    Get all user also querying the endpoint only the admin
  // @route   GET '/api/users/all'
  // @access  Private only for only the Admin
  router.get('/all', verifyTokenAndAdmin, asyncHandler(async(req, res)=>{
    
    const query = req.query.new;
    const user =  query ? await User.find().sort({_id: -1}).limit(5) : await User.find()

      res.status(200).json(user)
      
 }))



   // @desc     Get all the stats
  // @route   GET '/api/users/stats'
  // @access  Private only for Admin
router.get("/stats", verifyTokenAndAdmin, asyncHandler( async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  
    try {
      const data = await User.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);
      res.status(200).json(data)
    } catch (err) {
      res.status(500).json(err);
    }
  }));



module.exports = router