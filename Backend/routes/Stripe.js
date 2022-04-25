const express = require('express');
const Stripe = require('stripe')(process.env.STRIPE_KEY);
const asyncHandler = require('express-async-handler');
const router = express.Router();

router.post('/payment', asyncHandler( async (req, res)=>{
    Stripe.charges.create({
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "NGN",
    }, (stripeErr, stripeRes)=>{
        if(stripeErr){
            res.status(500).json(stripeErr)
        }else{
            res.status(200).json(stripeRes)
        }
    })
}))

module.exports = router