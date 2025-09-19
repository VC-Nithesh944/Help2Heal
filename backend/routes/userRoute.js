import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointments,
  cancelAppointment,
  paymentCashfree,
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);

userRouter.get("/get-profile", authUser, getProfile);
userRouter.post("/cancel-appointment",authUser,cancelAppointment)

userRouter.post(
  "/update-profile",
  upload.single("image"),
  authUser,
  updateProfile
);

userRouter.post("/book-appointment", authUser, bookAppointment);

userRouter.get("/appointment", authUser, listAppointments);

userRouter.post("/payment-cashfree", authUser, paymentCashfree)
export default userRouter;
