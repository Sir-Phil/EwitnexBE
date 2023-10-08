"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const evenOption_1 = require("../interface/evenOption");
const eventCategories_1 = require("../interface/eventCategories");
const host_1 = require("../interface/host");
const eventPerformer_1 = require("../interface/eventPerformer");
const ticketing_1 = require("../interface/ticketing");
const eventSchema = new mongoose_1.default.Schema({
    EventTitle: {
        type: String,
        required: false,
    },
    OrganizedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [false, "Please provide Organizer"]
    },
    eventType: {
        type: String,
        enum: Object.values(evenOption_1.eventTypeOptions),
        required: [false, "Please select event Type"]
    },
    category: {
        type: String,
        enum: Object.values(eventCategories_1.Category),
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
            enum: Object.values(host_1.hostNameOption)
        },
        hostUrl: {
            type: String,
        },
        startDate: {
            type: Date
        },
        endDate: {
            type: Date
        }
    },
    performer: {
        type: eventPerformer_1.performerSchema
    },
    tickets: [ticketing_1.ticketSchema],
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    },
});
const Event = mongoose_1.default.model("Events", eventSchema);
exports.default = Event;
