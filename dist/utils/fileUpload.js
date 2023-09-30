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
exports.uploadPDFToCloudinary = exports.uploadImageToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadImageToCloudinary = (file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileBufferAsString = file.buffer.toString('base64');
        const result = (yield cloudinary_1.v2.uploader.upload(`data:image/png;base64,${fileBufferAsString}`, {
            folder: 'uploads',
            max_file_size: 50000000,
            quality: 'auto:best',
            fetch_format: 'auto',
        }));
        if (!result.url || !result.public_id) {
            throw new Error('Failed to upload image to Cloudinary');
        }
        return {
            url: result.url,
            public_id: result.public_id,
        };
    }
    catch (error) {
        throw new Error('Error uploading image to Cloudinary');
    }
});
exports.uploadImageToCloudinary = uploadImageToCloudinary;
const uploadPDFToCloudinary = (file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileBufferAsString = file.buffer.toString('base64');
        const result = (yield cloudinary_1.v2.uploader.upload(`data:${file.mimetype};base64,${fileBufferAsString}`, {
            folder: 'uploads',
            max_file_size: 50000000, // 50mb size
        }));
        if (!result.url || !result.public_id) {
            throw new Error('Failed to upload file to Cloudinary');
        }
        return {
            url: result.url,
            public_id: result.public_id,
        };
    }
    catch (error) {
        throw new Error('Error uploading file to Cloudinary');
    }
});
exports.uploadPDFToCloudinary = uploadPDFToCloudinary;
const deleteImageFromCloudinary = (public_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cloudinary_1.v2.uploader.destroy(public_id);
        return result.result === 'ok';
    }
    catch (error) {
        console.error(error);
        throw new Error('Error deleting image from Cloudinary');
    }
});
const updateImageOnCloudinary = (public_id, newFile) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteResult = yield deleteImageFromCloudinary(public_id);
        if (deleteResult) {
            const newImageUrl = yield uploadImageToCloudinary(newFile);
            return newImageUrl;
        }
        else {
            throw new Error('Failed to delete old image from Cloudinary');
        }
    }
    catch (error) {
        console.error(error);
        throw new Error('Error updating image on Cloudinary');
    }
});
