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
// // Controller to create a new user step by step
// const createUserStep1 = asyncHandler (async (req: IUserRequest, res: Response, _next: NextFunction) => {
//   try {
//     const { firstName, lastName } = req.body;
//     // Create a new user with first name and last name
//     const newUser = new User({
//       firstName,
//       lastName,
//     });
//     const createdUser = await newUser.save();
//     res.status(201).json({
//       success: true,
//       data: {
//         message: 'Step 1 completed. Proceed to the next step.',
//         //user: createdUser
//         userId: createdUser._id,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       error: 'Error creating user' + (error as Error).message,
//     });
//   }
// });
// const confirmEmailStep2 = asyncHandler(async (req: IUserRequest, res: Response, _next: NextFunction) => {
//   try {
//     const userId = req.params.userId;
//     const { email } = req.body;
//     const user = await User.findById(userId);
//     if (!user) {
//       res.status(404).json({
//         success: false,
//         error: 'User not found',
//       });
//     }
//     // Check if the provided email already exists in the database
//     const existingUser = await User.findOne({ email });
//     if (existingUser && existingUser._id.toString() !== userId) {
//       res.status(400).json({
//         success: false,
//         error: 'Email already exists',
//       });
//     }
//     // Update user's email
//     if(user){
//       user.email = email;
//       await user.save();
//     res.status(200).json({
//       success: true,
//       data: {
//         message: `Using ${user.email} Sign Up. Proceed to the next step.`,
//         user,
//       },
//     });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       error: 'Error confirming email',
//     });
//   }
// });
// const continueSignupStep3 = asyncHandler(async (req: IUserRequest, res: Response, _next: NextFunction) => {
//   try {
//     const { phoneNumber, password, confirmPassword } = req.body;
//     const userId = req.params.userId;
//     // Find the user by ID
//     const user = await User.findById(userId);
//     if (!user) {
//       res.status(404).json({
//         success: false,
//         error: 'User not found',
//       });
//     }
//     // Validate phoneNumber
//     if (!phoneNumber) {
//       res.status(400).json({
//         success: false,
//         error: 'Phone number is required',
//       });
//     }
//     // Check if the phoneNumber already exists for another user
//     const existingUserWithPhoneNumber = await User.findOne({ phoneNumber });
//     if (existingUserWithPhoneNumber && existingUserWithPhoneNumber._id.toString() !== userId) {
//       res.status(400).json({
//         success: false,
//         error: 'Phone number is already in use by another user',
//       });
//     }
//     // Validate password
//     if (password !== confirmPassword) {
//       res.status(400).json({
//         success: false,
//         error: 'Passwords do not match',
//       });
//     }
//     // Update user information
//     if (user) {
//       user.phoneNumber = phoneNumber;
//       user.password = password;
//       await user.save();
//     }
//     res.status(200).json({
//       success: true,
//       data: {
//         message: 'Step 3 completed. Proceed to the next step.',
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       error: 'Error step 3',
//     });
//   }
// });
// // Controller for Step 3: Choose Gender
// const chooseGenderStep4 = asyncHandler (async (req: IUserRequest, res: Response, _next: NextFunction) => {
//     try {
//       const { gender } = req.body;
//       const userId = req.params.userId;
//       // Find the user by ID
//       const user = await User.findById(userId);
//       if (!user) {
//          res.status(404).json({
//           success: false,
//           error: 'User not found',
//         });
//       }
//      // Validate and update user gender
//     if (!gender || ![Gender.Male, Gender.Female, Gender.PreferredNotToSay].includes(gender)) {
//       res.status(400).json({
//         success: false,
//         error: 'Invalid gender selection',
//       });
//     }
//     if(user){
//         user.gender = gender;
//     await user.save();
//     }
//       res.status(200).json({
//         success: true,
//         data: {
//           message: 'Step 4 completed. Proceed to the next step.',
//         },
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({
//         success: false,
//         error: 'Error in Step 4',
//       });
//     }
// });
// // Controller for Step 5: Provide City Location
// const provideCityLocationStep5 = asyncHandler(async (req: IUserRequest, res: Response, _next: NextFunction) => {
//   try {
//     const { city } = req.body;
//     const userId = req.params.userId;
//     const user = await User.findById(userId);
//     if (!user) {
//      res.status(404).json({
//         success: false,
//         error: 'User not found',
//       });
//     }
//     if (!city) {
//        res.status(400).json({
//         success: false,
//         error: 'City is required',
//       });
//     }
//     const { latitude, longitude } = await searchCityLocation(city);
//     if (user) {
//       user.city = {
//         city,
//         latitude,
//         longitude,
//       };
//       await user.save();
//       res.status(200).json({
//         success: true,
//         data: {
//           message: 'Step 5 completed. Proceed to the next step.',
//           user,
//         },
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       error: 'Error in Step 5',
//     });
//   }
// });
// const provideUsernameStep6 = asyncHandler(async (req: IUserRequest, res: Response, _next: NextFunction) => {
//   try {
//     const { username } = req.body;
//     const userId = req.params.userId;
//     // Find the user by ID
//     const user = await User.findById(userId);
//     if (!user) {
//       res.status(404).json({
//         success: false,
//         error: 'User not found',
//       });
//     }
//     // Validate and update user username
//     if (!username) {
//       const existingUserWithUsername = await User.findOne({ username });
//       if (existingUserWithUsername) {
//         res.status(409).json({
//           success: false,
//           error: 'Username is already in use',
//         });
//       }
//       // If username is not provided, suggest a new username based on first name and last name
//       const suggestedUsername = generateSuggestedUsername(user!.firstName, user!.lastName);
//       user!.username = suggestedUsername;
//     } else {
//       // If username is provided, check if it's already in use
//       const existingUserWithUsername = await User.findOne({ username });
//       if (existingUserWithUsername) {
//        res.status(409).json({
//           success: false,
//           error: 'Username is already in use',
//         });
//       }
//       user!.username = username;
//     }
//     await user!.save();
//     res.status(200).json({
//       success: true,
//       data: {
//         message: 'Step 6 completed. Proceed to the next step.',
//         user,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       error: 'Error in Step 6',
//     });
//   }
// });
// const selectEventTypesStep7 = asyncHandler(async (req: IUserRequest, res: Response, _next: NextFunction) => {
//     try {
//       const { eventTypes } = req.body;
//       const userId = req.params.userId;
//       // Find the user by ID
//       const user = await User.findById(userId);
//       if (!user) {
//         res.status(404).json({
//           success: false,
//           error: 'User not found',
//         });
//       }
//       // Validate and update user event types
//       if (!eventTypes || !Array.isArray(eventTypes) || eventTypes.length === 0) {
//         res.status(400).json({
//           success: false,
//           error: 'Please select at least one event type',
//         });
//       }
//       if (user) {
//         user.eventType = eventTypes;
//         await user.save();
//       }
//       res.status(200).json({
//         success: true,
//         data: {
//           message: 'Signup process is now complete. Thanks',
//         },
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({
//         success: false,
//         error: 'Error in Step 7',
//       });
//     }
// });
const createUser = (0, express_async_handler_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, phoneNumber, password, gender, city, eventType } = req.body;
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
        // Validate password
        // if (password !== confirmPassword) {
        //   res.status(400).json({
        //     success: false,
        //     error: 'Passwords do not match',
        //   });
        //   return;
        // }
        // Validate gender
        if (![genderOption_1.default.Male, genderOption_1.default.Female, genderOption_1.default.PreferredNotToSay].includes(gender)) {
            res.status(400).json({
                success: false,
                error: 'Invalid gender selection',
            });
            return;
        }
        // Generate a suggested username
        let username = (0, generateusername_1.default)(firstName, lastName);
        // Check if the generated username already exists in the database
        let isUsernameTaken = true;
        while (isUsernameTaken) {
            const existingUserByUsername = yield users_1.default.findOne({ username });
            if (!existingUserByUsername) {
                // Username is not taken, break the loop
                isUsernameTaken = false;
            }
            else {
                // Generate a new username and check again
                username = (0, generateusername_1.default)(firstName, lastName);
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
            eventType,
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
        // Find the user by either email, username, or phoneNumber
        const user = yield users_1.default.findOne({
            $or: [
                { email: identifier },
                { username: identifier },
                { phoneNumber: isNaN(identifier) ? undefined : identifier },
            ],
        }).select("+password");
        if (!user) {
            console.log('User not found');
            res.status(401).json({
                success: false,
                error: 'Invalid email, username, or password',
            });
        }
        console.log('Stored Hashed Password:', user === null || user === void 0 ? void 0 : user.password);
        const isPasswordMatch = yield (user === null || user === void 0 ? void 0 : user.comparePassword(password));
        if (!isPasswordMatch) {
            console.log('Authentication Failed');
            res.status(401).json({
                success: false,
                error: 'Invalid email, username, or password',
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
        const { email, password, phoneNumber, firstName, lastName } = req.body;
        const user = yield users_1.default.findOne({ email }).select("+password");
        if (!user) {
            res.status(400).json({
                success: false,
                error: "User not found",
            });
            return;
        }
        const isPasswordValid = yield user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(400).json({
                success: false,
                error: "please provide the correct information",
            });
            return;
        }
        user.firstName = firstName;
        user.email = email;
        user.phoneNumber = phoneNumber;
        user.lastName = lastName;
        yield user.save();
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
        if (req.body.newPassword !== req.body.confirmPassword) {
            res.status(400).json({
                success: false,
                error: "Password doesn't match with each other!",
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
//@access Admin
const deleteUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield users_1.default.findById(req.params.id);
        if (!user) {
            res.status(400).json({
                success: false,
                error: "User is not available with this Id",
            });
        }
        yield users_1.default.findByIdAndDelete(req.params.id);
        res.status(201).json({
            success: true,
            message: "User deleted successfully!",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || "Internal Server Error"
        });
    }
}));
exports.deleteUser = deleteUser;
