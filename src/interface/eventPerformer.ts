import mongoose, { Schema } from "mongoose";
import { performerRoleOption } from "./performerRole";

interface IEventPerformer extends mongoose.Document{
    isPerformer: boolean;
    nameOfPerformer: string;
    performerTitle: string;
    performerRole: typeof performerRoleOption;
    aboutPerformer: string;
    performerImage: string;
}

export const performerSchema = new Schema<IEventPerformer>({
    isPerformer:{
        type: Boolean,
    },
    nameOfPerformer: {
        type: String,
    },
    performerTitle: {
        type: String,
    },
    performerRole: {
        type: String,
        enum: Object.values(performerRoleOption)
    },
    aboutPerformer:{
        type: String,
    },
    performerImage: {
        type: String,
    }
})
