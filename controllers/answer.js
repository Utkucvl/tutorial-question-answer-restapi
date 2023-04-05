const Question = require("../models/Question");
const Answer = require("../models/Answer")
const User = require("../models/User");
const CustomError = require("../helpers/error/CustomError");
const expressHandlerWrapper = require("express-async-handler");

const addNewAnswerToQuestion = expressHandlerWrapper(async (req,res,next) => {
    const information = req.body ;

    const {question_id} = req.params;

    const user_id = req.user.id;

    const answer = await Answer.create({
        ...information,
        user : user_id,
        question : question_id

    })

    return res.status(200).json({success:true,data:answer})

})

const getAllAnswers = expressHandlerWrapper(async (req,res,next) => {
    const {question_id} = req.params;

    const question = await Question.findById(question_id).populate("answers");

    const answers = question.answers ;

    return res.status(200).json({success:true,count:answers.length,data:answers})

})

const getSingleAnswer = expressHandlerWrapper(async (req,res,next) => {
    const {answer_id} = req.params;

    const answer = await Answer.findById(answer_id).populate({path:"question",select:"title"}).populate({path : "user" , select : "name profile_image"})
    ;

    

    return res.status(200).json({success:true,data:answer})

})

const editAnswer = expressHandlerWrapper(async (req,res,next) => {
    const {content} = req.body ;

    const answerId = req.params.answer_id;

    const answer = await Answer.findById(answerId);

    answer.content = content;

    await answer.save();

    return res.status(200).json({success:true,data: answer})

   

})

const deleteAnswer = expressHandlerWrapper(async (req,res,next) => {
    const {question_id} = req.params ;

    const {answer_id} = req.params;

    await Answer.findByIdAndRemove(answer_id);

    const question = await Question.findById(question_id)

    const index = question.answers.indexOf(answer_id);

    question.answers.splice(index,1)
    question.answerCount = question.answers.length;

    await question.save();


    return res.status(200).json({success:true,message : "Deleting operation is successful"})

   

})

const likeAnswer = expressHandlerWrapper(async (req,res,next) => {
    const {answer_id} = req.params;
 
    const answer = await Answer.findById(answer_id);
 
    if(answer.likes.includes(req.user.id)){
     return next(new CustomError("You already liked this answer ",400))
    }
    answer.likes.push(req.user.id);
    
 
    await answer.save();
 
    return res.status(200).json({success:true , data : answer});
  
 })
 
 const undoLikeAnswer = expressHandlerWrapper(async (req,res,next) => {
     const {answer_id} = req.params;
  
     const answer = await Answer.findById(answer_id);
  
     if(!answer.likes.includes(req.user.id)){
      return next(new CustomError("You can not undo like for this answer ",400))
     }
     
     const index = answer.likes.indexOf(req.user.id)
 
     answer.likes.splice(index,1)
  
     await answer.save();
  
     return res.status(200).json({success:true , data : answer});
   
  })

module.exports = {addNewAnswerToQuestion,getAllAnswers,getSingleAnswer,editAnswer,deleteAnswer,undoLikeAnswer,likeAnswer};
