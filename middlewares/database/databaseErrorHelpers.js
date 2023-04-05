const User = require("../../models/User");
const Question = require("../../models/Question")
const CustomError = require("../../helpers/error/CustomError");
const expressHandlerWrapper = require("express-async-handler");
const Answer = require("../../models/Answer")

const checkUserExist = expressHandlerWrapper(async (req,res,next) => {

    const {id} = req.params;

    const user = await User.findById(id)

    if(!user){
        return next(new CustomError("There is no such that user",400))
    }
    next();

});

const checkQuestionExist = expressHandlerWrapper(async (req,res,next) => {

    const question_id = req.params.id || req.params.question_id;

    const question = await Question.findById(question_id)

    if(!question){
        return next(new CustomError("There is no such that question",400))
    }
    next();

});

const checkQuestionAndAnswerExist = expressHandlerWrapper(async (req,res,next) => {

    const question_id = req.params.question_id;

    const answer_id = req.params.answer_id;

    const answer = await Answer.findOne({
        _id : answer_id,
        question : question_id
    })

    if(!answer){
        return next(new CustomError("There is no such that answer",400))
    }
    next();

});

module.exports = {checkUserExist,checkQuestionExist,checkQuestionAndAnswerExist}