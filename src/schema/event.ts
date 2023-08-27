import mongoose, { Schema } from "mongoose";
import { eventTypeOptions } from "../interface/evenOption";
import { Category } from "../interface/eventCategories";
import { hostNameOption } from "../interface/host";
import { performerSchema } from "../interface/eventPerformer";
import { ticketSchema } from "../interface/ticketing";
import { IEvent } from "../interface/event";

const eventSchema = new mongoose.Schema ({
    EventTitle: {
        type: String,
        required: false,
    },
    OrganizedBy: {
        type: Schema.Types.ObjectId,
        required: [false, "Please provide Organizer"]
    },
    eventType:{
        type:String,
        enum: Object.values(eventTypeOptions),
        required: [false, "Please select event Type"]
    },
    category: {
        type: String,
        enum: Object.values(Category),
        required: [false, "Please, select Category"]
    },
    isPublic: {
        type: Boolean,
        default: false,
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: false,
    },
    filePDF: {
        type: String,
        required: false,
    },
    coverImage: {
        type: String,
        required: false,
    },
    liveLocation: {
        searchLocation: {
            type: String,
        },
        enterLocation: {
            type: String
        },
        startedDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        }
    },
    onlineLocation: {
        selectHost: {
            type: String,
            enum: Object.values(hostNameOption)
        },
        hostUrl: {
            type: String,
        },
        startDate:{
            type: Date
        },
        endDate: {
            type: Date
        }
    },
    performer: [performerSchema],
    ticket: [ticketSchema],

    createdAt: {
        type: Date,
        default: Date.now(),
      },
    updatedAt: {
        type: Date,
        default: Date.now()
      },
});

const Event = mongoose.model<IEvent>("Events", eventSchema)
export  default Event