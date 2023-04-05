const CustomError = require("../../helpers/error/CustomError");
const jwt = require("jsonwebtoken");
const {isTokenIncluded,getAccessTokenFromHeader} = require("../../helpers/authorization/tokenHelper");
 const expressHandlerWrapper =require("express-async-handler");
 const User = require("../../models/User");
 const Question = require("../../models/Question")
 const Answer = require("../../models/Answer")



const getAccessToRoute = (req,res,next) =>{

    const {JWT_SECRET_KEY} = process.env;
    
    if(!isTokenIncluded(req)){
        return next(new CustomError("You are not authorized to access this route " , 401))
    }
    const accesstoken = getAccessTokenFromHeader(req);

    jwt.verify(accesstoken,JWT_SECRET_KEY,(err,decoded) => {
    if(err){
        
        return next(new CustomError("You are not authorized to access this route",401))
        
        }
        req.user  = {
            id: decoded.id,
            name : decoded.name
        }

        
        next();
    })

    

}

 const getAdminAccess = expressHandlerWrapper(async (req,res,next) => {

     const {id} = req.user;

     const user = await User.findById(id);

     if(user.role !== "admin"){
         return next(new CustomError("Only admins can reach this page",403))
     }
     next();
    
 })

 const getQuestionOwnerAccess = expressHandlerWrapper(async (req,res,next) => {

    const userId = req.user.id;
    const questionId = req.params.id

    const question = await Question.findById(questionId);

    if(question.user != userId){
        return next(new CustomError("Only owners can handle this operations",403))
    }
    next();
   
})
const getAnswerOwnerAccess = expressHandlerWrapper(async (req,res,next) => {

    const userId = req.user.id;
    const answerId = req.params.answer_id;

    const answer = await Answer.findById(answerId);

    if(answer.user != userId){
        return next(new CustomError("Only owners can handle this operations",403))
    }
    next();
   
})
module.exports = {getAccessToRoute,getAdminAccess,getQuestionOwnerAccess,getAnswerOwnerAccess}  