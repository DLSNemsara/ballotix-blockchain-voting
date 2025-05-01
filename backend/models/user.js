import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    maxLength: [30, "Your name cannot exceed 30 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [validator.isEmail, "Please enter valid email address"],
  },
  otp: {
    type: String,
    select: false,
  },
  otpExpire: String,
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  hasVoted: {
    type: Boolean,
    default: false,
  },
  eAddress: {
    type: String,
    required: [true, "Ethereum account address needed"],
    unique: true,
    validate: {
      validator: function (v) {
        return /^0x[a-fA-F0-9]{40}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid Ethereum address!`,
    },
  },
  electionOngoing: {
    type: Boolean,
    default: false,
  },
});

// Encrypting otp
userSchema.pre("save", async function (next) {
  if (!this.isModified("otp") || !this.otp) {
    return next();
  }

  try {
    const otpString = String(this.otp);
    this.otp = await bcrypt.hash(otpString, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare user OTP
userSchema.methods.compareOtp = async function (enteredOtp) {
  if (!this.otp || !enteredOtp) {
    return false;
  }

  try {
    // Ensure both values are strings and compare
    return await bcrypt.compare(String(enteredOtp), String(this.otp));
  } catch (error) {
    console.error("OTP comparison error:", error);
    return false;
  }
};

// Return jsonwebtoken
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
};

// Generate OTP
userSchema.methods.getOtp = function () {
  // Generate otp
  this.otp = crypto.randomBytes(5).toString("hex");

  // Set otp expire time (5 minutes)
  this.otpExpire = Date.now() + 5 * 60 * 1000;

  return this.otp;
};

// Add index for frequently queried fields
userSchema.index({ email: 1 });
userSchema.index({ eAddress: 1 });

const User = mongoose.model("User", userSchema);

export default User;
