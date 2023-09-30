
import express from "express";
import { createEventInfo, deleteEvent, deletePerformer, deleteTicket, eventLocation, eventPerformerInfo, eventProgramCover, eventTicket, getAllEventsByTypes, getEventDetails, updateEvents, updatePerformerImage, updateTicket } from "../controllers/events";
import upload from "../utils/multer";
import { isAuthenticated } from "../middleware/auth";


const router = express.Router();

router.post("/create", isAuthenticated, createEventInfo);
router.post("/:eventId/update-cover-program", upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'filePDF', maxCount: 1 },
  ]), eventProgramCover);
router.post("/:eventId/event-location", eventLocation);
router.post("/:eventId/event-performer", upload.single('performerImage'), eventPerformerInfo);
router.post("/:eventId/event-ticket", eventTicket);

// getAll activities 
router.get("/", getAllEventsByTypes);
router.get("/details/:eventId", getEventDetails);


//Updates Events 
router.put("/update-event/:eventId", updateEvents);
router.put("/:eventId/performers/:performerIndex/update-image", upload.single('performerImage'), updatePerformerImage);
router.put("/:eventId/tickets/:ticketId", updateTicket);

//Deletion route
router.delete("/delete-event/:eventId", deleteEvent);
router.delete("/:eventId/performers/:performerId", deletePerformer);
router.delete("/:eventId/tickets/:ticketId", deleteTicket);


export default router