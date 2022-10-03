# Shopping Cart app

## Description
This is a very basic shopping cart example that demonstrates the calculation of a subtotal, given items that have aleady been placed in the cart, as well as a discount that has been applied. The libraries used for this demo are Node.js, Express, and SQlite. 

## Setup
Open the zipfie on your computer and in a terminal, cd to the "shopping-cart" directory 

Run: 
> npm install

In the terminal, run:

> sqlite 3 shopping-cart.db

In the sqlite console, run the DB creates and inserts in the DB_README.md file


## How to run: 
- Run the app with: "npm start"

- Go to: localhost:3000/shopping-cart/1

I've created shopping carts 1-7, with different discounts applied. 


## Results
No discount applied
http://localhost:3000/shopping-cart/1
{"preDiscountCents":24500,"discountCents":0,"subtotalCents":24500}

$10 applied to cart = 1000
http://localhost:3000/shopping-cart/2
{"preDiscountCents":24500,"discountCents":1000,"subtotalCents":23500}


20% applied to cart = 24500 * .20 =  4900
http://localhost:3000/shopping-cart/3
{"preDiscountCents":24500,"discountCents":4900,"subtotalCents":19600}

$15 off socks = 1500 = 1500
http://localhost:3000/shopping-cart/4

25% off shoes = 8500 + 5000 * .25 = 3375
http://localhost:3000/shopping-cart/5
{"preDiscountCents":24500,"discountCents":3375,"subtotalCents":21125}

Buy 3 pairs of Hane's socks, get 4th free = 1500 (cost of 1 Hanes)
http://localhost:3000/shopping-cart/6
{"preDiscountCents":50000,"discountCents":1500,"subtotalCents":48500}

Buy 1 pair of Nike's get Nike socks free = 2500 (Cost of 1 Nike socks)
http://localhost:3000/shopping-cart/7
{"preDiscountCents":24500,"discountCents":2500,"subtotalCents":22000}

## About the code
The entry point is the index.js, which is pretty minimal, and just applies the router settings.  The next file you'll want to look at is routes/routes.js, which handles the HTTP GET request, then calls the service functions to fetch cart items and discount, and then returns the computed subtotal. 

The bulk of the the functionality is in services/shopping-cart.js, where most of the code is concerned with applying the correct discount amount to the subtotal.

## About the data model
I kept things pretty minimal in here. In a real world app, I would have created, updated, and deleted dates on most of the tables, but I did not include them for this exercise. 

There is a very simple cart table. In real life, there would probably be a foreign key that pointed to a user, but that was outside the scope of this exercise. Also, in a real world application, I would probably have the subtotal be a field on cart, and would be updated whenver there was some action on the cart (item added, item removed, quantity changed, discount applied, discount removed), but for the purpose of this exercise, the subtotal was computed whenever the endpoint is called. 

There is a simple item table with price and name, and a join table that provides the many-to-many relationship with cart, and allows quantity to be specified

There is also a discount table, with the foreign key for it being in cart.  I considered making a join table which could allow multiple discounts to be stacked if we wanted to do that in the future, but figured it was fine just keeping it locked to one discount. The discountCents and discountPercent to be applied to the whole cart was pretty simple, but I was not sure the best way to accomplish the more complicated discount logic, so they best I could come up with in the time allowed was to make it a JSON string to define a "custom" discount. 

Custom has fields: 
triggerItems - the eligible item ids that must be in the cart to enable the discount
triggerMinimum - the minimum number of items to enable the discount (i.e.  4 items and 5th is free)
discountItems - the items that discount will be applied to
discountMaximum - the max items the discount will be applied to
discountCents - the amount of cents to discount (not to exceed the total cents of eligible items
discountPercent - % off of the eligible items

For example: to allow a discount where buying 3 shoes gets you 1 pair of socks for free you would have 
triggerItems include the item id of the shows,
triggerMinimum would be 3
discountItems would be socks ids
discountMaximum would be 1
and discountPercent would be 1.0 (100% off)


## Other notes
If I were going to implement allowing a discount to only be used N times, I would create a table with cart_id and discount_id, which would be populated when 
the discount was used, as in the user checked out and paid, not just applied it to their cart. 

Then, in the endpoint for applying discounts to the cart, it would check if this user/cart had already used this discount in the past. 
