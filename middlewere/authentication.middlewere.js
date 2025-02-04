// const httpStatusText = require('../utils/httpStatusText');
// const jwt = require('jsonwebtoken');

// const verifyToken = (req, res, next)=>{
//        try{
//         const auth = req.headers['Authorization'] || req.headers['authorization']
        
//         if(!auth)
//             return res.status(401).json({status: httpStatusText.FAIL, message: "Token is required"});

//         const token = auth.split(' ')[1];
//         const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//         req.currentUser = decodedToken.role;
        
//         next();

//        }catch(err){
//             res.status(401).json({
//                 status: httpStatusText.ERROR,
//                 message: err
//             })
//        }

// }

// module.exports = verifyToken;