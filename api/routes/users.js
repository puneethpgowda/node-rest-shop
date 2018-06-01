const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../../config/jwt');
const User = require('../models/users');

router.post('/signup', (req, res, next) => {


    User.find({ email: req.body.email })
        .exec()
        .then(result => {
            if (result.length >= 1) {
                return res.status(409).json({ message: 'The email ID already exists' })

            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                res.status(200).json({
                                    message: 'User Created',
                                    result: result
                                })
                            })
                            .catch(err => {
                                res.status(500).json({
                                    message: 'Could Not create User',
                                    error: err
                                })
                            });
                    }
                })
            }
        })
        .catch(err => { res.send(500).json({ err: err }) });
})

router.post('/login', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(users => {
            if (users.length < 1) {
                res.status(401).json({
                    message: 'Auth failed'
                })
            } else {
                bcrypt.compare(req.body.password, users[0].password, (error, response) => {

                    if (error) {
                        return res.status(500).json({
                            message: 'Could Not create User',
                            error: error
                        })
                    }
                    if (response) {
                        const token = jwt.sign(
                            {
                                email: users[0].email,
                                userId: users[0]._id
                            },
                            jwtConfig.secretKey
                            , {
                                expiresIn: '1h'
                            }
                        );
                       return  res.status(200).json({
                            message: "Auth Successful",
                            token: token
                        })
                    }

                    res.status(401).json({
                        message: 'Auth failed'
                    })
                })
            }
        })
        .catch(err => {
            console.log(err);

            res.status(500).json({
                error: err
            })
        });
})

router.delete('/delete/:id', (req, res, next) => {

    User.remove({ _id: req.params.id })
        .exec()
        .then(result => { res.status(200).json({ message: "The user is deleted" }) })
        .catch(err => {
            res.status(500).json({
                message: 'Could Not create User',
                error: err
            })
        });


})

module.exports = router;