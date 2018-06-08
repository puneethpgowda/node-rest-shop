const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');
const dbConfig = require('./config/dbconfig');

mongoose.connect(dbConfig.url)
    .then(() => {
        console.log("Database Connected");
    })
    .catch(() => {
        console.error("Could not connect to database");
        process.exit();
    });

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE, PATCH');
    res.header('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE, PATCH');
        res.header('Access-Control-Allow-Headers', 'Authorization');    

        return res.status(200).json({});
    }
    next();
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

app.use((req, res, next) => {
    const error = new Error('Route Not Found');
    error.status = 404;
    next(error)
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;