
import express from "express";
import { createEventInfo, eventLocation, eventPerformerInfo, eventProgramCover, eventTicket, getAllEventsByTypes } from "../controllers/events";
import upload from "../utils/multer";


const router = express.Router();

router.post("/create", createEventInfo);
router.post("/:eventId/update-cover-program", upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'filePDF', maxCount: 1 },
  ]), eventProgramCover);
router.post("/:eventId/event-location", eventLocation);
router.post("/:eventId/event-performer", upload.single('performerImage'), eventPerformerInfo);
router.post("/:eventId/event-ticket", eventTicket);

// getAll activities 
router.get("/", getAllEventsByTypes);


export default router