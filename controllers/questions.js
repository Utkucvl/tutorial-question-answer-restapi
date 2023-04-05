const Question = require("../models/Question");
const CustomError = require("../helpers/error/CustomError");
const expressHandlerWrapper = require("express-async-handler");

const askNewQuestion = expressHandlerWrapper(async (req,res,next) => {
    const information = req.body ;
    
    const question = await Question.create({
        ...information,
        user : req.user.id 
    })
    res.status(200).json({success: true , data: question })
})
const getAllQuestions = expressHandlerWrapper(async (req,res,next) => {
    // const questions = await Question.find().where({title : "Question 3-title"})

    res.status(200).json(res.queryResult)
})
const getSingleQuestion = expressHandlerWrapper(async (req,res,next) => {
   

    return res.status(200).json(res.queryResult);
})

const editQuestion = expressHandlerWrapper(async (req,res,next) => {
    const {id} = req.params;

    const {title,content}  = req.body;

    
    let question = await Question.findById(id);

    question.title = title;
    question.content = content;

    question = await question.save();

    return res.status(200).json({success:true,data : question});
 
})

const deleteQuestion = expressHandlerWrapper(async (req,res,next) => {
    const {id} = req.params;

    await Question.findByIdAndDelete(id);

    

    return res.status(200).json({success:true, message: "Question delete operation is successful"});
 
})

const likeQuestion = expressHandlerWrapper(async (req,res,next) => {
   const {id} = req.params;

   const question = await Question.findById(id);

   if(question.likes.includes(req.user.id)){
    return next(new CustomError("You already liked this question ",400))
   }
   question.likes.push(req.user.id);
   question.likeCount = question.likes.length;

   await question.save();

   return res.status(200).json({success:true , data : question});
 
})

const undoLikeQuestion = expressHandlerWrapper(async (req,res,next) => {
    const {id} = req.params;
 
    const question = await Question.findById(id);
 
    if(!question.likes.includes(req.user.id)){
     return next(new CustomError("You can not undo like for this question ",400))
    }
    
    const index = question.likes.indexOf(req.user.id)

    question.likes.splice(index,1)
    question.likeCount = question.likes.length;
 
    await question.save();
 
    return res.status(200).json({success:true , data : question});
  
 })

module.exports = {askNewQuestion,getAllQuestions,getSingleQuestion,editQuestion,deleteQuestion,likeQuestion,undoLikeQuestion};