import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../Login";
import axios from "axios";
import AuthContext from "../../store/auth-context";

// Mock axios
jest.mock("axios");

// Mock the AuthContext
const mockSetUser = jest.fn();
const mockNotify = jest.fn();
const mockNavigate = jest.fn();

const mockAuthContext = {
  user: null,
  setUser: mockSetUser,
  notify: mockNotify,
};

// Mock useNavigate
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    axios.post.mockReset();
  });

  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <Login />
        </AuthContext.Provider>
      </BrowserRouter>
    );
  };

  test("renders login form with email input", () => {
    renderLogin();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send otp/i })
    ).toBeInTheDocument();
  });

  test("shows error when submitting empty email", async () => {
    renderLogin();
    const sendOtpButton = screen.getByRole("button", { name: /send otp/i });

    fireEvent.click(sendOtpButton);

    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith("Enter an email please", "error");
    });
  });

  test("handles successful OTP sending", async () => {
    axios.post.mockResolvedValueOnce({});
    renderLogin();

    const emailInput = screen.getByLabelText(/email/i);
    const sendOtpButton = screen.getByRole("button", { name: /send otp/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(sendOtpButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("/api/election/generateOtp", {
        email: "test@example.com",
      });
      expect(mockNotify).toHaveBeenCalledWith(
        "OTP has been sent to the email",
        "success"
      );
      expect(screen.getByLabelText(/otp/i)).toBeInTheDocument();
    });
  });

  test("handles failed OTP sending", async () => {
    const errorMessage = "Failed to send OTP";
    axios.post.mockRejectedValueOnce({
      response: { data: { errMessage: errorMessage } },
    });

    renderLogin();

    const emailInput = screen.getByLabelText(/email/i);
    const sendOtpButton = screen.getByRole("button", { name: /send otp/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(sendOtpButton);

    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith(errorMessage, "error");
    });
  });

  test("handles successful login", async () => {
    const mockUser = { id: 1, email: "test@example.com" };
    axios.post
      .mockResolvedValueOnce({}) // First call for OTP generation
      .mockResolvedValueOnce({ data: { user: mockUser } }); // Second call for login

    renderLogin();

    // First send OTP
    const emailInput = screen.getByLabelText(/email/i);
    const sendOtpButton = screen.getByRole("button", { name: /send otp/i });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(sendOtpButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/otp/i)).toBeInTheDocument();
    });

    // Then login with OTP
    const otpInput = screen.getByLabelText(/otp/i);
    const loginButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(otpInput, { target: { value: "123456" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "/api/election/login",
        { email: "test@example.com", otp: "123456" },
        expect.any(Object)
      );
      expect(mockSetUser).toHaveBeenCalledWith(mockUser);
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  test("disables send OTP button during countdown", async () => {
    axios.post.mockResolvedValueOnce({});
    renderLogin();

    const emailInput = screen.getByLabelText(/email/i);
    const sendOtpButton = screen.getByRole("button", { name: /send otp/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(sendOtpButton);

    await waitFor(() => {
      expect(sendOtpButton).not.toBeInTheDocument();
    });
  });

  test("shows loading state during API calls", async () => {
    axios.post.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );
    renderLogin();

    const emailInput = screen.getByLabelText(/email/i);
    const sendOtpButton = screen.getByRole("button", { name: /send otp/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(sendOtpButton);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
