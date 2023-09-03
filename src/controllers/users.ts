import {Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../schema/users';
import { searchCityLocation } from '../utils/searchCity';
import generateSuggestedUsername from '../utils/generateusername';
import Gender from '../interface/genderOption';
import sendToken from '../utils/jwtToken';
import { IUserRequest } from '../interface/users';

// Controller to create a new user step by step
const createUserStep1 = asyncHandler (async (req: IUserRequest, res: Response, _next: NextFunction) => {
  try {
    const { firstName, lastName } = req.body;

    // Create a new user with first name and last name
    const newUser = new User({
      firstName,
      lastName,
    });

    const createdUser = await newUser.save();

    res.status(201).json({
      success: true,
      data: {
        message: 'Step 1 completed. Proceed to the next step.',
        //user: createdUser
        userId: createdUser._id,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Error creating user' + (error as Error).message,
    });
  }
});

const confirmEmailStep2 = asyncHandler(async (req: IUserRequest, res: Response, _next: NextFunction) => {
  try {
    const userId = req.params.userId;
    const { email } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Check if the provided email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== userId) {
      res.status(400).json({
        success: false,
        error: 'Email already exists',
      });
    }

    // Update user's email
    if(user){
      user.email = email;
      await user.save();

    res.status(200).json({
      success: true,
      data: {
        message: `Using ${user.email} Sign Up. Proceed to the next step.`,
        user,
      },
    });
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Error confirming email',
    });
  }
});

  
const continueSignupStep3 = asyncHandler(async (req: IUserRequest, res: Response, _next: NextFunction) => {
  try {
    const { phoneNumber, password, confirmPassword } = req.body;
    const userId = req.params.userId;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Validate phoneNumber
    if (!phoneNumber) {
      res.status(400).json({
        success: false,
        error: 'Phone number is required',
      });
    }

    // Check if the phoneNumber already exists for another user
    const existingUserWithPhoneNumber = await User.findOne({ phoneNumber });
    if (existingUserWithPhoneNumber && existingUserWithPhoneNumber._id.toString() !== userId) {
      res.status(400).json({
        success: false,
        error: 'Phone number is already in use by another user',
      });
    }

    // Validate password
    if (password !== confirmPassword) {
      res.status(400).json({
        success: false,
        error: 'Passwords do not match',
      });
    }

    // Update user information
    if (user) {
      user.phoneNumber = phoneNumber;
      user.password = password;

      await user.save();
    }

    res.status(200).json({
      success: true,
      data: {
        message: 'Step 3 completed. Proceed to the next step.',
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Error step 3',
    });
  }
});


// Controller for Step 3: Choose Gender
const chooseGenderStep4 = asyncHandler (async (req: IUserRequest, res: Response, _next: NextFunction) => {
    try {
      const { gender } = req.body;
      const userId = req.params.userId;
  
      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
         res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

  
     // Validate and update user gender
    if (!gender || ![Gender.Male, Gender.Female, Gender.PreferredNotToSay].includes(gender)) {
      res.status(400).json({
        success: false,
        error: 'Invalid gender selection',
      });
    }

    if(user){
        user.gender = gender;
    await user.save();
    }
    

  
      res.status(200).json({
        success: true,
        data: {
          message: 'Step 4 completed. Proceed to the next step.',
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: 'Error in Step 4',
      });
    }
});
  

// Controller for Step 5: Provide City Location
const provideCityLocationStep5 = asyncHandler(async (req: IUserRequest, res: Response, _next: NextFunction) => {
  try {
    const { city } = req.body;
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
     res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    if (!city) {
       res.status(400).json({
        success: false,
        error: 'City is required',
      });
    }

    const { latitude, longitude } = await searchCityLocation(city);

    if (user) {
      user.city = {
        city,
        latitude,
        longitude,
      };
    
      await user.save();
    
      res.status(200).json({
        success: true,
        data: {
          message: 'Step 5 completed. Proceed to the next step.',
          user,
        },
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Error in Step 5',
    });
  }
});



const provideUsernameStep6 = asyncHandler(async (req: IUserRequest, res: Response, _next: NextFunction) => {
  try {
    const { username } = req.body;
    const userId = req.params.userId;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Validate and update user username
    if (!username) {
      const existingUserWithUsername = await User.findOne({ username });
      if (existingUserWithUsername) {
        res.status(409).json({
          success: false,
          error: 'Username is already in use',
        });
      }

      // If username is not provided, suggest a new username based on first name and last name
      const suggestedUsername = generateSuggestedUsername(user!.firstName, user!.lastName);
      user!.username = suggestedUsername;
    } else {
      // If username is provided, check if it's already in use
      const existingUserWithUsername = await User.findOne({ username });
      if (existingUserWithUsername) {
       res.status(409).json({
          success: false,
          error: 'Username is already in use',
        });
      }

      user!.username = username;
    }

    await user!.save();
    res.status(200).json({
      success: true,
      data: {
        message: 'Step 6 completed. Proceed to the next step.',
        user,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Error in Step 6',
    });
  }
});


const selectEventTypesStep7 = asyncHandler(async (req: IUserRequest, res: Response, _next: NextFunction) => {
    try {
      const { eventTypes } = req.body;
      const userId = req.params.userId;
  
      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }
  
      // Validate and update user event types
      if (!eventTypes || !Array.isArray(eventTypes) || eventTypes.length === 0) {
        res.status(400).json({
          success: false,
          error: 'Please select at least one event type',
        });
      }
  
      if (user) {
        user.eventType = eventTypes;
        await user.save();
      }
  
      res.status(200).json({
        success: true,
        data: {
          message: 'Signup process is now complete. Thanks',
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: 'Error in Step 7',
      });
    }
});

// @Desc Get log-in user
// @Route /api/users/login-user
// @Method GET

const loginUser = asyncHandler(async (req: IUserRequest, res: Response, _next: NextFunction) => {
    try {
      const { identifier, password } = req.body;
  
      // Find the user by either email, username, or phoneNumber
      const user = await User.findOne({
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
  
      console.log('Stored Hashed Password:', user?.password);
      const isPasswordMatch = await user?.comparePassword(password);
  
      if (!isPasswordMatch) {
        console.log('Authentication Failed');
        res.status(401).json({
          success: false,
          error: 'Invalid email, username, or password',
        });
      }
  
      // Password match, send the token
      sendToken(user, 201, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: 'Error logging in',
      });
    }
});


// @Desc Get Load log-in user
// @Route /api/users/load-user
// @Method GET

const getLoggedInUser = asyncHandler(async (req: IUserRequest, res: Response, _next: NextFunction) => {
  try {
    console.log("User ID:", req.user.id);
      const user = await User.findById(req.user.id);
     
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
  } catch (error: any) {
    //console.error("Error fetching user data:", error.message);
      res.status(500).json({
          success: false,
          error: "Error fetching user data",
      });
  }
});

// @Desc Log out user
// @Route /api/users/logout
// @Method GET

const logOutUser = asyncHandler (async ( _req: Request, res: Response, _next: NextFunction) => {
  try {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(201).json({
        success: true,
        message: "Log out successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error"
  });
  }
});


// @Desc Update profile
// @Route /api/users/update
// @Method PUT
const updateUserInfo = asyncHandler(async(req: Request, res: Response, _next: NextFunction) => {
  try {
      const {email, password, phoneNumber, firstName, lastName} = req.body;
  
      const user = await User.findOne({email}).select("+password");
  
      if(!user){
        res.status(400).json({
          success: false,
          error: "User not found",
      });
      return;
      }
  
      const isPasswordValid = await user.comparePassword(password);
  
      if(!isPasswordValid){
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
  
      await user.save();
  
      res.status(201).json({
          success: true,
          user,
      })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error"    
  });
  }
})

// @Desc Update User password
// @Route /api/users/update-user-password
// @Method Put

const UpdateUserPassword = asyncHandler (async(req: IUserRequest, res: Response, _next: NextFunction) => {
  try {
      const user = await User.findById(req.user.id).select("+password");

      const isPasswordMatched = await user?.comparePassword(
          req.body.oldPassword
      );
  
      if(!isPasswordMatched){
        res.status(400).json({
          success: false,
          error: "Old password is incorrect!",
      });
      
      }
  
      if(req.body.newPassword !== req.body.confirmPassword){
        res.status(400).json({
          success: false,
          error: "Password doesn't match with each other!",
      });
        
      }
      user!.password = req.body.newPassword;
  
      await user?.save();
  
      res.status(200).json({
          success: true,
          message: "Password updated successfully!"
      });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error"    
  });
  }
});


// @Desc find User information with the userId
// @Route /api/users/user-info/:id
// @Method GET
//@Access Admin

const getUserDetails = asyncHandler(async(req: Request, res: Response, _next: NextFunction) => {
  try {
      const user = await User.findById(req.params.id)

      res.status(201).json({
      success: true,
      user,
  });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error"    
  });
  }
})

// @Desc delete User for ---- 
// @Route /api/users/delete-users/:id
// @Method DELETE
//@access Admin
const deleteUser = asyncHandler(async(req:Request, res:Response, next: NextFunction) => {
  try {
      const user = await User.findById(req.params.id);

      if(!user){
        res.status(400).json({
          success: false,
          error: "User is not available with this Id",
      });
      }
  
      await User.findByIdAndDelete(req.params.id);
  
      res.status(201).json({
          success: true,
          message: "User deleted successfully!",
      });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error"    
  });
  }
})


  

export {
  createUserStep1,
  confirmEmailStep2,
  continueSignupStep3,
  chooseGenderStep4,
  provideUsernameStep6,
  provideCityLocationStep5,
  selectEventTypesStep7,
  loginUser,
  getLoggedInUser,
  logOutUser,
  updateUserInfo,
  UpdateUserPassword,
  getUserDetails,
  deleteUser
};
