import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import connectDB from "./config/database.js";
import User from "./models/user.js";
import { sendEmail } from "./utils/sendEmail.js";
import { sendEmail as sendEmailProd } from "./utils/sendEmailProd.js";
import { emails } from "./data/data.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "config", "config.env") });

// Delete all users and register new ones
async function seedDatabase() {
  try {
    console.log("Starting database seeding...");

    // Delete existing users
    await User.deleteMany();
    console.log("✓ All existing users deleted");

    // Register new users
    for (const userData of emails) {
      await registerUser(userData);
    }
    console.log("✓ All users registered successfully");

    process.exit(0);
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
}

// Register a single user
async function registerUser(userData) {
  try {
    const user = await User.create(userData);

    // Send registration email
    const message = {
      email: user.email,
      subject: "Election Account Registration",
      message: `Your account has been registered successfully.\nEmail: ${user.email}\nRole: ${user.role}`,
    };

    if (process.env.NODE_ENV === "production") {
      await sendEmailProd({
        to: user.email,
        subject: message.subject,
        html: `<p>${message.message}</p>`,
      });
    } else {
      await sendEmail(message);
    }

    console.log(`✓ User registered: ${user.email}`);
  } catch (error) {
    console.error(`Error registering user ${userData.email}:`, error);
    throw error;
  }
}

// Error handling
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

// Connect to database and run seeders
connectDB()
  .then(() => {
    console.log("✓ Database connected successfully");
    seedDatabase();
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });
