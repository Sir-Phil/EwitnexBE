import mongoose from "mongoose";
import { IUser } from "./users";
import { eventTypeOptions } from "./evenOption";
import { Category } from "./eventCategories";
import { hostNameOption } from "./host";
import { performerRoleOption } from "./performerRole";
import { IEventPerformer } from "./eventPerformer";
import { ITicket } from "./ticketing";

export interface IEvent extends mongoose.Document {
    EventTitle: string;
    OrganizedBy: mongoose.Types.ObjectId | IUser;
    EventType: typeof eventTypeOptions;
    category: typeof Category;
    isPublic: boolean;
    description: string;
    liveLocation: {
        searchLocation: string;
        enterLocation: string;
        startedDate: Date;
        endDate: Date;
    },
    onlineLocation: {
        selectHost: typeof hostNameOption;
        hostUrl: string;
        startDate: Date;
        endDate: Date;
    }
    performer: IEventPerformer;
    tickets: ITicket[];
}

export interface Request {
    files: {
      filePDF?: MulterFile[];
      coverImage?: MulterFile[];
      performerImage?: MulterFile[];
    };
  }