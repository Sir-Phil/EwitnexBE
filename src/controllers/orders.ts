import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { IUser, IUserRequest } from "../interface/users";
import Event from "../schema/event";
import Orders from "../schema/order";

// @Desc regis  or  not regis user booking event
// @Route /api/booking/book-event
// @Method POST
const bookEvent = asyncHandler(async (req: IUserRequest, res: Response, _next: NextFunction) =>{
try {
    const {eventId, quantity, firstName, lastName, email, selectedTicketIndex } = req.body

    const userId = req.user ? (req.user as IUser)._id : null;

    const event = await Event.findById(eventId);

    if(!event){
        res.status(404).json({
            success: false,
            error: "Event not found",
        });
    }

    // Check if event.tickets is defined and not empty
if (!event?.tickets.length) {
    res.status(400).json({
      success: false,
      error: "Event does not have any available tickets",
    });
    return;
  }

    // Check if selectedTicketIndex is provided, or use a default value (e.g., 0 for the first ticket)

    const ticketIndex = selectedTicketIndex !== undefined ? selectedTicketIndex : 0;

    if(ticketIndex < 0 || ticketIndex >= event?.tickets.length){
        res.status(400).json({
            success: false,
            error: "Invalid selected ticket index",
        });
        return;
    }

    const selectedTicket = event?.tickets[ticketIndex];

    if(!selectedTicket){
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
    const order = new Orders({
        user: userId,
        event: eventId,
        orderTickets: {quantity, ticketPrice},
        orderedDate: new Date(),
        quantity,
        ticketPrice,
        firstName,
        lastName,
        email,
        amountVAT,
        groundTotal
    });

    await order.save();

    res.status(201).json({
        success: true,
        data: {
            message: "Event(s) Booked Successfully",
            order,
        },
    });
} catch (error) {
    console.error(error);
    res.status(500).json({
        success:false,
        error: "Error Booking Event"
    })
}
});

// @Desc Get booking event
// @Route /api/booking/get-booking
// @Method Get

const getAllEventBookings = asyncHandler (async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);
    const count = await Orders.countDocuments();

    const orders = await Orders.find()
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
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Error fetching event bookings',
    });
  }
});

// @Desc Get My-booked event
// @Route /api/booking/my-booking/userId
// @Method Get

const getMyBookings = asyncHandler (async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const { userId } = req.params;

    // Find orders for the specific user
    const userOrders = await Orders.find({ user: userId });

    res.status(200).json({
      success: true,
      data: {
        userOrders,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Error fetching user\'s event bookings',
    });
  }
});

// @Desc Get delete-booked event
// @Route /api/booking/delete-booking/:orderId
// @Method Get

const deleteEventBooking = asyncHandler (async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const { orderId } = req.params;

    // Check if the order exists
    const order = await Orders.findById(orderId);
    if (!order) {
      res.status(404).json({
        success: false,
        error: 'Order not found',
      });
      return;
    }

    // Delete the order
    await Orders.findByIdAndDelete(orderId);

    res.status(200).json({
      success: true,
      data: {
        message: 'Order deleted successfully',
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Error deleting event booking',
    });
  }
});



export {
    bookEvent,
    getAllEventBookings,
    getMyBookings,
    deleteEventBooking
}