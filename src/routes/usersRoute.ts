import express from "express";
import {
    UpdateUserPassword,
     chooseGenderStep4, 
    confirmEmailStep2, 
    continueSignupStep3,
     createUserStep1, 
     deleteUser, 
     getLoggedInUser, 
     getUserDetails, 
     logOutUser, 
     loginUser, 
     provideCityLocationStep5, 
     provideUsernameStep6, 
     selectEventTypesStep7, 
     updateUserInfo
    } from "../controllers/users";
import { isAuthenticated } from "../middleware/auth";

const router = express.Router();

router.post("/create",createUserStep1 );
router.post("/s2/:userId",confirmEmailStep2);
router.post("/s3/:userId", continueSignupStep3);
router.post("/s4/:userId", chooseGenderStep4);
router.post("/s5/:userId", provideCityLocationStep5);
router.post("/s6/:userId",provideUsernameStep6);
router.post("/s7/:userId", selectEventTypesStep7);
router.post("/login", loginUser);
router.get("/load-user", isAuthenticated, getLoggedInUser);
router.get("/logout", logOutUser);
router.get("/user-details/:id", getUserDetails)
router.put("/update-user", isAuthenticated, updateUserInfo);
router.put("/update-user-password", isAuthenticated, UpdateUserPassword);
router.delete("/delete-user/:id", deleteUser);


export default router