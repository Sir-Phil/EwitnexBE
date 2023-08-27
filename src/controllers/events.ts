import asyncHandler from "express-async-handler";
import Event from "../schema/event";
import { IUserRequest } from "../interface/users";
import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';



const createEventInfo = asyncHandler(async (req:IUserRequest, res: Response, next: NextFunction) => {
    const {
        EventTitle,
        eventType,
        category,
        OrganizedBy,
        isPublic,
        isPrivate,
        description,
    } = req.body;

    try {
        const createEventInfo = await Event.create({
            EventTitle,
            eventType,
            OrganizedBy,
            category,
            isPublic,
            isPrivate,
            description
        });

        res.status(201).json({
            success: true,
            message: "Event Information created successfully",
            data: createEventInfo,
            eventId: createEventInfo._id
        });
    } catch (error) {
        next(error);
    }
})


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
        const {liveLocation, onlineLocation} = req.body;
        const eventId = req.params.eventId;

        const updateEventInfo = await Event.findByIdAndUpdate(
            eventId,
            {liveLocation, onlineLocation},
            {new: true}
        );

        res.status(200).json({
            success: true,
            message: "Event location updated successfully",
            data: updateEventInfo,
        })
    } catch (error) {
        next(error);
    }
});

// const eventPerformerInfo = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
//     try {
//         const performerData = req.body.performer;

//         if (!performerData) {
//              res.status(400).json({
//                 success: false,
//                 message: "Performing artist data is missing in the request body",
//             });
//         }

//         const performer = JSON.parse(performerData);

//         if (!performer || typeof performer !== 'object') {
//              res.status(400).json({
//                 success: false,
//                 message: "Invalid performing artist data",
//             });
//         }

//         const eventId = req.params.eventId;

//         if (req.file) {
//             performer.performerImage = req.file.path;
//         }

//         const updateEventInfo = await Event.findByIdAndUpdate(
//             eventId,
//             { performer },
//             { new: true }
//         );

//         res.status(200).json({
//             success: true,
//             message: "Event Performer updated successfully",
//             data: updateEventInfo,
//         })
//     } catch (error) {
//         next(error);
//     }
// });


const eventPerformerInfo = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const performerData = req.body.performer;

        // if (!performerData || !Array.isArray(performerData)) {
        //      res.status(400).json({
        //         success: false,
        //         message: "Performing artist data is missing or not in the correct format in the request body",
        //     });
        // }

        const performers: Array<any> = JSON.parse(performerData); // Annotate the type as Array<any>

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

        const updateEventInfo = await Event.findByIdAndUpdate(
            eventId,
            { performer: performersWithImages }, // Updated array of performers
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Event Performers updated successfully",
            data: updateEventInfo,
        });
    } catch (error) {
        next(error);
    }
});



const eventTicket = asyncHandler (async (req: Request, res: Response, next: NextFunction) => {
    try {

        const {ticket} = req.body;
        const eventId = req.params.eventId;

        const uniqueID = uuidv4();

        
        const updateEventInfo = await Event.findByIdAndUpdate(
            eventId,
            { $set: {uniqueID, ticket } },
            { new: true }
          );
        
        res.status(200).json({
            success: true,
            message: "Event ticket updated successfully",
            uniqueID: uniqueID,
            data: updateEventInfo
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



export {
    createEventInfo,
    eventProgramCover,
    eventLocation,
    eventPerformerInfo,
    eventTicket,
    getAllEventsByTypes,
}