import asyncHandler from "express-async-handler";
import Event from "../schema/event";
import { IUserRequest } from "../interface/users";
import { NextFunction, Request, Response } from "express";
import User from "../schema/users";
import { IEvent } from "../interface/event";
import { generateCustomEventCode } from "../utils/geneateEventcode";


const createEventInfo = asyncHandler(async (req: IUserRequest, res: Response, next: NextFunction) => {
    const {
        EventTitle,
        interests,
        category,
        isPublic,
        description,
    } = req.body;

    try {
      const eventCode = generateCustomEventCode(category);
        // Create the event and associate it with the logged-in user
        const createEventInfo = await Event.create({
            EventTitle,
            interests,
            OrganizedBy: req.user._id, // Associate the event with the logged-in user
            category,
            isPublic,
            eventCode,
            description
        });

        // Verify if the user exists
        const user = await User.findOne({ _id: req.user._id }); // Use req.user._id directly

        if (!user) {
             res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const privacyMessage = isPublic ? 'public' : 'private';

        res.status(201).json({
            success: true,
            message: `Event Information created successfully. This event is ${privacyMessage}.`,
            data: createEventInfo,
            eventId: createEventInfo._id
        });
    } catch (error) {
        next(error);
    }
});



const eventProgramCover = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { eventId } = req.params;

    const uploadedFiles = req.files as { [fieldname: string]: Express.Multer.File[] };


    const coverImage = uploadedFiles['coverImage'] ? uploadedFiles['coverImage'][0] : undefined;
    const filePDF = uploadedFiles['filePDF'] ? uploadedFiles['filePDF'][0] : undefined;

    // Assuming you want to store the file URLs in the database
    const coverImageURL = coverImage ? `/uploads/coverImages/${coverImage.filename}` : undefined;
    const filePDFURL = filePDF ? `/uploads/pdfFiles/${filePDF.filename}` : undefined;

    // Update event info with the uploaded URLs
    const updateEventInfo = await Event.findByIdAndUpdate(
      eventId,
      {
        coverImage: coverImageURL,
        filePDF: filePDFURL,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Event Cover and PDF updated successfully',
      data: updateEventInfo,
    });
  } catch (error) {
    next(error);
  }
};


const eventLocation = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { location } = req.body;
    const eventId = req.params.eventId;

    if (!location || !location.type) {
      res.status(400).json({
        success: false,
        message: "Invalid location data",
      });
      return;
    }

    const updateObject: Partial<IEvent> = {}; // Define a structured type for the updateObject

    if (location.type === 'live') {
      updateObject.location = {
        type: 'live',
        searchLocation: location.searchLocation,
        enterLocation: location.enterLocation,
        startDate: location.startDate,
        endDate: location.endDate,
      };
    } else if (location.type === 'online') {
      updateObject.location = {
        type: 'online',
        selectHost: location.selectHost,
        hostUrl: location.hostUrl,
        startDate: location.startDate,
        endDate: location.endDate,
      };
    }

    const updateEventInfo = await Event.findByIdAndUpdate(
      eventId,
      updateObject,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Event location updated successfully",
      data: updateEventInfo,
    });
  } catch (error) {
    next(error);
  }
});


const eventPerformerInfo = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { newPerformers } = req.body;
    const eventId = req.params.eventId;

    const parsedNewPerformers: any[] = JSON.parse(newPerformers);
    const uploadedFiles = req.files as { [fieldname: string]: Express.Multer.File[] };

    const performerKeys = Object.keys(uploadedFiles).filter(key => key.startsWith('performerImage'));

    const updatedPerformers = parsedNewPerformers.map((newPerformer, index) => {
      const performerImage = uploadedFiles[performerKeys[index]] ? uploadedFiles[performerKeys[index]][0] : null;
      const performerImageUrl = performerImage ? `/uploads/performerImages/${performerImage.filename}` : null;
      return { ...newPerformer, performerImage: performerImageUrl };
    });

    const updateEventData = {
      $push: { performers: { $each: updatedPerformers } }
    };

    const updateEventInfo: IEvent | null = await Event.findByIdAndUpdate(
      eventId,
      updateEventData,
      { new: true }
    );

    if (!updateEventInfo) {
      res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'New performers added successfully to the event',
      data: updateEventInfo,
    });

  } catch (error) {
    next(error);
  }
});


const eventTicket = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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

    const updateEventInfo = await Event.findByIdAndUpdate(
      eventId,
      { $push: { tickets: { $each: tickets } } }, // Using $push and $each to add multiple tickets
      { new: true }
    );

    if (!updateEventInfo) {
      res.status(404).json({
        success: false,
        error: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event tickets updated successfully",
      data: updateEventInfo,
    });
  } catch (error) {
    next(error);
  }
});



