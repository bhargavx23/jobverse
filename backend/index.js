import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import authRoute from "./routes/authRoute.js";
import jobsRoute from "./routes/jobsRoute.js";
import applicationsRoute from "./routes/applicationsRoute.js";
import adminRoute from "./routes/adminRoute.js";
import cors from "cors";

const app = express();

// Middleware for parsing request body
app.use(express.json());

app.use(cors());


// Serve static files from uploads directory
app.use("/uploads", express.static("public/uploads"));

app.get("/", (request, response) => {
  console.log(request);
  return response.status(234).send("Welcome To Job Portal MERN Stack");
});

// Routes
app.use("/api/auth", authRoute);
app.use("/api/jobs", jobsRoute);
app.use("/api/applications", applicationsRoute);
app.use("/api/admin", adminRoute);

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
