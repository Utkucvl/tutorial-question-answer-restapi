const CustomError = require("../../helpers/error/CustomError");
const customErrorHandler = (err,req,res,next) => {
    let customerror = err;
    
   

    if(err.name === "SyntaxError"){

        customerror = new CustomError("Unexpected Syntax",400)
    }

    if(err.name === "ValidationError"){
        customerror = new CustomError(err.message,400)
    }
    if(err.code === 11000) {
        customerror = new CustomError("Please check your inputs again" , 400)
    }
    if(err.name === "CastError"){
        customerror = new CustomError("Please use valid id " , 400)
    }

    res.status(customerror.status || 500).json({success : false , message : customerror.message})
}

module.exports = customErrorHandler;