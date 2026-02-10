
import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: String,

    role: String,

    // 🔗 Link to auth user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      index: true,
    },

    designation: String,

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    joiningDate: { type: Date },

    // ===== Personal Details =====
    fatherName: String,
    motherName: String,
    bloodGroup: String,
    gender: String,
    dob: { type: Date },
    maritalStatus: String,

    alternatePhone: String,
    alternateEmail: String,
    nationality: String,

    pincode: String,
    address: String,
    state: String,
    city: String,

    photo: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);
