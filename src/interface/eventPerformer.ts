import mongoose, { Schema } from "mongoose";
import { performerRoleOption } from "./performerRole";



export interface IEventPerformer extends mongoose.Document{
    nameOfPerformer: string;
    performerTitle: string;
    performerRole: string;
    aboutPerformer: string;
    performerImage: string;
}

export const performerSchema = new Schema<IEventPerformer>({
    nameOfPerformer: {
        type: String,
    },
    performerTitle: {
        type: String,
    },
    performerRole: {
        type: String,
        enum: Object.values(performerRoleOption).map(String),
    },
    aboutPerformer:{
        type: String,
    },
    performerImage: {
        type: String,
    }
})
