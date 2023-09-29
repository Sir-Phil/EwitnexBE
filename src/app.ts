import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import { errorHandler, notFound } from "./middleware/errorMiddleware";

import usersRoute from "./routes/usersRoute";
import eventRoute from "./routes/eventRoute";
import orderRoutes from "./routes/orderRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/test", (_req, res) => {
  res.send("Hi Ewitnex")
})

app.use(bodyParser.urlencoded({extended: true, limit: "50mb"}));

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({
      path: "config/.env",
    });
}

//endpoints routes
app.use("/api/users", usersRoute );
app.use("/api/events", eventRoute);
app.use("/api/booking", orderRoutes);

//for ErrorHandling
app.use(errorHandler);
app.use(notFound);

export default app