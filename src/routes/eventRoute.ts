
import express from "express";
import { createEventInfo, deleteEvent, deleteEventPerformerInfo, deleteEventTicket, eventLocation, eventPerformerInfo, eventProgramCover, eventTicket, getAllEventsByTypes, getEventDetails, updateEventPerformerInfo, updateEventTicket, updateEvents } from "../controllers/events";
import upload from "../utils/multer";
import { isAuthenticated } from "../middleware/auth";


const router = express.Router();

router.post("/create", isAuthenticated, createEventInfo);
router.post("/:eventId/update-cover-program", upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'filePDF', maxCount: 1 },
  ]), eventProgramCover);
router.post("/:eventId/event-location", eventLocation);
router.post("/:eventId/event-performer", isAuthenticated, upload.fields([{name: 'performerImage', maxCount: 1}]), eventPerformerInfo);
router.post("/:eventId/event-ticket", isAuthenticated, eventTicket);

// getAll activities 
router.get("/", getAllEventsByTypes);
router.get("/details/:eventId", getEventDetails);


//Updates Events 
router.put("/update-event/:eventId", isAuthenticated, updateEvents);
router.put("/:eventId/performers/:performerId/performer", isAuthenticated, upload.single('performerImage'), updateEventPerformerInfo);
router.put("/:eventId/tickets/:ticketId", isAuthenticated, updateEventTicket);

//Deletion route
router.delete("/delete-event/:eventId", isAuthenticated, deleteEvent);
router.delete("/:eventId/performers/:performerId/delete-performer", isAuthenticated, deleteEventPerformerInfo);
router.delete("/:eventId/tickets/:ticketId", isAuthenticated, deleteEventTicket);


export default router