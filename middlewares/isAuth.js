const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/user');

const protect =async (req,res,next)=>{
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {

        try{
            token = req.headers.authorization.split(' ')[1];
            console.log(token);
            const decoded = jwt.verify(token,config.jwtSecret);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch(err){
            res.status(401).json({msg: 'Token is not valid'});
        }
    }
    if(!token) {
        return res.status(401).json({msg:'No Token, authorization denied'});
    }
    
};

module.exports = protect;