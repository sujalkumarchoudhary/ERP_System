import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    // 🔥 Assigned Employee
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    // 🔥 Assigned Admin (VERY IMPORTANT)
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    codeReviewMeeting: {
      type: Date,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    clientPresentationPrep: {
      type: Date,
    },


    status: {
      type: String,
      enum: ["assigned", "accepted", "completed"],
      default: "assigned",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
