const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const Order = require('../modelSchema/Order')
const {
    verify,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin     
    } = require('../middleware/VerifyToken');


// @desc    post Orders
// @route   POST '/api/orders'
// @access  Public
router.post('/', verify, asyncHandler( async (req, res)=>{
    const newOrder = new Order(req.body)
 
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder)
 }));
 
 
 
 // @desc    updated order 
 // @route   PUT '/api/orders/:id'
 // @access  private
 router.put('/:id', verifyTokenAndAdmin, asyncHandler(async (req, res)=>{
 
     const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, {
         new: true,
       })
      res.status(200).json(updatedOrder)
 }));
 
 
 // @desc    delete order
 // @route   DELETE '/api/orders/:id'
 // @access  Private
 router.delete('/:id', verifyTokenAndAdmin, asyncHandler( async (req, res)=>{
       
     const deleteOrder = await Order.findById(req.params.id)
     await deleteOrder.remove()
     res.status(200).json('Cart deleted...')
 }));
 
 
 // @desc    Get products by all
 // @route   Get '/api/carts/find/:userid'
 // @access  Public
 router.get('/find/:userId', verifyTokenAndAuthorization, asyncHandler( async (req, res)=>{
     
     const getOrder = await Order.find({userId: req.params.userId})
     res.status(200).json(getOrder)
 }))
 
 
 // @desc    Get orders only by Admin
 // @route   Get '/api/carts/'
 // @access  Private
 router.get('/',  verifyTokenAndAdmin, asyncHandler(async (req, res)=>{
     const orders = await Order.find();
     res.status(200).json(orders);
 }));


 // @desc    Get income stats only by Admin
 // @route   Get '/api/carts/'
 // @access  Private
 router.get('/income',  verifyTokenAndAdmin, asyncHandler(async (req, res)=>{
     const date = new Date();
     //getting the info of lastMonth and previous month
     const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
     const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() -1));
     
     try {
        const income = await Order.aggregate([
          { $match: { createdAt: { $gte: previousMonth } } },
          {
            $project: {
              month: { $month: "$createdAt" },
              sales: "$amount",
            },
          },
          {
            $group: {
              _id: "$month",
              total: { $sum: "$sales" },
            },
          },
        ]);
        res.status(200).json(income);
      } catch (err) {
        res.status(500).json(err);
      }

}));



module.exports = router