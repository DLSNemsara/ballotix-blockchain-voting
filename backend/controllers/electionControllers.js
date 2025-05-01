import { ErrorHandler } from "../utils/errorHandler.js";
import catchAsyncError from "../middlewares/catchAsyncErrors.js";
import User from "../models/user.js";
import { sendEmail } from "../utils/sendEmail.js";
import { sendEmail as sendEmailProd } from "../utils/sendEmailProd.js";

// Start election
// Access -> Admin
// Route -> /api/election/startElection
export const startElection = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  // Send emails and update users in parallel
  await Promise.all(
    users.map(async (user) => {
      // Send email about election start
      await electionEmail(user, "Election has started. Login to vote", next);

      // Update user's election status
      await updateUser(user, true);
    })
  );

  res.status(200).json({
    success: true,
    message: "Election started successfully",
  });
});

// End election
// Access -> Admin
// Route -> /api/election/endElection
export const endElection = catchAsyncError(async (req, res, next) => {
  const { address } = req.body;

  if (!address) {
    return next(new ErrorHandler("Election address is required", 400));
  }

  const users = await User.find();

  // Send emails and update users in parallel
  await Promise.all(
    users.map(async (user) => {
      // Send email about election end
      const message = `Election has ended. Visit ${req.protocol}://${req.get("host")}/results/${address}`;
      await electionEmail(user, message, next);

      // Update user's election status
      await updateUser(user, false);

      // Reset user's vote status
      await updateUserVote(user);
    })
  );

  res.status(200).json({
    success: true,
    message: "Election ended successfully",
  });
});

// Helper function to update user's election status
const updateUser = async (user, bool) => {
  try {
    await User.findByIdAndUpdate(
      user.id,
      { electionOngoing: bool },
      {
        new: true,
        runValidators: true,
      }
    );
  } catch (error) {
    console.error(`Error updating user ${user.id}:`, error);
  }
};

// Helper function to reset user's vote status
const updateUserVote = async (user) => {
  try {
    await User.findByIdAndUpdate(
      user.id,
      { hasVoted: false },
      {
        new: true,
        runValidators: true,
      }
    );
  } catch (error) {
    console.error(`Error updating vote status for user ${user.id}:`, error);
  }
};

// Helper function to send election emails
const electionEmail = async (user, message, next) => {
  try {
    if (process.env.NODE_ENV === "production") {
      await sendEmailProd({
        to: user.email,
        subject: "Election Update",
        html: `<p>${message}</p>`,
      });
    } else {
      await sendEmail({
        email: user.email,
        subject: "Election Update",
        message,
      });
    }
  } catch (error) {
    console.error(`Error sending email to ${user.email}:`, error);
    return next(new ErrorHandler("Failed to send email notification", 500));
  }
};

// Helper function to sort candidates by votes
export const sortCandidates = (candidates) => {
  return candidates.sort((a, b) => b.votes - a.votes);
};
