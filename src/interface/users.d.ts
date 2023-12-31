import { Request } from "express"
import mongoose from "mongoose"
import { Category} from "./eventCategories";
import { Gender } from "./genderOption";

export interface IUserRequest extends Request {
    user?: any;
}

export interface IUser extends mongoose.Document {
    firstName: string;
    lastName:string;
    age: string;
    gender: typeof Gender;
    interests: typeof Category;
    email: string;
    password: string;
    avatar: string;
    phoneNumber: number;
    address: string;
    location: string;
    verificationCode: string | number | undefined;
    codeExpiration: Date | undefined;
    city: {
        city: string;
        latitude: number;
        longitude: number;
      };
    username: string;
    isAdmin: boolean;
    isEventOrganizer: boolean;
    createdAt: Date;
    updatedAt: Date;
    verificationCodeExpiry: Date | undefined;
    resetPasswordToken?: string;
    resetPasswordTime?: Date;
    comparePassword(enteredPassword: string): Promise<Boolean>;
    getJwtToken(): string;
}
