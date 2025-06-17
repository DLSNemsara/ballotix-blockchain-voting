// Create and send JWT token
export const sendToken = (user, statusCode, res) => {
  // Creating token
  const token = user.getJwtToken();

  // Environment-aware cookie settings
  const isProduction = process.env.NODE_ENV === "production";

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};
