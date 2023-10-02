import express from "express"
import { bookEvent, deleteEventBooking, getAllEventBookings, getMyBookings } from "../controllers/orders";
import { isAuthenticated } from "../middleware/auth";


const router = express.Router();

router.post("/event-booking", isAuthenticated, bookEvent)
router.get("/all-event-booking", getAllEventBookings);
router.get("/my-event-booking/:userId", getMyBookings);
router.delete("/event-booking/:orderId", deleteEventBooking);


export default router