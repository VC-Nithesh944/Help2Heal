import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import { Cashfree, CFEnvironment } from "cashfree-pg";
import appointmentModel from "../models/appointmentModel.js";

//API TO LOGIN USER

//API TO REGISTER USER
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "missing details" });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "enter a valid email" });
    }
    //validating password
    if (password.length < 8) {
      return res.json({ success: false, message: "enter a strong password" });
    }
    //hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };
    const newUser = new userModel(userData);
    const user = await newUser.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//API FOR USER LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "user doesnot exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); //The user._id we will be used in userAuth.js file
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to get user Profile Data
const getProfile = async (req, res) => {
  try {
    // we will be getting userId from authentication, not by the user, but insted by token
    const { userId } = req; //only req is used because get doesnt provide req.body for importing headers
    //To change the header into userId we are going to use a middleware
    const userData = await userModel.findById(userId).select("-password");

    return res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

//API to update the user Profile
const updateProfile = async (req, res) => {
  try {
    const { userId } = req;
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" });
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    });

    if (imageFile) {
      //Upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageURL });
    }

    res.json({ success: true, message: "Profile Updated!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//API to book appointment
const bookAppointment = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body;
    const userId = req.userId;
    const docData = await doctorModel.findById(docId).select("-password");

    if (!docData.available) {
      return res.json({ success: false, message: "Doctor not available" });
    }
    let slots_booked = docData.slots_booked;
    // checking for slots availability
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "slot not available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }
    const userData = await userModel.findById(userId).select("-password");
    delete docData.slots_booked;
    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();
    //save new slots data in docdata
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    res.json({ success: true, message: "Appointment Booked" });
  } catch (error) {
    console.error(error);
  }
};

//API to get user Appointments for frontend my-appointments page
const listAppointments = async (req, res) => {
  try {
    const userId = req.userId;
    const appointments = await appointmentModel.find({ userId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//api to cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const userId = req.userId;
    const appointmentData = await appointmentModel.findById(appointmentId);

    //verify appointment user
    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: "unauthorized action" });
    }
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });
    //releasing doctors slot
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    let slots_booked = doctorData.slots_booked;
    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    res.json({ success: true, message: "appointment cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Initialize Cashfree SDK (ensure env vars exist)
const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  process.env.CASHFREE_KEY_ID,
  process.env.CASHFREE_KEY_SECRET
);

// API to make payment of appointment using Cashfree
const paymentCashfree = async (req, res) => {
  try {
    const userId = req.userId;
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData || appointmentData.cancelled) {
      return res.json({
        success: false,
        message: "Appointment not found or cancelled",
      });
    }

    // generate unique order_id
    const order_id = `${userId}_${appointmentId}_${Date.now()}`;

    const orderPayload = {
      order_id,
      order_amount: appointmentData.amount.toString(),
      order_currency: "INR",
      customer_details: {
        customer_id: appointmentData.userId.toString(),
        customer_name: appointmentData.userData?.name || "",
        customer_email: appointmentData.userData?.email || "",
        customer_phone: appointmentData.userData?.phone || "0000000000",
      },
      order_meta: {
        return_url: `${
          process.env.CLIENT_RETURN_URL ||
          "https://test.cashfree.com/pgappsdemos/return.php"
        }?order_id=${order_id}`,
      },
    };

    // create order via SDK
    const response = await cashfree.PGCreateOrder(orderPayload);
    const orderData = response.data;

    // persist order_id on appointment for later verification
    appointmentData.order_id = order_id;
    await appointmentData.save();

    return res.json({ success: true, order: orderData });
  } catch (error) {
    console.error("paymentCashfree error:", error?.response?.data || error);
    return res.json({
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to create order",
    });
  }
};

// Verify order status with Cashfree and mark appointment paid
const markAppointmentPaid = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    if (!appointmentId)
      return res.json({ success: false, message: "Missing appointmentId" });

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment)
      return res.json({ success: false, message: "Appointment not found" });
    if (!appointment.order_id)
      return res.json({
        success: false,
        message: "Order ID not saved on appointment",
      });

    // debug: log the saved order_id
    console.log(
      "markAppointmentPaid: checking order_id =",
      appointment.order_id
    );

    // init Cashfree client (use your env vars)
    const cf = new Cashfree(
      CFEnvironment.SANDBOX,
      process.env.CASHFREE_CLIENT_ID || process.env.CASHFREE_KEY_ID,
      process.env.CASHFREE_CLIENT_SECRET || process.env.CASHFREE_KEY_SECRET
    );

    // Correct call: pass order_id as FIRST argument
    // Some SDK versions allow passing apiVersion as second arg, but order_id must be first
    const apiVersion = process.env.CF_API_VERSION || "2025-01-01";
    let resp;
    try {
      // primary: order_id first
      resp = await cf.PGFetchOrder(appointment.order_id, apiVersion);
    } catch (e1) {
      // fallback: try calling with only order_id (some SDK builds accept single arg)
      console.warn(
        "PGFetchOrder failed with (orderId, apiVersion), trying (orderId) fallback:",
        e1.message
      );
      resp = await cf.PGFetchOrder(appointment.order_id);
    }

    console.log("PGFetchOrder response:", resp?.data);

    const status =
      resp?.data?.order_status ||
      resp?.data?.order?.status ||
      resp?.data?.status;
    if (
      status &&
      (status.toUpperCase() === "PAID" || status.toUpperCase() === "SUCCESS")
    ) {
      appointment.paid = true;
      await appointment.save();
      return res.json({ success: true, message: "Marked paid" });
    }

    return res.json({
      success: false,
      message: `Order status: ${status || "unknown"}`,
      raw: resp?.data,
    });
  } catch (error) {
    console.error("markAppointmentPaid error:", error?.response?.data || error);
    return res.json({
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Verification failed",
    });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointments,
  cancelAppointment,
  paymentCashfree,
  markAppointmentPaid,
};
