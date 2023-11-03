import mongoose, { Schema } from "mongoose";
import { ticketTypeOptions } from "./ticketSelect";
import { ticketHandlerOptions } from "./ticketHandler";
import { refundHandleOption } from "./refundHandler";

interface ITicket extends mongoose.Document{
    ticketType: string;
    ticketName: string;
    ticketPrice: number;
    ticketQty: number;
    ticketHandle: string;
    ticketRefund: string;
}

export const ticketSchema = new Schema<ITicket>({
    ticketType: {
        type: String,
        enum: Object.values(ticketTypeOptions).map(String),
    },
    ticketName: {
        type: String,
    },
    ticketPrice:{
        type: Number,
    },
    ticketQty:{
        type: Number,
    },
    ticketHandle: {
        type: String,
        enum: Object.values(ticketHandlerOptions).map(String),
    },
    ticketRefund: {
        type:String,
        enum: Object.values(refundHandleOption).map(String),
    }
})