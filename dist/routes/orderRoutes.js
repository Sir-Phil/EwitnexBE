"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orders_1 = require("../controllers/orders");
const router = express_1.default.Router();
router.post("/book-event", orders_1.bookEvent);
router.get("/all-event-booking", orders_1.getAllEventBookings);
router.get("/my-event-booking/:userId", orders_1.getMyBookings);
router.delete("/all-event-booking/:orderId", orders_1.deleteEventBooking);
exports.default = router;
