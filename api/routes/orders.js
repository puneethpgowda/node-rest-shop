const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/orders');
const Product = require('../models/products');
const checkAuth = require('../middleware/check-auth');

const ordersController = require('../controllers/orders');

router.get('/', checkAuth, ordersController.orders_get_all );

router.get('/:orderId', checkAuth, (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ err });
        });

});

router.post('/', checkAuth, (req, res, next) => {

    Product.findById(req.body.productId)
        .exec()
        .then((result) => {
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });

            order.save()
                .then(result => {
                    console.log(result);
                    res.status(200).json({
                        result
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ err });
                });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                message: "Product does not exist",
                err: err
            });
        });



});

router.delete('/:orderId', checkAuth, (req, res, next) => {
    const id = req.params.orderId;
    Order.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Order Deleted",
                result: result
            });

        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                message: "Product does not exist",
                err: err
            });
        });
});



module.exports = router;