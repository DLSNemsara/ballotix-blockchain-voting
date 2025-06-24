import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ShowCandidate from "../ShowCandidate";
import AuthContext from "../../../store/auth-context";
import Electioneth from "../../../ethereum/election";
import web3 from "../../../ethereum/web3";
import axios from "axios";

// Mock the Electioneth contract
jest.mock("../../../ethereum/election", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock web3
jest.mock("../../../ethereum/web3", () => ({
  eth: {
    getAccounts: jest.fn(),
  },
}));

// Mock axios
jest.mock("axios");

// Mock the AuthContext
const mockNotify = jest.fn();
const mockNavigate = jest.fn();
const mockSetUser = jest.fn();
const mockSetLoading = jest.fn();

// Mock useNavigate
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

describe("ShowCandidate Component", () => {
  const mockElectionContract = {
    methods: {
      candidates: jest.fn(),
      voteCandidate: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Electioneth.mockImplementation(() => mockElectionContract);
    web3.eth.getAccounts.mockResolvedValue(["0x123"]);
  });

  const renderShowCandidate = (user, election, candidate) => {
    const mockAuthContext = {
      user,
      election,
      validAccount: true,
      notify: mockNotify,
      setUser: mockSetUser,
    };

    return render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <ShowCandidate
            id={0}
            candidate={candidate}
            candidateCount={1}
            setLoading={mockSetLoading}
          />
        </AuthContext.Provider>
      </BrowserRouter>
    );
  };

  test("displays candidate information correctly", () => {
    const mockCandidate = {
      name: "John Doe",
      description: "Test description",
      url: "test-image.jpg",
      votes: "0",
    };

    renderShowCandidate(
      {
        role: "voter",
        electionOngoing: true,
        hasVoted: false,
        eAddress: "0x123",
      },
      "0x456",
      mockCandidate
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
    expect(screen.getByAltText("John Doe")).toHaveAttribute(
      "src",
      "test-image.jpg"
    );
  });

  test("shows vote button when election is ongoing and user has not voted", () => {
    const mockCandidate = {
      name: "John Doe",
      description: "Test description",
      url: "test-image.jpg",
      votes: "0",
    };

    renderShowCandidate(
      {
        role: "voter",
        electionOngoing: true,
        hasVoted: false,
        eAddress: "0x123",
      },
      "0x456",
      mockCandidate
    );

    expect(screen.getByText("Vote")).toBeInTheDocument();
  });

  test("hides vote button when user has already voted", () => {
    const mockCandidate = {
      name: "John Doe",
      description: "Test description",
      url: "test-image.jpg",
      votes: "0",
    };

    renderShowCandidate(
      {
        role: "voter",
        electionOngoing: true,
        hasVoted: true,
        eAddress: "0x123",
      },
      "0x456",
      mockCandidate
    );

    expect(screen.queryByText("Vote")).not.toBeInTheDocument();
  });

  test("handles successful voting process", async () => {
    const mockCandidate = {
      name: "John Doe",
      description: "Test description",
      url: "test-image.jpg",
      votes: "0",
    };

    mockElectionContract.methods.voteCandidate.mockResolvedValue({});
    axios.put.mockResolvedValue({ data: { user: { hasVoted: true } } });

    renderShowCandidate(
      {
        role: "voter",
        electionOngoing: true,
        hasVoted: false,
        eAddress: "0x123",
      },
      "0x456",
      mockCandidate
    );

    const voteButton = screen.getByText("Vote");
    fireEvent.click(voteButton);

    await waitFor(() => {
      expect(mockElectionContract.methods.voteCandidate).toHaveBeenCalled();
      expect(axios.put).toHaveBeenCalledWith(
        "/election/vote",
        {},
        { withCredentials: true }
      );
      expect(mockNotify).toHaveBeenCalledWith(
        "You have successfully voted for a candidate",
        "success"
      );
      expect(mockSetUser).toHaveBeenCalledWith({ hasVoted: true });
    });
  });

  test("shows error when using wrong Ethereum account", async () => {
    const mockCandidate = {
      name: "John Doe",
      description: "Test description",
      url: "test-image.jpg",
      votes: "0",
    };

    web3.eth.getAccounts.mockResolvedValue(["0x789"]);

    renderShowCandidate(
      {
        role: "voter",
        electionOngoing: true,
        hasVoted: false,
        eAddress: "0x123",
      },
      "0x456",
      mockCandidate
    );

    const voteButton = screen.getByText("Vote");
    fireEvent.click(voteButton);

    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith(
        "You are using wrong ethereum account",
        "error"
      );
    });
  });

  test("handles error during voting process", async () => {
    const mockCandidate = {
      name: "John Doe",
      description: "Test description",
      url: "test-image.jpg",
      votes: "0",
    };

    mockElectionContract.methods.voteCandidate.mockRejectedValue(
      new Error("Voting failed")
    );

    renderShowCandidate(
      {
        role: "voter",
        electionOngoing: true,
        hasVoted: false,
        eAddress: "0x123",
      },
      "0x456",
      mockCandidate
    );

    const voteButton = screen.getByText("Vote");
    fireEvent.click(voteButton);

    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith("Voting failed", "error");
    });
  });

  test("updates vote count when candidate data changes", async () => {
    const mockCandidate = {
      name: "John Doe",
      description: "Test description",
      url: "test-image.jpg",
      votes: "0",
    };

    mockElectionContract.methods.candidates.mockResolvedValue({ votes: "5" });

    renderShowCandidate(
      {
        role: "voter",
        electionOngoing: true,
        hasVoted: false,
        eAddress: "0x123",
      },
      "0x456",
      mockCandidate
    );

    await waitFor(() => {
      expect(mockElectionContract.methods.candidates).toHaveBeenCalled();
    });
  });
});
