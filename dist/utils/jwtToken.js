"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// create a token and save that in cookies
const sendToken = (user, statusCode, res) => {
    const token = user.getJwtToken();
    //the option for cookies
    const option = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: "none",
        secure: true,
    };
    res.status(statusCode).cookie("token", token, option).json({
        success: true,
        user,
        token
    });
};
exports.default = sendToken;
