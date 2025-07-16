import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Accepting the data from different sources in a json format but make sure to put a limit on it or else it may crash
//This data is coming from files
app.use(express.json({ limit: "16kb" }));

//Data coming from url's is encoded so we have to use specific configuration
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//Routes
import userRouter from "./routes/user.routes.js";

//Routes declaration
app.use("/api/v1/users", userRouter);
export { app };
