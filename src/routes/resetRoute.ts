import express from "express"
import { forgetPassword, receiveTokeReset, resetPassword } from "../controllers/token";
import { forgetPasswordSMS, resetPasswordSMS } from "../controllers/smstoken";

const router = express.Router();


router.post("/rest-password-mail", forgetPassword);
router.get("/reset/:token", receiveTokeReset);
router.post("/reset/:token", resetPassword); 

router.post("/forget-password", forgetPasswordSMS);
router.post("/reset-password", resetPasswordSMS);


export default router