const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const Cart = require('../modelSchema/Cart')
const {
    verify,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin     
    } = require('../middleware/VerifyToken');


// @desc    post cart
// @route   POST '/api/carts'
// @access  Public
router.post('/', verify, asyncHandler( async (req, res)=>{
    const newCart = new Cart(req.body)
 
    const savedCart = await newCart.save();
    res.status(200).json(savedCart)
 }));
 
 
 
 // @desc    updated products 
 // @route   PUT '/api/carts/:id'
 // @access  Public
 router.put('/:id', verifyTokenAndAuthorization, asyncHandler(async (req, res)=>{
 
     const updatedCart = await Cart.findByIdAndUpdate(req.params.id, req.body, {
         new: true,
       })
      res.status(200).json(updatedCart)
 }));
 
 
 // @desc    delete cart
 // @route   DELETE '/api/cart/:id'
 // @access  Public
 router.delete('/:id', verifyTokenAndAuthorization, asyncHandler( async (req, res)=>{
       
     const deleteCart = await Cart.findById(req.params.id)
     await deleteCart.remove()
     res.status(200).json('Cart deleted...')
 }))
 
 
 // @desc    Get products by all
 // @route   Get '/api/carts/find/:userid'
 // @access  Public
 router.get('/find/:userId', verifyTokenAndAuthorization, asyncHandler( async (req, res)=>{
     
     const getCarts = await Cart.findOne({userId: req.params.userId})
     res.status(200).json(getCarts)
 }))
 
 
 // @desc    Get products only the admin
 // @route   Get '/api/carts/'
 // @access  Private
router.get('/',  verifyTokenAndAdmin, asyncHandler(async (req, res)=>{
     const carts = await Cart.find();
     res.status(200).json(carts);
 }));




module.exports = router