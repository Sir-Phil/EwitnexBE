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
exports.deleteTicket = exports.updateTicket = exports.deletePerformer = exports.updatePerformerImage = exports.deleteEvent = exports.updateEvents = exports.getEventDetails = exports.getAllEventsByTypes = exports.eventTicket = exports.eventPerformerInfo = exports.eventLocation = exports.eventProgramCover = exports.createEventInfo = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const event_1 = __importDefault(require("../schema/event"));
const users_1 = __importDefault(require("../schema/users"));
// const createEventInfo = asyncHandler(async (req: IUserRequest, res: Response, next: NextFunction) => {
//     const {
//         EventTitle,
//         eventType,
//         category,
//         isPublic,
//         isPrivate,
//         description,
//         organizerUserId, // The ID of the user to be set as an organizer
//     } = req.body;
//     try {
//         // Verify if the logged-in user exists
//         const loggedInUser = await User.findById(req.user._id);
//         if (!loggedInUser) {
//             res.status(404).json({
//                 success: false,
//                 message: "User not found",
//             });
//         }
//         // Check if the logged-in user has organizer privileges
//         if (!loggedInUser?.isEventOrganizer) {
//             res.status(403).json({
//                 success: false,
//                 message: "You don't have organizer privileges",
//             });
//         }
//         // Verify if the user to be set as an organizer exists
//         const userToSetAsOrganizer = await User.findById(organizerUserId);
//         if (!userToSetAsOrganizer) {
//             res.status(404).json({
//                 success: false,
//                 message: "User to set as an organizer not found",
//             });
//         }
//         // Create the event and associate it with the specified user
//         const createEventInfo = await Event.create({
//             EventTitle,
//             eventType,
//             OrganizedBy: organizerUserId, // Associate the event with the specified user
//             category,
//             isPublic,
//             isPrivate,
//             description,
//         });
//         res.status(201).json({
//             success: true,
//             message: "Event Information created successfully",
//             data: createEventInfo,
//             eventId: createEventInfo._id,
//         });
//     } catch (error) {
//         next(error);
//     }
// });
const createEventInfo = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { EventTitle, eventType, category, isPublic, isPrivate, description, } = req.body;
    try {
        // Create the event and associate it with the logged-in user
        const createEventInfo = yield event_1.default.create({
            EventTitle,
            eventType,
            OrganizedBy: req.user._id,
            category,
            isPublic,
            isPrivate,
            description
        });
        // Verify if the user exists
        const user = yield users_1.default.findOne({ _id: req.user._id }); // Use req.user._id directly
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.status(201).json({
            success: true,
            message: "Event Information created successfully",
            data: createEventInfo,
            eventId: createEventInfo._id
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.createEventInfo = createEventInfo;
const eventProgramCover = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { eventId } = req.params;
        const uploadedFiles = req.files;
        const coverImage = uploadedFiles['coverImage'] ? uploadedFiles['coverImage'][0] : undefined;
        const filePDF = uploadedFiles['filePDF'] ? uploadedFiles['filePDF'][0] : undefined;
        // Assuming you want to store the file URLs in the database
        const coverImageURL = coverImage ? `/uploads/coverImages/${coverImage.filename}` : undefined;
        const filePDFURL = filePDF ? `/uploads/pdfFiles/${filePDF.filename}` : undefined;
        // Update event info with the uploaded URLs
        const updateEventInfo = yield event_1.default.findByIdAndUpdate(eventId, {
            coverImage: coverImageURL,
            filePDF: filePDFURL,
        }, { new: true });
        res.status(200).json({
            success: true,
            message: 'Event Cover and PDF updated successfully',
            data: updateEventInfo,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.eventProgramCover = eventProgramCover;
const eventLocation = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { liveLocation, onlineLocation } = req.body;
        const eventId = req.params.eventId;
        const updateEventInfo = yield event_1.default.findByIdAndUpdate(eventId, { liveLocation, onlineLocation }, { new: true });
        res.status(200).json({
            success: true,
            message: "Event location updated successfully",
            data: updateEventInfo,
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.eventLocation = eventLocation;
const eventPerformerInfo = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const performerData = req.body.performer;
        const performers = JSON.parse(performerData); // Annotate the type as Array<any>
        if (!performers.every(performer => typeof performer === 'object')) {
            res.status(400).json({
                success: false,
                message: "Invalid performing artist data",
            });
        }
        const eventId = req.params.eventId;
        const performersWithImages = performers.map(performer => {
            if (req.file) {
                performer.performerImage = req.file.path;
            }
            return performer;
        });
        const updateEventInfo = yield event_1.default.findByIdAndUpdate(eventId, { performer: performersWithImages }, // Updated array of performers
        { new: true });
        res.status(200).json({
            success: true,
            message: "Event Performers updated successfully",
            data: updateEventInfo,
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.eventPerformerInfo = eventPerformerInfo;
const eventTicket = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tickets } = req.body;
        const eventId = req.params.eventId;
        // Ensure that 'tickets' in the request body is an array
        if (!Array.isArray(tickets)) {
            res.status(400).json({
                success: false,
                error: "Invalid ticket information provided",
            });
        }
        const updateEventInfo = yield event_1.default.findByIdAndUpdate(eventId, { $set: { tickets } }, { new: true });
        res.status(200).json({
            success: true,
            message: "Event ticket updated successfully",
            data: updateEventInfo
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.eventTicket = eventTicket;
const getAllEventsByTypes = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const eventsType = req.query.eventType; // Assuming you're passing the event type as a query parameter
        const page = parseInt(req.query.page) || 1; // Current page, default to 1
        const limit = parseInt(req.query.limit) || 10; // Number of events per page, default to 10
        let query = eventsType ? { eventType: eventsType } : {}; // Define query based on event type
        const totalEvents = yield event_1.default.countDocuments(query);
        const totalPages = Math.ceil(totalEvents / limit);
        const skip = (page - 1) * limit;
        const events = yield event_1.default.find(query)
            .skip(skip)
            .limit(limit);
        res.status(200).json({
            success: true,
            message: `All ${eventsType ? eventsType : 'events'} retrieved successful`,
            data: events,
            meta: {
                totalEvents,
                totalPages,
                currentPage: page,
                eventsPerPage: limit,
            },
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.getAllEventsByTypes = getAllEventsByTypes;
const getEventDetails = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const eventId = req.params.eventId;
        const event = yield event_1.default.findById(eventId);
        if (!event) {
            res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Event retrieved successfully",
            data: event
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.getEventDetails = getEventDetails;
const updateEvents = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const eventId = req.params.eventId; // Assuming you're passing the event ID as a parameter
        const updateData = req.body; // Assuming you're sending the updated data in the request body
        const updatedEvent = yield event_1.default.findByIdAndUpdate(eventId, updateData, { new: true });
        if (!updatedEvent) {
            res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Event updated successfully",
            data: updatedEvent,
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.updateEvents = updateEvents;
const deleteEvent = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const eventId = req.params.eventId; // Assuming you're passing the event ID as a parameter
        const deletedEvent = yield event_1.default.findByIdAndDelete(eventId);
        if (!deletedEvent) {
            res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Event deleted successfully",
            data: deletedEvent,
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.deleteEvent = deleteEvent;
const updatePerformerImage = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const eventId = req.params.eventId;
        const performerIndex = req.params.performerIndex; // Assuming you're passing the performer index as a parameter
        if (req.file) {
            const newImage = req.file.path;
            const updateEventInfo = yield event_1.default.findOneAndUpdate({ _id: eventId, 'performer._id': performerIndex }, { $set: { 'performer.$.performerImage': newImage } }, { new: true });
            if (!updateEventInfo) {
                res.status(404).json({
                    success: false,
                    message: "Event or performer not found",
                });
            }
            res.status(200).json({
                success: true,
                message: "Performer image updated successfully",
                data: updateEventInfo,
            });
        }
        else {
            res.status(400).json({
                success: false,
                message: "No performerImage file provided",
            });
        }
    }
    catch (error) {
        next(error);
    }
}));
exports.updatePerformerImage = updatePerformerImage;
const deletePerformer = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const eventId = req.params.eventId;
        const performerId = req.params.performerId; // Assuming you're passing the performer's _id as a parameter
        const updateEventInfo = yield event_1.default.findByIdAndUpdate(eventId, { $pull: { performer: { _id: performerId } } }, // Remove the performer with the specified _id
        { new: true });
        if (!updateEventInfo) {
            res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Performer deleted successfully",
            data: updateEventInfo,
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.deletePerformer = deletePerformer;
const updateTicket = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const eventId = req.params.eventId;
        const ticketId = req.params.ticketId; // Assuming you're passing the ticket's _id as a parameter
        const { ticket } = req.body;
        const updateEventInfo = yield event_1.default.findOneAndUpdate({ _id: eventId, 'ticket._id': ticketId }, // Find the event with the given ID and matching ticket _id
        { $set: { 'ticket.$': ticket } }, // Update the matched ticket with the new ticket data
        { new: true });
        if (!updateEventInfo) {
            res.status(404).json({
                success: false,
                message: "Event or ticket not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Ticket updated successfully",
            data: updateEventInfo,
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.updateTicket = updateTicket;
const deleteTicket = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const eventId = req.params.eventId;
        const ticketId = req.params.ticketId; // Assuming you're passing the ticket's _id as a parameter
        const updateEventInfo = yield event_1.default.findByIdAndUpdate(eventId, { $pull: { ticket: { _id: ticketId } } }, // Remove the ticket with the specified _id
        { new: true });
        if (!updateEventInfo) {
            res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Ticket deleted successfully",
            data: updateEventInfo,
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.deleteTicket = deleteTicket;
