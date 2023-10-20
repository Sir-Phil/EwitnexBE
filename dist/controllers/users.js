"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getUserDetails = exports.UpdateUserPassword = exports.updateUserInfo = exports.logOutUser = exports.getLoggedInUser = exports.loginUser = exports.createUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const users_1 = __importDefault(require("../schema/users"));
const searchCity_1 = require("../utils/searchCity");
const jwtToken_1 = __importDefault(require("../utils/jwtToken"));
const generateusername_1 = __importDefault(require("../utils/generateusername"));
const genderOption_1 = __importDefault(require("../interface/genderOption"));
const userValidator_1 = require("../validators/userValidator");
const createUser = (0, express_async_handler_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, phoneNumber, password, gender, city, interests, providedUsername } = req.body;
        // Check if the provided email already exists in the database
        const existingUserByEmail = yield users_1.default.findOne({ email });
        if (existingUserByEmail) {
            res.status(400).json({
                success: false,
                error: 'Email already exists',
            });
            return;
        }
        // Check if the provided phone number already exists in the database
        const existingUserByPhoneNumber = yield users_1.default.findOne({ phoneNumber });
        if (existingUserByPhoneNumber) {
            res.status(400).json({
                success: false,
                error: 'Phone number is already in use by another user',
            });
            return;
        }
        // Validate gender
        if (![genderOption_1.default.Male, genderOption_1.default.Female, genderOption_1.default.PreferredNotToSay].includes(gender)) {
            res.status(400).json({
                success: false,
                error: 'Invalid gender selection',
            });
            return;
        }
        let username = providedUsername; // Use provided username if available
        let suggestedUsernames = [];
        if (!username) {
            // If a username is not provided, generate a suggested username
            suggestedUsernames = (0, generateusername_1.default)(firstName, lastName, 3);
            // Check if the generated username already exists in the database
            for (const suggestedUsername of suggestedUsernames) {
                const existingUserByUsername = yield users_1.default.findOne({ username: suggestedUsername });
                if (!existingUserByUsername) {
                    username = suggestedUsername;
                    break;
                }
            }
            if (!username) {
                res.status(400).json({
                    success: false,
                    error: 'All suggested usernames are already taken. Please provide a custom username.',
                });
                return;
            }
        }
        // Create a new user
        const newUser = new users_1.default({
            firstName,
            lastName,
            email,
            phoneNumber,
            password,
            gender,
            username,
            interests,
        });
        // Save the user
        yield newUser.save();
        // Use searchCityLocation to update the user's city information
        const { latitude, longitude } = yield (0, searchCity_1.searchCityLocation)(city);
        if (newUser) {
            newUser.city = {
                city,
                latitude,
                longitude,
            };
            yield newUser.save();
        }
        res.status(201).json({
            success: true,
            data: {
                message: 'User created successfully',
                user: newUser,
                suggestedUsernames,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Error creating user',
        });
    }
}));
exports.createUser = createUser;
// @Desc Get log-in user
// @Route /api/users/login-user
// @Method GET
const loginUser = (0, express_async_handler_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { identifier, password } = req.body;
        let user;
        if ((0, userValidator_1.isValidEmail)(identifier)) {
            user = yield users_1.default.findOne({ email: identifier }).select("+password");
        }
        else if ((0, userValidator_1.isValidPhoneNumber)(identifier)) {
            user = yield users_1.default.findOne({ phoneNumber: identifier }).select("+password");
        }
        else if ((0, userValidator_1.isValidUsername)(identifier)) {
            user = yield users_1.default.findOne({ username: identifier }).select("+password");
        }
        if (!user) {
            let errorMessage = 'Invalid credentials';
            if ((0, userValidator_1.isValidEmail)(identifier)) {
                errorMessage = 'Invalid email';
            }
            else if ((0, userValidator_1.isValidPhoneNumber)(identifier)) {
                errorMessage = 'Invalid phone number';
            }
            else if ((0, userValidator_1.isValidUsername)(identifier)) {
                errorMessage = 'Invalid username';
            }
            res.status(401).json({
                success: false,
                error: errorMessage,
            });
        }
        const isPasswordMatch = yield (user === null || user === void 0 ? void 0 : user.comparePassword(password));
        if (!isPasswordMatch) {
            res.status(401).json({
                success: false,
                error: 'Invalid password',
            });
        }
        // Password match, send the token
        (0, jwtToken_1.default)(user, 201, res);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Error logging in',
        });
    }
}));
exports.loginUser = loginUser;
// @Desc Get Load log-in user
// @Route /api/users/load-user
// @Method GET
const getLoggedInUser = (0, express_async_handler_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield users_1.default.findById(req.user.id).select("-password");
        if (!user) {
            res.status(400).json({
                success: false,
                error: "User does not exist",
            });
        }
        res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        //console.error("Error fetching user data:", error.message);
        res.status(500).json({
            success: false,
            error: "Error fetching user data",
        });
    }
}));
exports.getLoggedInUser = getLoggedInUser;
// @Desc Log out user
// @Route /api/users/logout
// @Method GET
const logOutUser = (0, express_async_handler_1.default)((_req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });
        res.status(201).json({
            success: true,
            message: "Log out successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || "Internal Server Error"
        });
    }
}));
exports.logOutUser = logOutUser;
// @Desc Update profile
// @Route /api/users/update
// @Method PUT
const updateUserInfo = (0, express_async_handler_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, username, gender, phoneNumber, firstName, lastName } = req.body;
        const userId = req.params.userId; // Assuming you have the user ID in the request params.
        // Find the user by ID
        const user = yield users_1.default.findById(userId).select("+email +password");
        if (!user) {
            res.status(404).json({
                success: false,
                error: "User not found",
            });
        }
        if (email !== (user === null || user === void 0 ? void 0 : user.email)) {
            res.status(400).json({
                success: false,
                error: "Changing email during update is not allowed",
            });
        }
        if (user) {
            user.firstName = firstName;
            user.phoneNumber = phoneNumber;
            user.lastName = lastName;
            user.gender = gender;
            user.username = username;
            yield user.save();
        }
        res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || "Internal Server Error",
        });
    }
}));
exports.updateUserInfo = updateUserInfo;
// @Desc Update User password
// @Route /api/users/update-user-password
// @Method Put
const UpdateUserPassword = (0, express_async_handler_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield users_1.default.findById(req.user.id).select("+password");
        const isPasswordMatched = yield (user === null || user === void 0 ? void 0 : user.comparePassword(req.body.oldPassword));
        if (!isPasswordMatched) {
            res.status(400).json({
                success: false,
                error: "Old password is incorrect!",
            });
        }
        user.password = req.body.newPassword;
        yield (user === null || user === void 0 ? void 0 : user.save());
        res.status(200).json({
            success: true,
            message: "Password updated successfully!"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || "Internal Server Error"
        });
    }
}));
exports.UpdateUserPassword = UpdateUserPassword;
// @Desc find User information with the userId
// @Route /api/users/user-info/:id
// @Method GET
//@Access Admin
const getUserDetails = (0, express_async_handler_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield users_1.default.findById(req.params.id).select("-password");
        res.status(201).json({
            success: true,
            user,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || "Internal Server Error"
        });
    }
}));
exports.getUserDetails = getUserDetails;
// @Desc delete User for ---- 
// @Route /api/users/delete-users/:id
// @Method DELETE
//@access User
const deleteUser = (0, express_async_handler_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield users_1.default.findById(req.params.id);
        if (!user) {
            res.status(404).json({
                success: false,
                error: "User is not available with this Id",
            });
        }
        else {
            yield users_1.default.findByIdAndDelete(req.params.id);
            res.status(200).json({
                success: true,
                message: "User deleted successfully!",
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || "Internal Server Error",
        });
    }
}));
exports.deleteUser = deleteUser;
