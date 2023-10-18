import {Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../schema/users';
import crypto from "crypto";
import sendMail from '../utils/sendMail';
import { IUserRequest } from '../interface/users';

// @Desc Request for forget password
// @Route /api/auth/rest-password-mail
// @Method POST
const forgetPassword =  asyncHandler(async(req: IUserRequest, res: Response, next: NextFunction) => {
    const { email } = req.body;
  
    try {
      const token = crypto.randomBytes(20).toString('hex');
  
      const user = await User.findOne({ email });
      if(!user){
        res.status(400).json({error: "User not found"});
    
      }
    
      if(user){
        user.resetPasswordToken = token;
        user.resetPasswordTime = new Date(Date.now() + 3600000);
        await user?.save()                                                                                                   
      }else{
        res.status(404).json({
          success: false,
          message: "user not found"
        })
      }
      
      try {
        await sendMail({
              email: user?.email,
              subject: "Password Reset",
              message: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n`
              + `Please click on the following link or paste it into your browser to complete the process:\n\n`
              + `http://localhost:9823/api/reset/${token}\n\n`
              + `If you did not request this, please ignore this email and your password will remain unchanged.\n`
        });
        res.status(201).json({
          success: true,
          message: `Email sent :- ${user?.email} with password reset instructions.`,
        });
      } catch (error : any) {
        res.status(500).json({
          success: false,
          error: error.message || "An Error occurred" ,
        });
      };
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || "Internal Server Error" ,
      })
    };
  });  

// @Desc Get for mail token password
// @Route /api/auth/reset/:token
// @Method Get
// const receiveTokeReset  = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const token = req.params.token;

//   const user = await User.findOne({
//     resetPasswordToken: token,
//     resetPasswordTime: {$gt: Date.now()}
//   });

//   if(!user){
//     res.status(400).json({
//         error: "Password reset token is invalid or has expired",
//     });
//     res.status(200).json({ success: true, token: token });  
// }
//   } catch (error) {
//     res.status(500).json({
//         error: "An Error Occurred"
//     });
//   }
// })

const receiveTokeReset = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.params.token;
  
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordTime: { $gt: Date.now() },
      });
  
      if (!user) {
        res.status(400).json({
          error: "Password reset token is invalid or has expired",
        });
      } else {
        // If the user is found, respond with a 200 status and the token
        res.status(200).json({ success: true, token: token });
      }
    } catch (error) {
      res.status(500).json({
        error: "An Error Occurred",
      });
    }
  });
  

// @Desc validate password and send
// @Route /api/auth/reset/:token
// @Method POST
const resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction)=> {
    const token = req.params.token;
    const newPassword = req.body.newPassword;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordTime: {$gt: Date.now()},
        });
    
        if(!user){
            res.status(400).json({
                error: "Password reset token is invalid or has expired."
            })
        }
    
       if(user){
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTime = undefined;
    
        await user?.save();
       }
    
       res.json({
        message: "Password has been successfully reset.",
       })
    } catch (error) {
        res.status(500).json({
            error:
            "An Error Occurred"
        })
    }

})

export {
    forgetPassword,
    resetPassword,
    receiveTokeReset
}