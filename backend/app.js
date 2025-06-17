import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import errorMiddleware from "./middlewares/error.js";
import upload from "./middlewares/upload.js";
import catchAsyncError from "./middlewares/catchAsyncErrors.js";
import userRoutes from "./routes/user.js";
import electionRoutes from "./routes/election.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.post(
  "/api/upload",
  upload.single("image"),
  catchAsyncError(async (req, res, next) => {
    console.log("File upload received:", req.file);
    if (!req.file) {
      console.log("❌ No file attached");
      return res.status(400).json({ error: "No file uploaded" });
    }
    res.json({ file: req.file.path });
  })
);

// Routes
app.use("/api/election", userRoutes);
app.use("/api/election", electionRoutes);

// Production setup
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../dist")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../dist", "index.html"))
  );
}

// Error handling
app.use(errorMiddleware);

export default app;
