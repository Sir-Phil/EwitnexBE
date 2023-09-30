"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEventBooking = exports.getMyBookings = exports.getAllEventBookings = exports.bookEvent = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const event_1 = __importDefault(require("../schema/event"));
const order_1 = __importDefault(require("../schema/order"));
// @Desc regis  or  not regis user booking event
// @Route /api/booking/book-event
// @Method POST
const bookEvent = (0, express_async_handler_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { eventId, quantity, firstName, lastName, email, selectedTicketIndex } = req.body;
        const userId = req.user ? req.user._id : null;
        const event = yield event_1.default.findById(eventId);
        if (!event) {
            res.status(404).json({
                success: false,
                error: "Event not found",
            });
        }
        // Check if event.tickets is defined and not empty
        if (!(event === null || event === void 0 ? void 0 : event.tickets.length)) {
            res.status(400).json({
                success: false,
                error: "Event does not have any available tickets",
            });
            return;
        }
        // Check if selectedTicketIndex is provided, or use a default value (e.g., 0 for the first ticket)
        const ticketIndex = selectedTicketIndex !== undefined ? selectedTicketIndex : 0;
        if (ticketIndex < 0 || ticketIndex >= (event === null || event === void 0 ? void 0 : event.tickets.length)) {
            res.status(400).json({
                success: false,
                error: "Invalid selected ticket index",
            });
            return;
        }
        const selectedTicket = event === null || event === void 0 ? void 0 : event.tickets[ticketIndex];
        if (!selectedTicket) {
            res.status(400).json({
                success: false,
                error: "Selected ticket does not exist",
            });
            return;
        }
        const ticketPrice = selectedTicket.ticketPrice;
        const amountVAT = (ticketPrice * quantity * 0.2);
        const groundTotal = ticketPrice * quantity + amountVAT;
        //creating order
        const order = new order_1.default({
            user: userId,
            event: eventId,
            orderTickets: { quantity, ticketPrice },
            orderedDate: new Date(),
            quantity,
            ticketPrice,
            firstName,
            lastName,
            email,
            amountVAT,
            groundTotal
        });
        yield order.save();
        res.status(201).json({
            success: true,
            data: {
                message: "Event(s) Booked Successfully",
                order,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Error Booking Event"
        });
    }
}));
exports.bookEvent = bookEvent;
// @Desc Get booking event
// @Route /api/booking/get-booking
// @Method Get
const getAllEventBookings = (0, express_async_handler_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, pageSize = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(pageSize);
        const count = yield order_1.default.countDocuments();
        const orders = yield order_1.default.find()
            .skip(skip)
            .limit(Number(pageSize))
            .exec();
        res.status(200).json({
            success: true,
            data: {
                orders,
                page: Number(page),
                pageSize: Number(pageSize),
                totalItems: count,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Error fetching event bookings',
        });
    }
}));
exports.getAllEventBookings = getAllEventBookings;
// @Desc Get My-booked event
// @Route /api/booking/my-booking/userId
// @Method Get
const getMyBookings = (0, express_async_handler_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        // Find orders for the specific user
        const userOrders = yield order_1.default.find({ user: userId });
        res.status(200).json({
            success: true,
            data: {
                userOrders,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Error fetching user\'s event bookings',
        });
    }
}));
exports.getMyBookings = getMyBookings;
// @Desc Get delete-booked event
// @Route /api/booking/delete-booking/:orderId
// @Method Get
const deleteEventBooking = (0, express_async_handler_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        // Check if the order exists
        const order = yield order_1.default.findById(orderId);
        if (!order) {
            res.status(404).json({
                success: false,
                error: 'Order not found',
            });
            return;
        }
        // Delete the order
        yield order_1.default.findByIdAndDelete(orderId);
        res.status(200).json({
            success: true,
            data: {
                message: 'Order deleted successfully',
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Error deleting event booking',
        });
    }
}));
exports.deleteEventBooking = deleteEventBooking;
