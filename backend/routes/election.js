import express from "express";
import { isAuthenticatedUser, authorizeRoles } from "../middlewares/auth.js";
import {
  startElection,
  endElection,
} from "../controllers/electionControllers.js";

const router = express.Router();

// Admin routes
router
  .route("/startElection")
  .get(isAuthenticatedUser, authorizeRoles("admin"), startElection);

router
  .route("/endElection")
  .put(isAuthenticatedUser, authorizeRoles("admin"), endElection);

export default router;
