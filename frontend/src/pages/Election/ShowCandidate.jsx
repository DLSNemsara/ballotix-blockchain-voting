import { useContext, useEffect, useState } from "react";
import AuthContext from "../../store/auth-context";
import Electioneth from "../../ethereum/election";
import axios from "axios";
import web3 from "../../ethereum/web3";
import { useNavigate } from "react-router";
import { FaUserCircle } from "react-icons/fa";
import { FaVoteYea } from "react-icons/fa";

/**
 * Component for displaying a single candidate
 */
const ShowCandidate = ({ id, candidate, candidateCount, setLoading }) => {
  const { user, validAccount, notify, election, setUser } =
    useContext(AuthContext);
  const [vote, setVote] = useState(Number(candidate.votes?.toString() || 0));
  const [badgeBounce, setBadgeBounce] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidateVotes = async () => {
      const Election = Electioneth(election);
      const newCandidate = await Election.methods.candidates(id).call();
      setVote(Number(newCandidate.votes?.toString() || 0));
    };

    fetchCandidateVotes();
    setBadgeBounce(true);
    const timeout = setTimeout(() => setBadgeBounce(false), 600);
    return () => clearTimeout(timeout);
  }, [election, id]);

  /**
   * Handles voting for a candidate
   */
  const voteHandler = async (candidateIndex) => {
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
      await Election.methods.voteCandidate(candidateIndex).send({
        from: accounts[0],
      });
      setVote((prevVote) => prevVote + 1);
      notify("You have successfully voted for a candidate", "success");
    } catch (err) {
      notify(err.message, "error");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(
        "/election/vote",
        {},
        { withCredentials: true }
      );
      setUser(response.data.user);
    } catch (err) {
      notify(
        err.response?.data?.errMessage || "Error updating vote status",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center my-6">
      <div className="flex flex-col items-center p-6 w-full max-w-md bg-white rounded-2xl shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg">
        <div className="flex relative flex-col items-center w-full">
          {candidate.url ? (
            <img
              className="object-cover w-28 h-28 rounded-full border-4 border-indigo-200 shadow-md"
              src={candidate.url}
              alt={candidate.name}
            />
          ) : (
            <FaUserCircle className="w-28 h-28 text-gray-300" />
          )}
          <span
            className={`flex absolute top-0 right-0 items-center px-3 py-1 text-xs font-semibold text-white bg-indigo-500 rounded-full shadow-md transition-transform duration-500 ${badgeBounce ? "animate-bounce" : ""}`}
          >
            <FaVoteYea className="mr-1" /> {vote} votes
          </span>
        </div>
        <h3 className="mt-4 w-full text-xl font-semibold text-center text-gray-800 break-words">
          {candidate.name}
        </h3>
        <p className="mt-2 w-full text-center text-gray-600 break-words">
          {candidate.description}
        </p>
        {user && user.electionOngoing && (
          <button
            onClick={() => voteHandler(id)}
            disabled={user.hasVoted}
            className={`px-4 py-2 mt-4 text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-md transition hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 ${user.hasVoted ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {user.hasVoted ? "Voted" : "Vote"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ShowCandidate;
