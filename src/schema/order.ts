import mongoose, { Schema } from "mongoose";
import { IOrder } from "../interface/order";
import { orderTicketSchema } from "../interface/orderTicketing";

const orderSchema: Schema<IOrder> = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: "Events",
        required: true
    },
    ticket: {
        type: Schema.Types.ObjectId,
        ref: "Events.tickets"
    },
    orderTickets: [orderTicketSchema],
    orderedDate: {
        type: Date,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
    },
    ticketPrice: {
        type: Number,
        required: true
    },
    firstName: {
        type:String,
        required: true
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    amountVAT: {
        type: Number,
    },
    groundTotal: {
        type: Number
    },
},{
    timestamps: true
}
)

const Orders = mongoose.model<IOrder>("Orders", orderSchema);

export default Orders