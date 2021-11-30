const ErrorHandler = require("../util/errorhandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const JWT_SECRET = 'AJJDFLJASLSJFLAJSDLFASJF';


exports.isAutheticatedUser = catchAsyncErrors(
    async (req,res,next)=>{
        const {token} = req.cookies;
    
    if(!token){
      return next(new ErrorHandler('Please login to access this resource',401))  
    }
   
    const decodedData = jwt.verify(token,JWT_SECRET)

    req.user = await User.findById(decodedData.id)

    next();
}   
)

exports.authorizeRoles = (...roles)=>{
    return (req,res,next)=>{
      if(!roles.includes(req.user.role)){
      return next(
        new ErrorHandler(`Role : ${req.user.role} is not allowed to access this resource`)
      ) 
      }
      next();
    }
   
   
}