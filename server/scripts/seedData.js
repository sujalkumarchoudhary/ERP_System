import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Department from "../models/Department.js";
import Employee from "../models/Employee.js";

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();
        console.log("Datbase Connected...");

        /* ================= CLEAR EXISTING DATA ================= */
        // Optional: keeping admin, clearing others
        await Department.deleteMany({});
        await Employee.deleteMany({});
        // Clean up non-admin users if you want
        await User.deleteMany({ role: { $ne: "admin" } });

        console.log("Old data cleared...");

        /* ================= CREATE DEPARTMENTS ================= */
        const depts = [
            { name: "Engineering", description: "Development Team" },
            { name: "HR", description: "Human Resources" },
            { name: "Sales", description: "Sales and Marketing" },
            { name: "Finance", description: "Accounts and Payroll" },
        ];

        const createdDepts = await Department.insertMany(depts);
        console.log(`Created ${createdDepts.length} departments`);

        const engineering = createdDepts.find(d => d.name === "Engineering");
        const hr = createdDepts.find(d => d.name === "HR");
        const sales = createdDepts.find(d => d.name === "Sales");

        /* ================= CREATE EMPLOYEES ================= */
        const commonPassword = await bcrypt.hash("employee123", 10);

        const employees = [
            {
                name: "Rahul Sharma",
                email: "rahul@gmail.com",
                role: "employee",
                department: engineering._id,
                designation: "Senior Developer",
                image: "https://randomuser.me/api/portraits/men/1.jpg",
                gender: "Male"
            },
            {
                name: "Priya Patel",
                email: "priya@gmail.com",
                role: "employee",
                department: hr._id,
                designation: "HR Manager",
                image: "https://randomuser.me/api/portraits/women/2.jpg",
                gender: "Female"
            },
            {
                name: "Amit Kumar",
                email: "amit@gmail.com",
                role: "employee",
                department: sales._id,
                designation: "Sales Executive",
                image: "https://randomuser.me/api/portraits/men/3.jpg",
                gender: "Male"
            },
            {
                name: "Sneha Gupta",
                email: "sneha@gmail.com",
                role: "employee",
                department: engineering._id,
                designation: "UI/UX Designer",
                image: "https://randomuser.me/api/portraits/women/4.jpg",
                gender: "Female"
            }
        ];

        for (const emp of employees) {
            // 1. Create User (Login)
            const user = await User.create({
                name: emp.name,
                email: emp.email,
                password: commonPassword,
                role: "employee",
                profileImage: emp.image
            });

            // 2. Create Employee Profile
            await Employee.create({
                user: user._id,
                name: emp.name, // Added name here too
                department: emp.department,
                designation: emp.designation,
                joiningDate: new Date(),

                // Personal Details
                fatherName: "Mr. Father",
                motherName: "Mrs. Mother",
                dob: new Date("1995-05-15"),
                gender: emp.gender,
                bloodGroup: "O+",
                maritalStatus: "Single",

                // Contact
                phone: "9876543210",
                alternatePhone: "9123456780",
                email: emp.email,

                // Address
                address: "123, Sample Street, Tech Park",
                city: "Bangalore",
                state: "Karnataka",
                pincode: "560100",
                nationality: "Indian",

                status: "Active"
            });
        }

        console.log(`Created ${employees.length} employees with login access.`);
        console.log("Password for all employees: employee123");

        process.exit();

    } catch (error) {
        console.error("Seed Error:", error);
        process.exit(1);
    }
};

seedData();
