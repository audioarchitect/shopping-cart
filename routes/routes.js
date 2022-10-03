const express = require('express');
const router = express.Router();
const cartServices = require('../services/shopping-cart');
const logger = require('../services/logger');

/**
 * Handle errors
 * 
 * @param {string} err
 * @param {Function} nextCallback
 */
function handleError(err, nextCallback) {
  console.error(`An error occurred: `, err.message);
  nextCallback(err);
}

/*
 * Handle request for GET /shopping-cart 
 *
 * This is an invalid request, because we need the cart ID
 */
router.get('/', function(req, res, next) {
  try {
    res.json('Please provide a shopping cart id');
  }
  catch(err) {
    handleError(err, next);
  }
});

/*
 * Handle request for GET /shopping-cart/:cartId
 *
 * Returns the cart information, including the subtotal in cents
 */
router.get('/:cartId', function(req, res, next) {
  try {
    // Get the card Id from request params and discount id from query string (optional)
    const cartId = req.params.cartId;
    const discountId = req.query.discount;

    // Fetch item list and discount
    const items = cartServices.getCartItems(cartId);
    let discount; 

    if (discountId) {
      discount = cartServices.getCartDiscount({discountId});
    }
    else {
      discount = cartServices.getCartDiscount({cartId});
    }
    logger.log(`Discount: ${JSON.stringify(discount)}`);
    logger.log('Calculating subtotal');
    res.json(cartServices.calculateSubtotal(items, discount));
  }
  catch(err) {
    handleError(err, next);
  }
});

module.exports = router;