import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";

//app configuration
const app = express();
const port = process.env.PORT || 5000;
connectDB();
connectCloudinary();

//middlewares : Whatever the info that we request get Passed through this.
app.use(express.json());
//Express.json converts any request that we send into Json format or info that we recieve in Json format
app.use(cors({
  origin: "http://localhost:5173", // or your frontend URL
  credentials: true
}));
//Cors (Cross Origin Resource Sharing) : Since frontend and backend run on different ports, this is used to connect them and make then work as one

//API endpoints
app.use("/api/admin", adminRouter);
//localhost:4000/api/admin/add-doctor
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

//Start the app
app.listen(port, () => console.log("Server running on ", port));
