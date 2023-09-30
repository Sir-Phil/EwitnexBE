"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderTicketSchema = void 0;
const mongoose_1 = require("mongoose");
exports.orderTicketSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
    },
    username: {
        type: String,
    }
});
