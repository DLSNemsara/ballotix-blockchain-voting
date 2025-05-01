import app from "./app.js";
import connectDB from "./config/database.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import mongoose from "mongoose";

mongoose.set("strictQuery", true);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.stack}`);
  console.log("Server is being shutdown due to uncaught exception");
  process.exit(1);
});

// Load environment variables
dotenv.config({ path: path.join(__dirname, "config", "config.env") });

// Connect to database
connectDB();

const server = app.listen(process.env.PORT, () => {
  console.log(`Server started on Port: ${process.env.PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Server is being shutdown due to unhandled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});
