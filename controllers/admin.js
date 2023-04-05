 const User = require("../models/User");
 const CustomError = require("../helpers/error/CustomError");
 const expressHandlerWrapper = require("express-async-handler");

 const blockUser = expressHandlerWrapper(async(req,res,next) =>{
     const {id} = req.params;

     const user = await User.findById(id);

     user.blocked = !user.blocked;

     await user.save();

     return res.status(200).json({success: true , message : "Block - Unblock event is successful"})
 })

 const deleteUser = expressHandlerWrapper(async(req,res,next) =>{
     const {id} = req.params;

     const user = await User.findById(id);

     await user.remove();

     return res.status(200).json({success: true , message : "Delete operation is successful"})


 })

 module.exports = {
     blockUser,
     deleteUser
 }