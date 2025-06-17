import axios from "axios";
import { useContext, useEffect } from "react";
import AuthContext from "../../store/auth-context";
import Electioneth from "../../ethereum/election";
import Factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { useNavigate } from "react-router-dom";

/**
 * Component for ending an election
 */
const EndElection = ({ setLoading }) => {
  const { user, election, notify, syncUserAndElection } =
    useContext(AuthContext);
  const navigate = useNavigate();

  // Set up event listener for election end
  useEffect(() => {
    if (!election || election === "0x0000000000000000000000000000000000000000")
      return;

    const Election = Electioneth(election);

    // Listen for changes in the started state
    const subscription = Election.events.allEvents({}, (error, event) => {
      if (error) {
        console.error("Event error:", error);
        return;
      }

      // If we detect any state change, sync the UI
      syncUserAndElection();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [election, syncUserAndElection]);

  /**
   * Handles ending the election
   * @param {Event} e - Click event
   */
  const endElectionHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const account = await web3.eth.getAccounts();
    if (account[0] !== user.eAddress) {
      notify("You are using wrong ethereum account", "error");
      setLoading(false);
      return;
    }

    try {
      const Election = Electioneth(election);
      const accounts = await web3.eth.getAccounts();

      // End election in Election contract and wait for confirmation
      const tx = await Election.methods.endElection().send({
        from: accounts[0],
      });

      // Wait for transaction to be mined
      await tx.transactionHash;

      // End election in ElectionFactory and wait for confirmation
      const factoryTx = await Factory.methods.clearFactory().send({
        from: accounts[0],
      });

      // Wait for factory transaction to be mined
      await factoryTx.transactionHash;

      // Update backend state
      await axios.put(
        "election/endElection",
        { address: election },
        { withCredentials: true }
      );

      // Sync both user and election state
      await syncUserAndElection();

      notify("Election has ended successfully", "success");
      navigate("/results");
    } catch (err) {
      if (err.message.includes("Transaction reverted")) {
        notify("This election has already ended", "error");
      } else {
        notify(err.message || "Error ending election", "error");
      }
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="px-6 py-2 w-full text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 md:w-auto"
      onClick={endElectionHandler}
    >
      End Election
    </button>
  );
};

export default EndElection;
