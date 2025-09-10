import validator from "validator"
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

    return res.json({ success: true, message: "Successful" });

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
    return res.json({success:false, message:error.message})
  }
};

export { addDoctor };
