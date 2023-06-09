const express = require("express");

const {getAccessToRoute,getAnswerOwnerAccess} = require("../middlewares/authorization/auth");

const {addNewAnswerToQuestion,getAllAnswers,getSingleAnswer,editAnswer,deleteAnswer,likeAnswer,undoLikeAnswer} = require("../controllers/answer")

const {checkQuestionAndAnswerExist} = require("../middlewares/database/databaseErrorHelpers")

const router = express.Router({mergeParams:true});

router.post("/",getAccessToRoute,addNewAnswerToQuestion);
router.get("/",getAllAnswers);
router.get("/:answer_id",checkQuestionAndAnswerExist,getSingleAnswer);
router.get("/:answer_id/edit",[checkQuestionAndAnswerExist,getAccessToRoute,getAnswerOwnerAccess],editAnswer);
router.delete("/:answer_id/delete",[checkQuestionAndAnswerExist,getAccessToRoute,getAnswerOwnerAccess],deleteAnswer);
router.get("/:answer_id/like",[checkQuestionAndAnswerExist,getAccessToRoute],likeAnswer);
router.get("/:answer_id/undo_like",[checkQuestionAndAnswerExist,getAccessToRoute],undoLikeAnswer);


module.exports = router ;