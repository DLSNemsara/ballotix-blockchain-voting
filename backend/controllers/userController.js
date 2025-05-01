import User from "../models/user.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import catchAsyncError from "../middlewares/catchAsyncErrors.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import { sendEmail as sendEmailProd } from "../utils/sendEmailProd.js";
import crypto from "crypto";

// Register a user
//Access -> Admin
//Route -> /api/election/register
export const registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, eAddress } = req.body;

  if (!email) {
    return next(new ErrorHandler("Email is required", 400));
  }

  const user = await User.create({
    name,
    email,
    eAddress,
  });

  res.status(201).json({
    success: true,
    user,
  });
});

// Get user profile
//Route -> api/election/getUser
export const getUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Generate OTP for login
//Route -> /api/election/generateOtp
export const generateOTP = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorHandler("Email is required", 400));
  }

  //Finding user
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("Invalid Email", 404));
  }

  //Generating Otp
  const otp = user.getOtp();
  //saving otp in user
  await user.save({ validateBeforeSave: false });
  //Sending otp email
  const message = `Your OTP to login is ${otp}. It will expire in 5 minutes`;

  try {
    if (process.env.NODE_ENV === "production") {
      await sendEmailProd({
        to: user.email,
        subject: "New OTP",
        html: `<p>${message}</p>`,
      });
    } else {
      await sendEmail({
        email: user.email,
        subject: "New OTP",
        message,
      });
    }

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`,
    });
  } catch (error) {
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler("Email could not be sent", 500));
  }
});

// Login user
// api/election/login
export const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(new ErrorHandler("Please enter email and OTP", 400));
  }

  try {
    //Finding user in the database
    const user = await User.findOne({
      email,
      otpExpire: { $gt: Date.now() },
    }).select("+otp");

    if (!user) {
      return next(new ErrorHandler("OTP is invalid or expired", 400));
    }

    // Debug logs
    console.log("User found:", !!user);
    console.log("OTP in request:", otp);
    console.log("Stored OTP (hashed):", user.otp);

    //Checking if the OTP is correct
    const isOtpMatched = await user.compareOtp(otp);
    if (!isOtpMatched) {
      return next(new ErrorHandler("Invalid OTP", 401));
    }

    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    sendToken(user, 200, res);
  } catch (error) {
    console.error("Login error:", error);
    return next(new ErrorHandler(error.message || "Login failed", 500));
  }
});

// Logout user
//Route -> /api/election/logout
export const logoutUser = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// Get all users (Admin only)
//Route -> /api/election/allusers
export const allUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find().select("-otp -otpExpire");

  res.status(200).json({
    success: true,
    users,
  });
});

// Vote for a candidate
//Route -> /api/election/vote
export const vote = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;
  const newUserData = {
    hasVoted: true,
  };

  const user = await User.findByIdAndUpdate(userId, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// Delete user (Admin only)
//Route -> /api/election/delete/:id
export const deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User not found with id ${req.params.id}`, 404)
    );
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

// Edit user profile
//Route -> /api/election/edit
//Access -> Private(user)
export const editUser = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;
  const { name, eAddress } = req.body;

  const newUserData = {
    name,
    eAddress,
  };

  const user = await User.findByIdAndUpdate(userId, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});
