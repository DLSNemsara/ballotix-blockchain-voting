import axios from "axios";
import { useContext } from "react";
import AuthContext from "../../store/auth-context";
import Electioneth from "../../ethereum/election";
import web3 from "../../ethereum/web3";

/**
 * Component for starting an election
 */
const StartElection = ({ setLoading }) => {
  const { user, election, notify, syncUserAndElection } =
    useContext(AuthContext);

  /**
   * Handles starting the election
   * @param {Event} e - Click event
   */
  const startElectionHandler = async (e) => {
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
      await Election.methods.startElection().send({
        from: accounts[0],
      });
      notify("Election has been started", "success");
    } catch (err) {
      notify(err.message, "error");
      setLoading(false);
      return;
    }

    try {
      await axios.get("/election/startElection", {
        withCredentials: true,
      });
      // Sync both user and election state
      await syncUserAndElection();
    } catch (err) {
      notify(
        err.response?.data?.errMessage || "Error starting election",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="px-6 py-2 w-full text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 md:w-auto"
      onClick={startElectionHandler}
    >
      Start Election
    </button>
  );
};

export default StartElection;
