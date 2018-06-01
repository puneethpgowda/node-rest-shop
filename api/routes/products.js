const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
})

const upload = multer({ storage: storage });

const Product = require('../models/products');

router.get('/', (req, res, next) => {

    Product.find()
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json({
                docs
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;

    Product.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({ doc })

            } else {
                res.status(200).json({
                    message: "Could not find Product"
                })
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: {
                    message: "Something went wrong"
                }
            });
        });

    if (id === 'special') {
        res.status(200).send(id);
    }
});


router.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {
    console.log(req.file);

    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })

    product.save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                result
            })
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                err: err
            })
        });

});


router.delete('/:productId', checkAuth, (req, res, next) => {
    const id = req.params.productId;

    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                result
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });

});


router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(
            err => {
                console.log(err);
                res.status(500).json({
                    error: err
                })
            }
        );
});

module.exports = router;