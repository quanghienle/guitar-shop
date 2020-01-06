var express                 = require('express');
var router                  = express.Router();
var Cart                    = require('../models/cart');
var Order                   = require('../models/order');

//connect to Paypal
var paypal = require('paypal-rest-sdk');
//Paypal configuration
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AYbo3B-h1uv-XkDQgLW3buLCLOGpLd8EpFh6YdgA_4hCcrrtSbRFsrQnJcPzdkdiiSNPWSlxOaRqMyvY',
  'client_secret': 'EEADCxQLzh2q-FxqWNtnwmz7vu8Q-l9RNA92F9d5TuxHABcXg7L8AEmSZZrr1mlK67S1PeyRWjwUXRLz'
});
// GET checkout page
router.get('/', ensureAuthenticated, function(req, res, next){
    console.log(`ROUTE: GET CHECKOUT PAGE`)
    var cart = new Cart(req.session.cart)
    var totalPrice = cart.totalPrice
    res.render('checkout', {title: 'Checkout Page', items: cart.generateArray(), totalPrice: cart.totalPrice, bodyClass: 'registration', containerWrapper: 'container', userFirstName: req.user.fullname});
})

// POST checkout-process
router.post('/checkout-process', function(req, res){
   console.log(`ROUTE: POST CHECKOUT-PROGRESS`)
    var cart = new Cart(req.session.cart);
    var totalPrice = cart.totalPrice;

    //create payment json
    var create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://localhost:3000/checkout/checkout-success",
        "cancel_url": "http://localhost:3000/checkout/checkout-cancel"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "total payment",
                "sku": "item",
                "price": totalPrice,
                "currency": "CAD",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "CAD",
            "total": totalPrice
        },
        "description": "This is the payment description."
    }]
  };

  //link to paypal page
  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
        throw error;
    } else {
      for(let i = 0;i < payment.links.length;i++){
        if(payment.links[i].rel === 'approval_url'){
          res.redirect(payment.links[i].href);
        }
      }
    }
  });
});

// GET checkout-success
router.get('/checkout-success', ensureAuthenticated, function(req, res){
    console.log(`ROUTE: GET CHECKOUT-SUCCESS`)
    var cart = new Cart(req.session.cart);
    var totalPrice = cart.totalPrice;

    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
      "payer_id": payerId,
      "transactions": [{
          "amount": {
            "currency": "CAD",
            "total": totalPrice
        }
      }]
    };
    //get API
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      if (error) {
        console.log(error.response);
        throw error;
      } else {

        //payer's address
        let address = "";
        address += payment.payer.payer_info.shipping_address.line1 + " ";
        address += payment.payer.payer_info.shipping_address.city + " ";
        address += payment.payer.payer_info.shipping_address.state + " ";
        address += payment.payer.payer_info.shipping_address.country_code + " ";
        address += payment.payer.payer_info.shipping_address.postal_code;

        //order date
        let payTime = payment.create_time;


        //console.log(paymentId);
        //console.log(address);
        //console.log(payTime);
        //console.log(payment);
        //console.log(JSON.stringify(payment));

        //adding database
        var newOrder = new Order({
                orderID             : payment.cart,
                username            : req.user.username,
                address             : address,
                orderDate           : payTime,
                shipping            : true
              });
          newOrder.save();
      }
    });

    //empty shopping bag
    var cart = new Cart({});
    req.session.cart = cart;

    res.render('checkoutSuccess', {title: 'Successful', containerWrapper: 'container', userFirstName: req.user.fullname})
});

// PAYMENT CANCEL
router.get('/checkout-cancel', ensureAuthenticated, function(req, res){
    console.log(`ROUTE: GET CHECKOUT-CANCEL`)
    res.render('checkoutCancel', {title: 'Successful', containerWrapper: 'container', userFirstName: req.user.fullname});
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        console.log(`ERROR: USER IS NOT AUTHENTICATED`)
        req.flash('error_msg', 'You are not logged in');
        res.redirect('/');
    }
}

module.exports = router;
