import express from "express";
import {
  getUser,
  generateOTP,
  registerUser,
  loginUser,
  allUsers,
  deleteUser,
  logoutUser,
  vote,
  editUser,
} from "../controllers/userController.js";
import { isAuthenticatedUser, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

// Public routes
router.route("/generateOtp").post(generateOTP);
router.route("/login").post(loginUser);

// Authenticated user routes
router.route("/logout").get(logoutUser);
router.route("/vote").put(isAuthenticatedUser, vote);
router.route("/getUser").get(isAuthenticatedUser, getUser);
router.route("/edit").put(isAuthenticatedUser, editUser);

// Admin routes
router
  .route("/register")
  .post(isAuthenticatedUser, authorizeRoles("admin"), registerUser);

router
  .route("/allUsers")
  .get(isAuthenticatedUser, authorizeRoles("admin"), allUsers);

router
  .route("/delete/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

export default router;
