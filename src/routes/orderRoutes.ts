import express from "express"
import { bookEvent, deleteEventBooking, getAllEventBookings, getMyBookings } from "../controllers/orders";


const router = express.Router();

router.post("/book-event",  bookEvent)
router.get("/all-event-booking", getAllEventBookings);
router.get("/my-event-booking/:userId", getMyBookings);
router.delete("/all-event-booking/:orderId", deleteEventBooking);


export default router