"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.performerSchema = void 0;
const mongoose_1 = require("mongoose");
const performerRole_1 = require("./performerRole");
exports.performerSchema = new mongoose_1.Schema({
    isPerformer: {
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
        enum: Object.values(performerRole_1.performerRoleOption)
    },
    aboutPerformer: {
        type: String,
    },
    performerImage: {
        type: String,
    }
});
