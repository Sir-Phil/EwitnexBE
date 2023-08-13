import express from "express";
import {
     chooseGenderStep4, 
    confirmEmailStep2, 
    continueSignupStep3,
     createUserStep1, 
     provideCityLocationStep5, 
     provideUsernameStep6, 
     selectEventTypesStep7 
    } from "../controllers/users";

const router = express.Router();

router.post("/create",createUserStep1 );
router.post("/s2/:userId",confirmEmailStep2);
router.post("/s3/:userId", continueSignupStep3);
router.post("/s4/:userId", chooseGenderStep4);
router.post("/s5/:userId", provideCityLocationStep5);
router.post("/s6/:userId",provideUsernameStep6);
router.post("/s7/:userId", selectEventTypesStep7);

export default router