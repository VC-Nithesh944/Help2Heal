import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const changeAvailability = async (req, res) => {
  //we are adding this functionality in doctors controller because we need this in both admin panel and doctors panel
  try {
    const { docId } = req.body; //body because we are on the list page
    const docData = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });
    res.json({ success: true, message: "Availbility Changed Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
const doctorList = async (req,res)=>{
  try {
    const doctors=await doctorModel.find({}).select(['-password','-email'])
    res.json({success:true,doctors})
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
    
  }
}

//API for Doctor Login
const loginDoctor = async (req, res) => {
  try {

    const { email, password } = req.body
    const doctor = await doctorModel.findOne({ email })
    
    if (!doctor) {
      return res.json({success: false, message:"Invalid Credentials"})
    }

    const isMatch = await bcrypt.compare(password, doctor.password)
    
    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)
      
      res.json({success: true, token})
    }
    else {
      res.json({success: false, message: "Invalid Credentials"})
    }
    
  } catch (error) {
    console.log(error)
    res.json({success: false, message: error.message})
  }
}

export { changeAvailability ,doctorList, loginDoctor};
