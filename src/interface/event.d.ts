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
    interests: typeof eventTypeOptions;
    category: typeof Category;
    isPublic: boolean;
    eventCode: string;
    description: string;
    filePDF: string;
    coverImage: string;
    location: {
        type: 'live' | 'online';
        searchLocation?: string;
        enterLocation?: string;
        startDate?: Date;
        endDate?: Date;
        selectHost?: typeof hostNameOption;
        hostUrl?: string;
      },
    performers: IEventPerformer[];
    tickets: ITicket[];
    createdAt: Date;
    updatedAt: Date
}

export interface Request {
    files: {
      filePDF?: MulterFile[];
      coverImage?: MulterFile[];
      performerImage?: MulterFile[];
    };
  }