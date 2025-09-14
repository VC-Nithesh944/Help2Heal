import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
// api for adding doctors by the admin
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;

    //Checking for all data to add doctor to the DataBase
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.json({ success: false, message: "Missing Details" });
    }

    //Validating email format using Validator pkg thats been installed, if wrong reutrn res.json
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a Valid Email!",
      });
    }

    //Validating Strong password
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a Strong Password!",
      });
    }
    // ...existing code...
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const imageFile = req.file; // <-- Add this
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const iamgeUrl = imageUpload.secure_url;
    // ...existing code...
    const doctorData = {
      name,
      email,
      image: iamgeUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };
    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();
    res.json({ success: true, message: "doctor added" });

    //We need the image file, that will parsed by upload.single middleware
    // const imageFile = req.file
    // console.log({
    //   name,
    //   email,
    //   password,
    //   speciality,
    //   degree,
    //   experience,
    //   about,
    //   fees,
    //   address,
    // }, imageFile)
    //Since we are not returning anything, the process is loading continuosly res.json()
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// We will be making sure that only when admin has token he can add doctor
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

//APi to get all doctors list for the admin panel
const allDoctors = async (req, res) => {
  try {
    //exluding the password using .select('-password')
    const doctors = await doctorModel.find({}).select('-password')
    res.json({success:true, doctors})
  } catch (error) {
    console.log(error)
    res.json({success : false, message: error.message})
  }
}

export { addDoctor, loginAdmin, allDoctors };
