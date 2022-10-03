const db = require('../services/db-connect');
const logger = require('../services/logger');

/**
 * Fetch shopping cart items from DB
 * 
 * @param {number} cartId
 * 
 * @returns {object[]} 
 */
function getCartItems(cartId) {
  const query = 'SELECT item.id, item.name, item.price_cents, cart_item.quantity ' +
                'FROM item JOIN cart_item ON item.id = cart_item.item_id ' + 
                'WHERE cart_id = ?';

  return db.query(query, [cartId]);
}

/**
 * Fetch discount from DB
 * 
 * @param {number} cartId
 * 
 * @returns {object[]} 
 */
function getCartDiscount({ cartId, discountId }) {
  let data; 

  if (cartId) {
    const query = 'SELECT * FROM discount ' + 
                 'JOIN cart on cart.discount_id = discount.id ' +
                 'WHERE cart.id = ?';
    data = db.query(query, [cartId]);

  }
  else {
    const query = 'SELECT * FROM discount WHERE id = ?';
    data = db.query(query, [discountId]);
  }
  
  return data?.length ? data[0] : null;
}

/**
 * Helper function to get total cents of items, including quantity of items
 */
function getTotalCentsOfItems(items) {
  return items.reduce(
    (previousValue, item) => previousValue + item.price_cents * item.quantity,
    0
  );
};

/**
 * Calculate custom discount amount
 * 
 * @param {object[]} items - list of cart contents
 * @param {object} discountInfo - discount JSON
 *
 * @returns {number} 
 */
function calculateCustomDiscount(items, discountInfo) {
  const { triggerItems, triggerMinimum = 1, discountItems, discountMaximum,
      discountCents, discountPercent } = JSON.parse(discountInfo);

  // This is a bit hacky, since it requires implicity casting boolean to int, 
  // but this is checking that one and ONLY one of discountCents, discountPercent or freeItem
  // is specified. If none or more than one are present, something is wrong
  const discountTypesSpecified =  !!discountCents + !!discountPercent;
  if (discountTypesSpecified !== 1) {
    return 0;
  }

  // If there are no items to trigger from, or no items to apply discounts to, 
  // then the discount is automatically 0
  if (!triggerItems?.length || !discountItems?.length) {
    return 0
  }

  // Count items in cart that are in the trigger list
  const triggerItemCount = items.reduce((previousValue, item) => {
    if (triggerItems.includes(item.id)) {
      return  previousValue + item.quantity;
    }
    return previousValue; 
  }, 0);

  logger.log("trigger count: " + triggerItemCount + " trigger min: " + triggerMinimum);

  // Amount of trigger items do not meet minimum threshold for the discount
  if (triggerItemCount < triggerMinimum) {
    return 0;
  }

  // Find the eligible items
  const eligibleItems = items.filter(item => {
    return discountItems.includes(item.id);
  });

  // If the list of items eligible for a discount is empty, then return 0
  if (!eligibleItems.length) {
    return 0;
  }

  // If discount is in cents, the discount is the floor of the item total and the discount amount (i.e. if the discount is for $20 off
  // but we only have $10 worth of qualified items, the discount is $10)
  if (discountCents) {
    return Math.floor(discountCents, getTotalCentsOfItems(eligibleItems));
  }

  // If discount is in percent, take that % off of each elibible item, up to an optional max
  if (discountPercent) {
    return eligibleItems.reduce(
      (previousValue, item) => previousValue + item.price_cents * (discountMaximum || item.quantity) * discountPercent,
      0
    );
  }

  // We shouldn't get here, but if we do, return 0
  return 0;
}

/**
 * Calculate discount amount
 * 
 * @param {object[]} items - list of cart contents
 * @param {number} preDiscountCents - total amount pre-discount
 * @param {object} discount - applied discount
 *
 * @returns {number} 
 */
function getDiscount(items, preDiscountCents, discount) {
  if (!discount) {
    return 0;
  }
  const { discountCents, discountPercent, minimumCents, custom } = discount; 
  
  // This is a bit hacky, since it requires implicity casting boolean to int, 
  // but this is checking that one and ONLY one of discountCentss, discountPercent or custom 
  // is specified. If none or more than one are present, something is wrong
  const discountTypesSpecified =  !!discountCents + !!discountPercent + !!custom; ;

  if (discountTypesSpecified !== 1) {
    return 0;
  }

  // Discount is a fixed amount, if cart total meets (optional) minimum
  if (discountCents && preDiscountCents > (minimumCents || 0)) {
    return discountCents;
  }
  // Take a percentage of the total
  else if (discountPercent && preDiscountCents > (minimumCents || 0)) {
    return Math.round(preDiscountCents * discountPercent);
  }
  else if (custom) {
    return calculateCustomDiscount(items, custom);
  }

  return 0;
}

/**
 * Calculate cart subtotal
 * 
 * @param {object[]} items - list of cart contents
 * @param {object} discount - applied discount
 * 
 * @returns {object}
 */
function calculateSubtotal(items, discount) {
  const preDiscountCents= items.reduce(
    (previousValue, item) => previousValue + item.price_cents * item.quantity,
    0
  );
  const discountCents = getDiscount(items, preDiscountCents, discount);

  return {
    preDiscountCents,
    discountCents,
    subtotalCents: preDiscountCents - discountCents,
  }
}

module.exports = {
  getCartItems,
  getCartDiscount,
  calculateSubtotal,
}
