import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true, unique: true, index: true },

    name: String,
    father: String,
    dob: Date,
    gender: String,
    marital: String,
    phone: String,
    email: String,

    position: String,
    joiningDate: Date,
    company: String,

    photo: String, // /uploads/filename.jpg
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
