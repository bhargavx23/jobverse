import mongoose from "mongoose";
import { User } from "./models/userModel.js";
import { mongoDBURL } from "./config.js";

async function createAdmin() {
  try {
    await mongoose.connect(mongoDBURL);

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("Admin user already exists:", {
        name: existingAdmin.name,
        email: existingAdmin.email,
        role: existingAdmin.role,
      });
      return;
    }

    // Create new admin user
    const adminUser = new User({
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
    });

    await adminUser.save();

    console.log("Admin user created successfully!");
    console.log("Email: admin@example.com");
    console.log("Password: admin123");
    console.log("Please change the password after first login.");
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();
