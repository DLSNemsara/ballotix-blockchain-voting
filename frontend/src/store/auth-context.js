import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import React from "react";
import Loading from "../components/Loading";
import factory from "../ethereum/factory";
import election from "../ethereum/election";

/**
 * Authentication context for managing user state and Ethereum interactions
 */
const AuthContext = React.createContext({
  user: {}, // Current user data
  election: "", // Current election address
  loading: false, // Loading state
  validAccount: false, // Whether the current Ethereum account is valid
  setUser: () => {}, // Function to update user data
  notify: () => {}, // Function to show notifications
  getAccount: () => {}, // Function to get Ethereum account
  setElection: () => {}, // Function to update election address
  results: [], // Array of election result addresses
  setResults: () => {}, // Function to update results
  names: [], // Array of election names
  setNames: () => {}, // Function to update election names
  syncUserAndElection: () => {},
  checkElectionStatus: () => {},
});

// Provider component for the authentication context
export const AuthContextProvider = (props) => {
  const [results, setResults] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [validAccount, setValidAccount] = useState(false);
  const [election, setElectionState] = useState(
    localStorage.getItem("election") ||
      "0x0000000000000000000000000000000000000000"
  );
  const [names, setNames] = useState([]);

  // Set election and persist to localStorage
  const setElection = (address) => {
    setElectionState(address);
    localStorage.setItem("election", address);
  };

  // Function to check election status
  const checkElectionStatus = async (address) => {
    if (!address || address === "0x0000000000000000000000000000000000000000")
      return false;

    try {
      const Election = election(address);
      const started = await Election.methods.started().call();
      const ended = await Election.methods.ended().call();
      return started && ended;
    } catch (err) {
      console.error("Error checking election status:", err);
      return false;
    }
  };

  // Function to sync both user and election address
  const syncUserAndElection = async () => {
    setLoading(true);
    try {
      // Fetch user from backend
      const userResp = await axios.get("/election/getUser", {
        withCredentials: true,
      });

      // Get election address from contract
      const address = await factory.methods.deployedElection().call();

      // Check if election exists and is active
      const isActive = await checkElectionStatus(address);

      // Update user state with election status
      const updatedUser = {
        ...userResp.data.user,
        electionOngoing: isActive,
      };

      setUser(updatedUser);
      setElection(address);

      // If election is not active, clear it from state
      if (
        !isActive &&
        address !== "0x0000000000000000000000000000000000000000"
      ) {
        setElection("0x0000000000000000000000000000000000000000");
      }
    } catch (err) {
      console.error("Error syncing state:", err);
      setUser(null);
      setElection("0x0000000000000000000000000000000000000000");
    }
    setLoading(false);
  };

  // On mount, sync both user and election
  useEffect(() => {
    syncUserAndElection();
    // eslint-disable-next-line
  }, []);

  // Handle Ethereum account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = () => getAccount();
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      };
    }
  }, [user]);

  // Check for MetaMask installation
  useEffect(() => {
    if (!window.ethereum) {
      toast.error("Please install MetaMask", {
        autoClose: false,
        position: toast.POSITION.TOP_CENTER,
      });
      window.location.href = "https://metamask.io/";
    }
  }, []);

  // Get and validate the current Ethereum account
  const getAccount = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (user && accounts[0] && user.eAddress) {
        setValidAccount(
          accounts[0].toUpperCase() === user.eAddress.toUpperCase()
        );
      }
    } catch (err) {
      toast.error("Please connect to MetaMask", {
        autoClose: false,
        position: toast.POSITION.TOP_CENTER,
      });
      window.location.href = "https://metamask.io/";
    }
  };

  // React notifier
  const notify = (message, status) => {
    const options = {
      autoClose: 3000,
      position: toast.POSITION.BOTTOM_RIGHT,
    };
    switch (status) {
      case "error":
        toast.error(message, options);
        break;
      case "success":
        toast.success(message, options);
        break;
      default:
        toast.info(message, options);
    }
  };

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      notify,
      getAccount,
      election,
      validAccount,
      setElection,
      results,
      setResults,
      names,
      setNames,
      syncUserAndElection,
      checkElectionStatus,
    }),
    [user, election, validAccount, results, names]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {loading ? <Loading /> : props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
