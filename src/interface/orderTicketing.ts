import mongoose, { Schema } from "mongoose";

interface IOrderTicketing extends mongoose.Document {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
}

export const orderTicketSchema = new Schema<IOrderTicketing> ({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
    },
    username: {
        type: String,
    }
});