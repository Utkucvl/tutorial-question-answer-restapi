const mongoose = require("mongoose");
const Question = require("../models/Question")

const Schema = mongoose.Schema;

AnswerSchema  = new Schema({
    content : {
        type : String ,
        required : [true,"Please provide a valid content"],
        minlenght : [10,"Please provide a content which has at least 10 words"]

    },
    createdAt : {
        type : Date ,
        default : Date.now
    },
    likes : [{
        type: mongoose.Schema.ObjectId,
        ref : "User"
    }],
    question : [{
        type : mongoose.Schema.ObjectId,
        ref : "Question",
        required: true 
    }],
    user : {
        type : mongoose.Schema.ObjectId,
        ref : "User"
    }
})
AnswerSchema.pre("save",async function(next){
    if(!this.isModified("user")){
        return next();
    }

    try{
        const question = await Question.findById(this.question)

        question.answers.push(this._id)
        question.answerCount = question.answers.length;
    
        await question.save();
    
        next();
    }
    catch(err){
        return next(err)
    }
})

module.exports = mongoose.model("Answer",AnswerSchema);