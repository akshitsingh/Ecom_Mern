const mongoose = require("mongoose")
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const crypto = require('crypto');

JWT_SECRET = 'AJJDFLJASLSJFLAJSDLFASJF';
JWT_EXPIRE = '5d'

const userSchema = new mongoose.Schema({
   name : {
       type : String,
       required : [true,'Please enter your name now'],
       maxlength : [30,'Name can not exceed 30 character'],
       minlength : [4,'Name should have more than 4 character']
   },
   email : {
       type : String,
       required : [true,'Please enter your email'],
       unique : true,
       validate : [validator.isEmail,'Please enter a valid email']
   },
   password : {
       type : String,
       required : [true,'Please enter new password'],
       minlength : [8,"Password should be greater than 8 characters"],
       select : false
   },
   avatar : {
       public_id:{
            type:String,
            required : true
        },
        url : {
            type : String,
            required : true
        }
    },
    role : {
        type : String,
        default : 'user'
    },
    resetPasswordToken : String ,
    resetPasswordExpire : Date 
})

userSchema.pre('save',async function(){
  
    if(!this.isModified("password")){
        next()
    }


    this.password = await bcrypt.hash(this.password,10)
})

//JWT Token
userSchema.methods.getJwtToken =  function(){
    return jwt.sign({id : this._id},JWT_SECRET,{
        expiresIn : JWT_EXPIRE
    })
}

//Compare password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

//Generating password reset token
userSchema.methods.getResetPasswordToken = function(){
    //Generating token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    //Hashing and adding resetPasswordToken to userschema
    this.resetPasswordToken = crypto.createHash('sha256')
    .update(resetToken)
    .digest('hex')

    this.resetPasswordExpire = Date.now() + 15*60*1000;
    return resetToken;
}

module.exports = mongoose.model('user',userSchema)