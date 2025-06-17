import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Election from "../Election";
import AuthContext from "../../../store/auth-context";
import Electioneth from "../../../ethereum/election";

// Mock the Electioneth contract
jest.mock("../../../ethereum/election", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock the AuthContext
const mockNotify = jest.fn();
const mockNavigate = jest.fn();

// Mock useNavigate
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

describe("Election Component", () => {
  const mockElectionContract = {
    methods: {
      candidateCount: jest.fn(),
      electionName: jest.fn(),
      candidates: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Electioneth.mockImplementation(() => mockElectionContract);
  });

  const renderElection = (user, election) => {
    const mockAuthContext = {
      user,
      election,
      notify: mockNotify,
    };

    return render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <Election />
        </AuthContext.Provider>
      </BrowserRouter>
    );
  };

  test("redirects to login when user is not authenticated", () => {
    renderElection(null, "0x123");

    expect(mockNotify).toHaveBeenCalledWith("Please login first", "error");
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("redirects to home when election address is invalid", () => {
    renderElection(
      { role: "voter" },
      "0x0000000000000000000000000000000000000000"
    );

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("redirects to home when no election is ongoing for non-admin users", () => {
    renderElection({ role: "voter", electionOngoing: false }, "0x123");

    expect(mockNotify).toHaveBeenCalledWith(
      "There is no ongoing election",
      "error"
    );
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("displays election name and candidates when data is loaded", async () => {
    const mockUser = { role: "voter", electionOngoing: true };
    const mockElectionAddress = "0x123";
    const mockCandidates = [
      { name: "Candidate 1", voteCount: "0" },
      { name: "Candidate 2", voteCount: "0" },
    ];

    mockElectionContract.methods.candidateCount.mockResolvedValue("2");
    mockElectionContract.methods.electionName.mockResolvedValue(
      "Test Election"
    );
    mockElectionContract.methods.candidates.mockImplementation((index) =>
      Promise.resolve(mockCandidates[index])
    );

    renderElection(mockUser, mockElectionAddress);

    await waitFor(() => {
      expect(screen.getByText("Test Election")).toBeInTheDocument();
      expect(screen.getByText("Candidate 1")).toBeInTheDocument();
      expect(screen.getByText("Candidate 2")).toBeInTheDocument();
    });
  });

  test("shows admin controls when user is admin and election is not ongoing", async () => {
    const mockUser = { role: "admin", electionOngoing: false };
    const mockElectionAddress = "0x123";

    mockElectionContract.methods.candidateCount.mockResolvedValue("0");
    mockElectionContract.methods.electionName.mockResolvedValue(
      "Test Election"
    );

    renderElection(mockUser, mockElectionAddress);

    await waitFor(() => {
      expect(screen.getByText("Add Candidate")).toBeInTheDocument();
      expect(screen.getByText("Start Election")).toBeInTheDocument();
    });
  });

  test("shows end election button when user is admin and election is ongoing", async () => {
    const mockUser = { role: "admin", electionOngoing: true };
    const mockElectionAddress = "0x123";

    mockElectionContract.methods.candidateCount.mockResolvedValue("0");
    mockElectionContract.methods.electionName.mockResolvedValue(
      "Test Election"
    );

    renderElection(mockUser, mockElectionAddress);

    await waitFor(() => {
      expect(screen.getByText("End Election")).toBeInTheDocument();
    });
  });

  test("shows loading state while fetching data", () => {
    const mockUser = { role: "voter", electionOngoing: true };
    const mockElectionAddress = "0x123";

    mockElectionContract.methods.candidateCount.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve("0"), 100))
    );

    renderElection(mockUser, mockElectionAddress);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("handles error when fetching election data", async () => {
    const mockUser = { role: "voter", electionOngoing: true };
    const mockElectionAddress = "0x123";

    mockElectionContract.methods.candidateCount.mockRejectedValue(
      new Error("Network error")
    );

    renderElection(mockUser, mockElectionAddress);

    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith(
        "Error fetching election data",
        "error"
      );
    });
  });
});
