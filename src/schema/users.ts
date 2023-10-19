import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import Gender from "../interface/genderOption";
import { Category } from "../interface/eventCategories";
import { IUser } from "../interface/users";


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [false, "Please enter your name!"]
    },
    lastName: {
        type: String,
        required: [false, "Please enter your name!"]
    },
    age: {
        type: String,
        required: [false, "Please enter your name!"]
    },
    gender: {
        type: String,
        enum: Object.values(Gender)
    },
    interests: { 
        type: [{ type: String, enum: Object.values (Category) }],
          required: false
         },

    email: {
        type: String,
        required: [false, "Please enter your email!"]
    },
    
    password: {
        type: String,
        required: [false, "Please enter your password"],
        select: true
    },

    phoneNumber: {
        type: Number
    },

    isAdmin: {
        type: Boolean,
        default: false,
      },
    isEventOrganizer: {
        type: Boolean,
        default: false,
    },
    avatar: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
      },
      city: {
        type: {
          city: String,
          latitude: Number,
          longitude: Number,
        },
        required: false,
      },
    username: {
        type: String,
        required: false,
        unique: true

      },
    resetPasswordToken: String,
    resetPasswordTime: Date,
},
{
    timestamps: true
}
);

//Hash password
userSchema.pre<IUser>("save", async function (next){
    if(!this.isModified("password")){
        next();
    }
    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;

        next();
    } catch (error : any) {
        next(error);
    }
})


//jwt token
userSchema.methods.getJwtToken = function() {
    const user = this as IUser
    return jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY as string, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};

//compare password
userSchema.methods.comparePassword = async function(enteredPassword: string): Promise<boolean>{
    const user = this as IUser
    return await bcrypt.compareSync(enteredPassword, user.password);
}

const User = mongoose.model<IUser>("User", userSchema);

export default User;