"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("../controllers/users");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/create-user", users_1.createUser);
router.post("/login", users_1.loginUser);
router.get("/load-user", auth_1.isAuthenticated, users_1.getLoggedInUser);
router.get("/logout", users_1.logOutUser);
router.get("/user-details/:id", users_1.getUserDetails);
router.put("/update-user", auth_1.isAuthenticated, users_1.updateUserInfo);
router.put("/update-user-password", auth_1.isAuthenticated, users_1.UpdateUserPassword);
router.delete("/delete-user/:id", users_1.deleteUser);
exports.default = router;
