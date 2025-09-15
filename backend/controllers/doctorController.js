import doctorModel from "../models/doctorModel.js";

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

export { changeAvailability };
