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
router.get("/user-details/:id", getUserDetails)
router.put("/update-user", isAuthenticated, updateUserInfo);
router.put("/update-user-password", isAuthenticated, UpdateUserPassword);
router.delete("/delete-user/:id", isAuthenticated, deleteUser);


export default router