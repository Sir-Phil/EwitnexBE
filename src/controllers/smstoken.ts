import bcrypt from 'bcrypt';
import express, { Request, Response } from 'express';
import User from '../schema/users';
import sendVerificationCode  from '../utils/smsServices';


// Step 1: Initiate the password reset process
const forgetPasswordSMS = async (req: Request, res: Response) => {
  const { phoneNumber } = req.body;

  try {
    // Generate a verification code and send it via SMS
    const verificationCode = await sendVerificationCode(phoneNumber);

    if (!verificationCode) {
      return res.status(500).json({ error: 'Error sending verification code' });
    }

    // Store the code in your database associated with the user's phone number
    // Replace this with your actual database logic
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      // Handle cases where the user is not found
      return res.status(400).json({ error: 'User not found' });
    }

    // Store the user-provided code from Twilio
    user.verificationCode = verificationCode;

    await user.save();

    res.status(200).json({ message: 'Verification code sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error sending verification code' });
  }
};

// Step 2: Verify the verification code and reset the password
const resetPasswordSMS = async (req: Request, res: Response) => {
  const { phoneNumber, verificationCode, newPassword } = req.body;

  try {
    // Retrieve the stored verification code and check if it's valid
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (user.verificationCode === undefined || user.verificationCode !== verificationCode) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    if (user.verificationCodeExpiry && new Date() > user.verificationCodeExpiry) {
      return res.status(400).json({ error: 'Expired verification code' });
    }

    // Reset the user's password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the user's password
    user.password = hashedPassword;

    // Clear the verification code and its expiration time
    user.verificationCode = undefined;
    user.verificationCodeExpiry = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error resetting password' });
  }
};


export {
    forgetPasswordSMS,
    resetPasswordSMS
}
