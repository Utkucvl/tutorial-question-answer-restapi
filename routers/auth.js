const express = require("express");

const {register,login,logout,getUser,imageUpload,forgotPassword,resetPassword,editDetails} = require("../controllers/auth")

const {getAccessToRoute} = require("../middlewares/authorization/auth");

const router =express.Router();

const {profileImageUpload} = require("../middlewares/libraries/profileImageUpload")



router.post("/register" , register)
router.post("/login" , login)
router.get("/logout",getAccessToRoute,logout)
router.get("/profile",getAccessToRoute,getUser)
router.post("/forgotpassword",forgotPassword)
router.put("/resetpassword",resetPassword)
router.get("/upload",[getAccessToRoute,profileImageUpload.single("profile_image")],imageUpload)
router.get("/edit",getAccessToRoute,editDetails)



module.exports = router;
    
