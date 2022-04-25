const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const Product = require('../modelSchema/Product')
const {
    verify,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin     
    } = require('../middleware/VerifyToken');



// @desc    post products only for the admin
// @route   POST '/api/products'
// @access  Private only for the admin
router.post('/', verifyTokenAndAdmin, asyncHandler( async (req, res)=>{
   const newProduct = new Product(req.body)

   const savedProduct = await newProduct.save();
   res.status(200).json(savedProduct)
}));



// @desc    updated products only for the admin
// @route   PUT '/api/products/:id'
// @access  Private only for the admin
router.put('/:id', verifyTokenAndAdmin, asyncHandler(async (req, res)=>{

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      })
     res.status(200).json(updatedProduct)
}));


// @desc    delete products only for the admin
// @route   DELETE '/api/products/:id'
// @access  Private only for the admin
router.delete('/:id', verifyTokenAndAdmin, asyncHandler( async (req, res)=>{
      
    const deleteProduct = await Product.findById(req.params.id)
    await deleteProduct.remove()
    res.status(200).json('product deleted...')
}))


// @desc    Get products by all
// @route   Get '/api/products/all
// @access  Public
router.get('/find/:id', asyncHandler( async (req, res)=>{
    
    const getProduct = await Product.findById(req.params.id);
    res.status(200).json(getProduct)
}))


// @desc    Get products by all with query
// @route   GET '/api/products'
// @access  Public
router.get('/', asyncHandler( async (req, res)=>{

    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
      let products;
  
      if (qNew) {
        products = await Product.find().sort({ createdAt: -1 }).limit(1);
      } else if (qCategory) {
        products = await Product.find({
          categories: {
            $in: [qCategory],
          },
        });
      } else {
        products = await Product.find();
      }
  
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json(err);
    }  

}));


module.exports = router;

