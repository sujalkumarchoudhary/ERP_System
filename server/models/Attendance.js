import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    date: {
        type: String,
        required: true
    },

    punchIn: Date,
    punchOut: Date,

    lateMinutes: {
        type: Number,
        default: 0
    },

    isLate: {
        type: Boolean,
        default: false
    },

    totalMinutes: {
        type: Number,
        default: 0
    },

    overtimeMinutes: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);
