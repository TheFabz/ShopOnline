This project is a small-scale E-commerce platform. Complete with customer-view and store-staff-view (admin). 
The customer side platform has a recommendations algorithm that will recommend additional purchase items alongside the selected product. 
It has also review / comment capabilities and a shopping cart. When adding a review or completing a purchase, 
a mongoDB collection is populated with order and review data. This data is what renders both application sides.

The manager-side platform has full edit capabilities, allowing the manager to change prices, edit descriptions, 
delete products and add new products into the store. The manager also has access to all the store 
sales with filters day / week / month / year. In addition to this, the manager can remove some reviews if he deems they are toxic or unfair.

The back-end and server is built in node.js and express.js. The template engine used is EJS, persistence is 
being handled by mongo atlas cloud computing and the platform is built served locally with my own machine.

https://online-shop-bundles.herokuapp.com/
(sign in with 'admin':'admin')

Many more updates to come!
