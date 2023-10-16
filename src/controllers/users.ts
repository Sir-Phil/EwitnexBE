import {Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../schema/users';
import { searchCityLocation } from '../utils/searchCity';
import sendToken from '../utils/jwtToken';
import { IUserRequest } from '../interface/users';
import generateSuggestedUsername from '../utils/generateusername';
import Gender from '../interface/genderOption';
import { isValidEmail, isValidPhoneNumber, isValidUsername } from '../validators/userValidator';


const createUser = asyncHandler(async (req: IUserRequest, res: Response, _next: NextFunction) => {
  try {
    const { firstName, lastName, email, phoneNumber, password, gender, city, interest, providedUsername } = req.body;

    // Check if the provided email already exists in the database
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      res.status(400).json({
        success: false,
        error: 'Email already exists',
      });
      return;
    }

    // Check if the provided phone number already exists in the database
    const existingUserByPhoneNumber = await User.findOne({ phoneNumber });
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
    if (![Gender.Male, Gender.Female, Gender.PreferredNotToSay].includes(gender)) {
      res.status(400).json({
        success: false,
        error: 'Invalid gender selection',
      });
      return;
    }

    let username = providedUsername; // Use provided username if available

    if (!username) {
      // If a username is not provided, generate a suggested username
      username = generateSuggestedUsername(firstName, lastName);

      // Check if the generated username already exists in the database
      let isUsernameTaken = true;
      while (isUsernameTaken) {
        const existingUserByUsername = await User.findOne({ username });
        if (!existingUserByUsername) {
          // Username is not taken, break the loop
          isUsernameTaken = false;
        } else {
          // Generate a new username and check again
          username = generateSuggestedUsername(firstName, lastName);
        }
      }
    }

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      gender,
      username,
      interest,
    });

    // Save the user
    await newUser.save();

    // Use searchCityLocation to update the user's city information
    const { latitude, longitude } = await searchCityLocation(city);

    if (newUser) {
      newUser.city = {
        city,
        latitude,
        longitude,
      };

      await newUser.save();
    }

    res.status(201).json({
      success: true,
      data: {
        message: 'User created successfully',
        user: newUser,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Error creating user',
    });
  }
});





// @Desc Get log-in user
// @Route /api/users/login-user
// @Method GET


const loginUser = asyncHandler(async (req: IUserRequest, res: Response, _next: NextFunction) => {
  try {
    const { identifier, password } = req.body;

    let user;

    if (isValidEmail(identifier)) {
      user = await User.findOne({ email: identifier }).select("+password");
    } else if (isValidPhoneNumber(identifier)) {
      user = await User.findOne({ phoneNumber: identifier }).select("+password");
    } else if (isValidUsername(identifier)) {
      user = await User.findOne({ username: identifier }).select("+password");
    }

    if (!user) {
      let errorMessage = 'Invalid credentials';

      if (isValidEmail(identifier)) {
        errorMessage = 'Invalid email';
      } else if (isValidPhoneNumber(identifier)) {
        errorMessage = 'Invalid phone number';
      } else if (isValidUsername(identifier)) {
        errorMessage = 'Invalid username';
      }

      res.status(401).json({
        success: false,
        error: errorMessage,
      });
    }

    const isPasswordMatch = await user?.comparePassword(password);

    if (!isPasswordMatch) {
      res.status(401).json({
        success: false,
        error: 'Invalid password',
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
      const user = await User.findById(req.user.id).select("-password");
     
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
      const user = await User.findById(req.params.id).select("-password")

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
  createUser,
  loginUser,
  getLoggedInUser,
  logOutUser,
  updateUserInfo,
  UpdateUserPassword,
  getUserDetails,
  deleteUser
};
