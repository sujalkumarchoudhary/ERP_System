import connectDB from "../config/db.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const resetAdmin = async () => {
    try {
        await connectDB();
        const hashedPassword = await bcrypt.hash("admin123", 10);

        // Find AND update or create
        const admin = await User.findOneAndUpdate(
            { email: "admin@gmail.com" },
            {
                name: "Super Admin",
                password: hashedPassword,
                role: "admin"
            },
            { new: true, upsert: true }
        );

        console.log("Admin RESET successfully");
        console.log("Email: admin@gmail.com");
        console.log("Password: admin123");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

resetAdmin();
