import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    docId: { type: mongoose.Schema.Types.ObjectId, ref: "doctors" },
    slotDate: String,
    slotTime: String,
    amount: { type: Number, default: 0 },
    cancelled: { type: Boolean, default: false },
    paid: { type: Boolean, default: false },
    order_id: { type: String, default: null },
    userData: { type: Object, required: true },
    docData: { type: Object, required: true },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const appointmentModel = mongoose.model("appointments", appointmentSchema);
export default appointmentModel;
