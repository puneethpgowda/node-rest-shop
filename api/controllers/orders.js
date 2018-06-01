const Order = require('../models/orders');

module.exports.orders_get_all = (req, res, next) => {
    Order.find()
        .populate('product', 'name')
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
};