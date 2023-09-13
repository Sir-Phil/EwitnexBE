import mongoose from "mongoose";
import { IOrderTicketing } from "./orderTicketing";
import { IUser } from "./users";
import { IEvent } from "./event";

export interface IOrder extends mongoose.Document {
    user: mongoose.Types.ObjectId | IUser;
    event: mongoose.Types.ObjectId | IEvent;
    quantity: string;
    amount : number;
    firstName: string;
    lastName: string;
    email: string;

    orderTickets: IOrderTicketing[];
}