import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Attendance from "../models/Attendance.js";

dotenv.config();

const seedAttendance = async () => {
    try {
        await connectDB();
        console.log("Database Connected...");

        const today = new Date().toISOString().split("T")[0];

        // 1. Get all employees
        const employees = await User.find({ role: "employee" });
        console.log(`Found ${employees.length} employees to punch in.`);

        // 2. Clear existing attendance for today (to avoid duplicates if run multiple times)
        await Attendance.deleteMany({ date: today });

        // 3. Create Attendance
        for (const emp of employees) {
            const isLate = Math.random() > 0.7; // 30% chance of being late
            const punchInTime = new Date();

            // Randomize punch time
            if (isLate) {
                punchInTime.setHours(10, Math.floor(Math.random() * 30), 0); // 10:00 - 10:30
            } else {
                punchInTime.setHours(9, Math.floor(Math.random() * 30), 0); // 9:00 - 9:30
            }

            await Attendance.create({
                userId: emp._id,
                date: today,
                punchIn: punchInTime,
                isLate: isLate,
                lateMinutes: isLate ? Math.floor((punchInTime - new Date().setHours(9, 30, 0, 0)) / 60000) : 0,
                status: isLate ? "Late" : "On Time" // Optional if schema has it
            });

            console.log(`Punched in: ${emp.email} (${isLate ? "Late" : "On Time"})`);
        }

        console.log("Attendance seeded successfully!");
        process.exit();

    } catch (error) {
        console.error("Error seeding attendance:", error);
        process.exit(1);
    }
};

seedAttendance();
