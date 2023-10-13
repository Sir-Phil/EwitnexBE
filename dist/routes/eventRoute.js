"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const events_1 = require("../controllers/events");
const multer_1 = __importDefault(require("../utils/multer"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/create", auth_1.isAuthenticated, events_1.createEventInfo);
router.post("/:eventId/update-cover-program", multer_1.default.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'filePDF', maxCount: 1 },
]), events_1.eventProgramCover);
router.post("/:eventId/event-location", events_1.eventLocation);
router.post("/:eventId/event-performer", multer_1.default.fields([{ name: 'performerImage', maxCount: 1 }]), events_1.eventPerformerInfo);
router.post("/:eventId/event-ticket", events_1.eventTicket);
// getAll activities 
router.get("/", events_1.getAllEventsByTypes);
router.get("/details/:eventId", events_1.getEventDetails);
//Updates Events 
router.put("/update-event/:eventId", events_1.updateEvents);
router.put("/:eventId/performers/:performerId/update-image", multer_1.default.single('performerImage'), events_1.updatePerformerImage);
router.put("/:eventId/tickets/:ticketId", events_1.updateTicket);
//Deletion route
router.delete("/delete-event/:eventId", events_1.deleteEvent);
router.delete("/:eventId/delete-performers", events_1.deletePerformer);
router.delete("/:eventId/tickets/:ticketId", events_1.deleteTicket);
exports.default = router;
