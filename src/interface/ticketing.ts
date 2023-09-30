import mongoose, { Schema } from "mongoose";
import { ticketTypeOptions } from "./ticketSelect";
import { ticketHandlerOptions } from "./ticketHandler";
import { refundHandleOption } from "./refundHandler";

interface ITicket extends mongoose.Document{
    ticketType: typeof ticketTypeOptions;
    ticketName: string;
    ticketPrice: number;
    ticketQty: number;
    ticketHandle: typeof ticketHandlerOptions;
    ticketRefund: typeof refundHandleOption;
}

export const ticketSchema = new Schema<ITicket>({
    ticketType: {
        type: String,
        enum: Object.values(ticketTypeOptions)
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
        enum: Object.values(ticketHandlerOptions)
    },
    ticketRefund: {
        type:String,
        enum: Object.values(refundHandleOption)
    }
})