"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketSchema = void 0;
const mongoose_1 = require("mongoose");
const ticketSelect_1 = require("./ticketSelect");
const ticketHandler_1 = require("./ticketHandler");
const refundHandler_1 = require("./refundHandler");
exports.ticketSchema = new mongoose_1.Schema({
    ticketType: {
        type: String,
        enum: Object.values(ticketSelect_1.ticketTypeOptions)
    },
    ticketName: {
        type: String,
    },
    ticketPrice: {
        type: Number,
    },
    ticketQty: {
        type: Number,
    },
    ticketHandle: {
        type: String,
        enum: Object.values(ticketHandler_1.ticketHandlerOptions)
    },
    ticketRefund: {
        type: String,
        enum: Object.values(refundHandler_1.refundHandleOption)
    }
});
