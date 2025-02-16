module.exports = (...roles)=>{
    console.log(roles);
    return (req, res, next)=>{
            const currentUser = req.currentUser;
            if(!roles.includes(currentUser)){
                return res.status(401)
                .json({status: 'fail', message: 'user not athorize to do this'})
            }
            next();                
    }
}
