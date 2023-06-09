const User = require("../models/User");
const CustomError = require("../helpers/error/CustomError");
const expressHandlerWrapper = require("express-async-handler");
const {sendJwtToClient} = require("../helpers/authorization/tokenHelper");
const {getAccessToRoute} = require("../middlewares/authorization/auth");
const {validateUserInput,comparePassword} = require("../helpers/input/inputHelper");
const sendEmail = require("../helpers/libraries/sendEmail");

const register = expressHandlerWrapper(async (req,res,next) => {

   
      const {name,email,password,role} = req.body;

      

    

        const user = await User.create({
            name,
            email,
            password
        })

        sendJwtToClient(user,res);

   

    
})

const login = expressHandlerWrapper(async (req,res,next) => {

    const {email,password} = req.body;
    if(!validateUserInput(email,password)){
        return next(new CustomError("Please check your inputs",400))
    }   

    const user = await User.findOne({email}).select("+password");

    if(!comparePassword(password,user.password)){
        return next(new CustomError("Please check your credentials",400))
    }

    sendJwtToClient(user,res);


    res.status(200)
    .json({
        success:true,

    })

  
})

const logout = expressHandlerWrapper(async (req,res,next) => {

    const {NODE_ENV} = process.env;

res.status(200)
.cookie({
    httpOnly: true ,
    expires: new Date(Date.now()),
    secure : NODE_ENV === "development" ? false : true

})
.json({
    success:true,
    message : "Logout successful"
})


})

const getUser = (req,res,next) =>{
    res.json(
        {success: true,
            data : {
                id : req.user.id,
                name : req.user.name
            }
        }
       
    )
    
}

const imageUpload = expressHandlerWrapper(async (req,res,next) => {

    const user =  await User.findByIdAndUpdate(req.user.id,{
        "profile_image" : req.savedProfileImage
    },{
        new : true ,
        runValidators : true 
    })
    res
    .status(200)
    .json({
        success : true ,
        message: "Image successfully uploaded",
        data: user
    })
});

const forgotPassword = expressHandlerWrapper(async (req,res,next) => {

    const {SMTP_HOST,SMTP_PORT,SMTP_USER,SMTP_PASS} = process.env;

    const resetEmail = req.body.email;
    const user = await User.findOne({email : resetEmail})

    if(!user){
        return next(new CustomError("There is no any user with that email"))
    }

    const resetPasswordToken = user.getResetPasswordTokenFromUser();
    
    await user.save();

    // const resetPasswordUrl = `http://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;

    

    // const emailTemplate = `
    // <h3>Reset Your Password </h3>
    // <p> This <a href = '${resetPasswordUrl}' target = '_blank' >link</a> will expire in one hour </p>
    // `

    // try{
    //     await sendEmail({
    //         from : SMTP_USER,
    //         to: resetEmail,
    //         subject : "Reset your password",
    //         html : emailTemplate
    //     });
    //     return  res.status(200).json({
    //         success : true ,
    //         message : "Token has sent to your email"
    //     });
    // }
    // catch(err){
    //     user.resetPasswordToken = undefined,
    //     user.resetPasswordExpire = undefined

    //     await user.save();

    //     return next(new CustomError("Email could not has been sent ",500))
    //  }

     return  res.status(200).json({
        success : true ,
        message : "Token has sent to your email"})
   


})

const resetPassword = expressHandlerWrapper(async (req,res,next) => {

    const {resetPasswordToken} = req.query;

    const {password } = req.body;

    if(!resetPasswordToken){
        return next(new CustomError("Please provide a valid token" , 400))
    }

    let user = await User.findOne({resetPasswordToken : resetPasswordToken , resetPasswordExpire : {$gt : Date.now()}})

    if(!user){
        return next(new CustomError("Invalid token or session expire "))
    }
    user.password  = password 
    user.resetPasswordExpire = undefined 
    user.resetPasswordToken = undefined

    await user.save();

    return res.status(200).json({
        success : true,
        message:"Your password has been changed successfuly"
    })

})

const editDetails = expressHandlerWrapper(async (req,res,next) => {
    const {id} = req.user

    const newDetails = req.body;

    const user = User.findByIdAndUpdate(id,newDetails,{new : true,runValidators : true })

    return res.status(200).json({success:true,data:user})
})





module.exports = {
    register,
    getUser,
    logout,
    imageUpload,
    forgotPassword,
    resetPassword,
    editDetails,
    login
}