import multer, { Multer } from "multer";
import { Request, Response, NextFunction } from "express";


declare namespace Express {
  export interface Request {
    file: Express.Multer.File; // Use the appropriate type from multer's typings
  }
}
