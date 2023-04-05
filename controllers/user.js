const User = require("../models/User");
const CustomError = require("../helpers/error/CustomError");
const expressHandlerWrapper = require("express-async-handler");

const getSingleUser = expressHandlerWrapper(async (req,res,next) => {

    const {id} = req.params;

    const user = await User.findById(id);

    return res.status(200).json({success : true , data : user})

})

const getAllUsers = expressHandlerWrapper(async (req,res,next) => {
    

    return res.status(200).json(res.queryResult)
});

module.exports = {getSingleUser,getAllUsers};