const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
 const ApiFeatures = require("../util/apiFeatures");
const ErrorHandler = require("../util/errorhandler");
const sendToken = require("../util/jwtToken");
const sendEmail = require('../util/sendEmail')

 exports.registerUser = catchAsyncErrors(
    async(req,res,next)=>{

        const {name,email,password } = req.body
        const user = await User.create({
            name,email,password,
            avatar : {
                public_id : "this is sample id",
                url : "profilePicUrl"
            }
        })

   
        sendToken(user,200,res)
   
    }

 )

 exports.loginUser = catchAsyncErrors(
     async(req,res,next)=>{
         const {email,password}= req.body;

       if(!email || !password){
           return next(new ErrorHandler("Please enter Email and Password",400))
       }

       const user = await User.findOne({email}).select("+password");

       if(!user){
           return next(new ErrorHandler("Invalid email or password",401))
       }

       const isPasswordMatched = user.comparePassword(password,this.password);

       if(!isPasswordMatched){
           return next(new ErrorHandler("Invalid email or password",401))
       }

       sendToken(user,200,res)
     }
 )

 exports.logout = catchAsyncErrors(
     async(req,res,next)=>{

        res.cookie("token",null,{
            expires : new Date(Date.now()),
            httpOnly : true
        })

        res.status(200).json({
           success : true,
           message : "Logged out"
        })
     }
 )

 //Forgot password 
 exports.forgotPassword = catchAsyncErrors(
     async(req,res,next)=>{
         const user = await User.findOne({email : req.body.email});

         if(!user){
             return next(new ErrorHandler("User not found",404))
         }

         //Get ResetPassword Token 
       const resetToken = user.getResetPasswordToken();
       await user.save({validateBeforeSave : false })

       const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`
       
       const message = `Your password reset token is : - \n \n ${resetPasswordUrl} \n\n if you have not requested
       this email, please ignore it`;

       try{
         await sendEmail({
            email : user.email,
            subject : `Ecommerce password recovery`,
            message
         })

         res.status(200).json({
             success : true,
             message : `Email send to ${user.email} successfully`
         })
       }
       catch(err){
         user.getResetPasswordToken = undefined;
         user.resetPasswordExpire = undefined;

         await user.save({validateBeforeSave : false});

         return new ErrorHandler(error.message,500)
       }
     }
 )

 exports.resetPassword = catchAsyncErrors(
     async (req,res,next)=>{
    const resetPasswordToken = crypto.createHash('sha256')
    .update(req.params.token)
    .digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resetPassswordExpire : {$gt : Date.now()}
    })

      if(!user){
      return next(new ErrorHandler('Reset Password token is invalid or has been expired',400))
      }

      if(req.body.password != req.body.confirmPassword){
          return next(new ErrorHandler('Password does not match',400))
      }

      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      sendToken(user,200,res)

     }
 
 )

 exports.getUserDetail = catchAsyncErrors(
    async (req,res,next)=>{

       const user = await User.findByID(req.user.id);

       res.status(200).json({
           success : true,
           user
       })

    }
)

//Update user password
exports.updatePassword = catchAsyncErrors(
    async(req,res,next)=>{
        const user = await User.findById(req.user._id).select('+password');

        const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

        if(!isPasswordMatched){
            return next(new ErrorHandler("Old password is incorrect",401))
        }

        if(req.body.newPassword !== req.body.confirmPassword){
            return next(new ErrorHandler('Password does not match',400))
        }

        user.password = req.body.newPassword ;

        user.save();

        sendToken(user, 200, res)

    }
)

//Update User profile
exports.updateProfile = catchAsyncErrors(
    async(req,res,next)=>{
       

        const newUserData = {
            name : req.body.name,
            email : req.body.email
        }

        const user = await User.findByIdAndUpdate(req.user.id,newUserData, {
            new : true,
            runValidators : true,
            userFindAndModify : false
        })

       res.status(200).json({
           success : true,
           user
       })

    }
)


//Get all user -admin
exports.getAllUsers = catchAsyncErrors(
    async(req,res,next)=>{

       const users = await User.find();

       res.status(200).json({
           success : true,
           users
       })
    }
)

//Get single user
exports.getSingleUser = catchAsyncErrors(
    async(req,res,next)=>{

       const user = await User.findById(req.params.id);

       if(!user){
         return next(new ErrorHandler('User does not exist with this id',req.params.id))
       }

       res.status(200).json({
           success : true,
           user
       })

    }
)


//update user role --admin
exports.updateUserRole = catchAsyncErrors(
    async(req,res,next)=>{
       

        const newUserData = {
            name : req.body.name,
            email : req.body.email,
            role : req.body.role
        }

        const user = await User.findByIdAndUpdate(req.params.id,newUserData, {
            new : true,
            runValidators : true,
            userFindAndModify : false
        })

       res.status(200).json({
           success : true,
           user
       })

    }

    
)


// delete user admin
exports.deleteUser = catchAsyncErrors(
    async(req,res,next)=>{
       

       const user = await User.findById(req.params.id)

       if(!user){
           return next(new ErrorHandler('User does not exist with id :' + req.param.id));
       }

       await user.remove();

       res.status(200).json({
           success : true,
           message : "user deleted successfully"
       })

    }
)






