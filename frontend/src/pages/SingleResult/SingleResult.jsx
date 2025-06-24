import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import { useGetResults } from "../../components/hooks/get-results";
import Loading from "../../components/Loading";
import { Link, useNavigate } from "react-router-dom";
import Electioneth from "../../ethereum/election";
import AuthContext from "../../store/auth-context";
import ShowResult from "./ShowResult";
import confetti from "canvas-confetti";

const SingleResult = () => {
  const [loading, setLoading] = useState(false);
  const [isDraw, setIsDraw] = useState(false);
  const [electionName, setElectionName] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [candidateCount, setCount] = useState(0);
  const { address } = useParams();
  const { notify, results } = useContext(AuthContext);
  const navigate = useNavigate();

  useGetResults(setLoading);

  useEffect(() => {
    console.log("🧠 Election address param:", address);
    console.log("📦 Results context array:", results);

    const fetchElectionResults = async () => {
      setLoading(true);

      if (!results.includes(address)) {
        navigate(-1);
        notify("Invalid election address", "error");
        return;
      }

      try {
        const Election = Electioneth(address);

        const count = await Election.methods.candidateCount().call();
        setCount(+count);

        const name = await Election.methods.electionName().call();
        setElectionName(name);

        const rawCandidates = await Promise.all(
          Array(+count)
            .fill(1)
            .map((_, index) => Election.methods.candidates(index).call())
        );
        console.log("=== RAW CANDIDATES ===", rawCandidates);

        // Normalize votes
        const normalizedCandidates = rawCandidates.map((c, i) => {
          console.log(`[candidate ${i}] raw votes:`, c.votes);

          let votes = 0n;
          try {
            votes = BigInt(c.votes.toString()); // safe for BN or string
          } catch (err) {
            console.error(`Vote parse error at [${i}]`, c.votes, err);
            votes = 0n;
          }

          return { ...c, votes };
        });

        // Sort by votes
        normalizedCandidates.sort((a, b) => {
          if (a.votes > b.votes) return -1;
          if (a.votes < b.votes) return 1;
          return 0;
        });

        // Detect draw
        if (
          normalizedCandidates.length >= 2 &&
          normalizedCandidates[0].votes === normalizedCandidates[1].votes
        ) {
          setIsDraw(true);
        }

        setCandidates(normalizedCandidates);
        console.log("=== FINAL NORMALIZED CANDIDATES ===");
        normalizedCandidates.forEach((c, i) => {
          console.log(
            `[${i}] Name: ${c.name}, Votes (type: ${typeof c.votes}):`,
            c.votes
          );
        });

        // Confetti
        if (!isDraw && count > 0) {
          confetti({ particleCount: 250, spread: 70, origin: { y: 0.6 } });
        }
      } catch (err) {
        notify(err.message, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchElectionResults();
  }, [address, results, notify, navigate, isDraw]);

  return (
    <>
      {loading && <Loading />}
      {!loading && candidateCount === 0 && (
        <p className="mt-5 text-center text-gray-900">No candidates found</p>
      )}
      {!loading && candidateCount > 0 && (
        <div className="flex flex-col">
          <div>
            <h2 className="mt-5 mb-8 text-3xl font-bold text-center text-gray-900">
              {electionName}
            </h2>
          </div>
          <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
            {candidates.map((candidate, index) => (
              <ShowResult
                key={index}
                id={index}
                candidate={candidate}
                isDraw={isDraw}
              />
            ))}
          </div>
          <div className="flex justify-center mt-5">
            <Link
              to="/results"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-md border border-transparent hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
            >
              All Results
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default SingleResult;
