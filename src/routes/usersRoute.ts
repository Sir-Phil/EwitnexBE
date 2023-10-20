import express from "express";
import {
    UpdateUserPassword,
     createUser,
     deleteUser, 
     getLoggedInUser, 
     getUserDetails, 
     logOutUser, 
     loginUser, 
     updateUserInfo
    } from "../controllers/users";
import { isAuthenticated } from "../middleware/auth";

const router = express.Router();

router.post("/create-user", createUser);
router.post("/login", loginUser);
router.get("/load-user", isAuthenticated, getLoggedInUser);
router.get("/logout", logOutUser);
router.get("/user-details/:userId", getUserDetails)
router.delete("/delete-account/:id", isAuthenticated, deleteUser);
router.put("/update-user/:userId", isAuthenticated, updateUserInfo);
router.put("/update-user-password", isAuthenticated, UpdateUserPassword);


export default router