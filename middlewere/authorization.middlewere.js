const jwt = require('jsonwebtoken');
const httpStatusText = require('../utils/httpStatusText');
const appError = require('../utils/appError');

const verifyToken = (req, res, next) => {
    const AuthHeader = req.headers['Authorization'] || req.headers['authorization'];
    if (!AuthHeader) {
       return res.status(401).json("token is required");
      
        
    }
     const token = AuthHeader && AuthHeader.split(' ')[1];
    //  console.log(token);    
    //  next();
try{
  const CurrentUser= jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.CurrentUser=CurrentUser;
    next();
}
    catch(err){
        const error = appError.create('Invalid token', 401, httpStatusText.ERROR);
        return next(error);
    }
}

module.exports = verifyToken;