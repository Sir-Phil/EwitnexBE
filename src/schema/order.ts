import mongoose, { Schema } from "mongoose";
import { IOrderTicketing } from "../interface/orderTicketing";
import { IOrder } from "../interface/order";

const orderSchema: Schema<IOrder> = new mongoose.Schema({
    user: {
        
    }
})