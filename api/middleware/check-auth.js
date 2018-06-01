const jwt = require('jsonwebtoken');
const jwtConfig = require('../../config/jwt');

module.exports = (req,res,next) =>{
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token,jwtConfig.secretKey);
        
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth Failed (check auth)'
        })
    }
}