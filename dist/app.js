"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const usersRoute_1 = __importDefault(require("./routes/usersRoute"));
const eventRoute_1 = __importDefault(require("./routes/eventRoute"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const resetRoute_1 = __importDefault(require("./routes/resetRoute"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/test", (_req, res) => {
    res.send("Hi Ewitnex");
});
app.use(body_parser_1.default.urlencoded({ extended: true, limit: "50mb" }));
// config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({
        path: "config/.env",
    });
}
//endpoints routes
app.use("/api/users", usersRoute_1.default);
app.use("/api/events", eventRoute_1.default);
app.use("/api/booking", orderRoutes_1.default);
app.use("/api/auth", resetRoute_1.default);
//for ErrorHandling
app.use(errorMiddleware_1.errorHandler);
app.use(errorMiddleware_1.notFound);
exports.default = app;
