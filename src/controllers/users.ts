import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import User from '../schema/users';
import { searchCityLocation } from '../utils/searchCity';
import generateSuggestedUsername from '../utils/generateusername';
import Gender from '../interface/genderOption';
import sendToken from '../utils/jwtToken';

// Controller to create a new user step by step
const createUserStep1 = asyncHandler (async (req: Request, res: Response, _next: NextFunction) => {
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

const confirmEmailStep2 = asyncHandler (async (req: Request, res: Response, next: NextFunction) => {
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
  
      // Update user's email
      if(user){
        user.email = email;
        await user.save();
      }
     
  
      res.status(200).json({
        success: true,
        data: {
          message: 'Step 2 completed. Proceed to the next step.',
          user,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: 'Error confirming email',
      });
    }
});
  
  
const continueSignupStep3 = asyncHandler (async (req: Request, res: Response, next: NextFunction) => {
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
  
      // Validate password
      if (password !== confirmPassword) {
         res.status(400).json({
          success: false,
          error: 'Passwords do not match',
        });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Update user information
      if(user){
        user.phoneNumber = phoneNumber;
        user.password = hashedPassword;
    
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
const chooseGenderStep4 = asyncHandler (async (req: Request, res: Response, next: NextFunction) => {
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
const provideCityLocationStep5 = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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



const provideUsernameStep6 = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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
      res.status(400).json({
        success: false,
        error: 'Username is required',
      });
    }

    // Check if the provided username is already taken
    const existingUserWithUsername = await User.findOne({ username });
    if (existingUserWithUsername) {
      res.status(409).json({
        success: false,
        error: 'Username is already in use',
      });
    }

    // If username is not provided, suggest a new username based on first name and last name
    if(user){
        if (!username) {
            const suggestedUsername = generateSuggestedUsername(user.firstName, user.lastName);
            user.username = suggestedUsername;
          } else {
            user.username = username;
          }
      
          await user.save();
    }
    

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


const selectEventTypesStep7 = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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
  

  
  


const loginUser = asyncHandler (async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
  
      if (!user || !(await user.comparePassword(password))) {
        res.status(401).json({
          success: false,
          error: 'Invalid email or password',
        });
      }
  
      sendToken(user, 201, res)
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: 'Error logging in',
      });
    }
  });
  

export {
  createUserStep1,
  confirmEmailStep2,
  continueSignupStep3,
  chooseGenderStep4,
  provideUsernameStep6,
  provideCityLocationStep5,
  selectEventTypesStep7,
  
  
};