const getAllEventsByTypes = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    try {
        const eventsType = req.query.eventType; // Assuming you're passing the event type as a query parameter
        const page = parseInt(req.query.page as string) || 1; // Current page, default to 1
        const limit = parseInt(req.query.limit as string) || 10; // Number of events per page, default to 10

        let query = eventsType ? { eventType: eventsType } : {}; // Define query based on event type

        const totalEvents = await Event.countDocuments(query);

        const totalPages = Math.ceil(totalEvents / limit);
        const skip = (page - 1) * limit;

        const events = await Event.find(query)
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
    } catch (error) {
        next(error);
    }
    
})

const getEventDetails = asyncHandler (async(req: Request, res: Response, next: NextFunction) => {
try {
    const eventId = req.params.eventId;

    const event = await Event.findById(eventId);

    if(!event) {
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
} catch (error) {
    next(error);
}
});

const updateEvents = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const eventId = req.params.eventId; // Assuming you're passing the event ID as a parameter
        const updateData = req.body; // Assuming you're sending the updated data in the request body

        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            updateData,
            { new: true }
        );

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
    } catch (error) {
        next(error);
    }
});


const deleteEvent = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const eventId = req.params.eventId; // Assuming you're passing the event ID as a parameter

        const deletedEvent = await Event.findByIdAndDelete(eventId);

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
    } catch (error) {
        next(error);
    }
});

  
  const updateEventPerformerInfo = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const performerId = req.params.performerId;
      const eventId = req.params.eventId;
  
      const uploadedFile = req.file as Express.Multer.File;
      const updatedPerformerData = req.body; // Contains updated performer details
  
      const performerImage = uploadedFile ? `/uploads/performerImages/${uploadedFile.filename}` : null;
  
      const updateEventData = {
        $set: {
          "performers.$[elem].performerImage": performerImage,
          "performers.$[elem].nameOfPerformer": updatedPerformerData.nameOfPerformer,
          "performers.$[elem].performerTitle": updatedPerformerData.performerTitle,
          "performers.$[elem}.performerRole": updatedPerformerData.performerRole,
          "performers.$[elem].aboutPerformer": updatedPerformerData.aboutPerformer,
        }
      };
  
      const options = {
        arrayFilters: [{ "elem._id": performerId }],
        new: true
      };
  
      const updateEventInfo: IEvent | null = await Event.findOneAndUpdate(
        { _id: eventId },
        updateEventData,
        options
      );
  
      if (!updateEventInfo) {
        res.status(404).json({
          success: false,
          message: 'Event or performer not found',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Performer and image updated successfully for the event',
        data: updateEventInfo,
      });
  
    } catch (error) {
      next(error);
    }
  });
  


  const deleteEventPerformerInfo = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const performerId = req.params.performerId;
      const eventId = req.params.eventId;
  
      const updateEventData = {
        $pull: { performers: { _id: performerId } }
      };
  
      const updateEventInfo: IEvent | null = await Event.findOneAndUpdate(
        { _id: eventId },
        updateEventData,
        { new: true }
      );
  
      if (!updateEventInfo) {
        res.status(404).json({
          success: false,
          message: 'Event or performer not found',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Performer and associated image deleted successfully from the event',
        data: updateEventInfo,
      });
  
    } catch (error) {
      next(error);
    }
  });
  
  


  const updateEventTicket = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ticketId, updatedTicket } = req.body;
      const eventId = req.params.eventId;
  
      const updateEventInfo = await Event.findOneAndUpdate(
        { _id: eventId, 'tickets._id': ticketId }, // Match event and specific ticket to update
        { $set: { 'tickets.$': updatedTicket } }, // Update the matched ticket
        { new: true }
      );
  
      if (!updateEventInfo) {
        res.status(404).json({
          success: false,
          error: "Event or ticket not found",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Event ticket updated successfully",
        data: updateEventInfo,
      });
    } catch (error) {
      next(error);
    }
  });
  

  const deleteEventTicket = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ticketId } = req.body;
      const eventId = req.params.eventId;
  
      const updateEventInfo = await Event.findOneAndUpdate(
        { _id: eventId },
        { $pull: { tickets: { _id: ticketId } } }, // Remove the specific ticket from the tickets array
        { new: true }
      );
  
      if (!updateEventInfo) {
        res.status(404).json({
          success: false,
          error: "Event or ticket not found",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Event ticket deleted successfully",
        data: updateEventInfo,
      });
    } catch (error) {
      next(error);
    }
  });
  



export {
    createEventInfo,
    eventProgramCover,
    eventLocation,
    eventPerformerInfo,
    eventTicket,
    getAllEventsByTypes,
    getEventDetails,
    updateEvents,
    deleteEvent,
    updateEventPerformerInfo,
    deleteEventPerformerInfo,
    updateEventTicket,
    deleteEventTicket
}

