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
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const genderOption_1 = __importDefault(require("../interface/genderOption"));
const eventCategories_1 = require("../interface/eventCategories");
const userSchema = new mongoose_1.default.Schema({
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
        enum: Object.values(genderOption_1.default)
    },
    interests: {
        type: [{ type: String, enum: Object.values(eventCategories_1.Category) }],
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
    verificationCode: {
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
    codeExpiration: Date,
    verificationCodeExpiry: Date,
    resetPasswordToken: String,
    resetPasswordTime: Date,
}, {
    timestamps: true
});
//Hash password
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password")) {
            next();
        }
        try {
            const hashedPassword = yield bcryptjs_1.default.hash(this.password, 10);
            this.password = hashedPassword;
            next();
        }
        catch (error) {
            next(error);
        }
    });
});
//jwt token
userSchema.methods.getJwtToken = function () {
    const user = this;
    return jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};
//compare password
userSchema.methods.comparePassword = function (enteredPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        return yield bcryptjs_1.default.compareSync(enteredPassword, user.password);
    });
};
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
