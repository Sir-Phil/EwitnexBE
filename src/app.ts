import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorMiddleware";

import usersRoute from "./routes/usersRoute"

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/test", (_req, res) => {
  res.send("Hi Ewitnex")
})

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({
      path: "config/.env",
    });
}

//endpoints routes
app.use("/api/users", usersRoute );

//for ErrorHandling
app.use(errorHandler)

export default app