# node-rest-shop
A back-end server created using Node, Express and MongoDB

#API End Points
## Users
/users/signup { POST } Creates a user based on unique emailId. 

/users/login { POST } logs in a user based on email and password. Returns a token.
 
/users/delete/:userId { DELETE } Deletes a user based on userId.

## Products
/products/ { GET }

/products/:productId { GET }

/products/ { POST } Creates a product using Name, price, productImage(opt) 

/products/:productId { DELETE } Deletes a product using productId

/products/:productId { PATCH } Updates the product ising productId

## Orders

/orders/ { GET } Gets all orders

/orders/ { POST } creates an order based on quantity and productId

/orders/:orderId { DELETE } Deletes an order based on productId



