import mongoose from "mongoose";

const salesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    start: {
      type: Date,
      required: true,
      index: true,
    },
    end: {
      type: Date,
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Live", "Ended"],
    },
  },
  { timestamps: true }
);

// ✅ AUTO STATUS BASED ON DATE
salesSchema.pre("save", function () {
  const today = new Date();

  if (this.end < today) {
    this.status = "Ended";
  } else {
    this.status = "Live";
  }
});

export default mongoose.model("Sales", salesSchema);
