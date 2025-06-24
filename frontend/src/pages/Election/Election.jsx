import { useContext, useEffect, useState } from "react";
import AuthContext from "../../store/auth-context";
import Electioneth from "../../ethereum/election";
import ShowCandidate from "./ShowCandidate";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router";
import StartElection from "./StartElection";
import EndElection from "./EndElection";
import { useEndElection } from "../../components/hooks/end-election";
import { Link } from "react-router-dom";

const Election = () => {
  const { user, election, notify } = useContext(AuthContext);

  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [candidateCount, setCount] = useState(0);
  const [electionName, setElectionName] = useState("");
  const [loading, setLoading] = useState(false);

  // Debug
  // console.log("Election page user (full):", JSON.stringify(user));
  // console.log("Election page election:", election);

  // Redirect logic
  useEffect(() => {
    if (!user) {
      notify("Please login first", "error");
      navigate("/login");
      return;
    }

    if (election === "0x0000000000000000000000000000000000000000") {
      navigate("/");
      return;
    }

    if (user.electionOngoing === false && user.role !== "admin") {
      notify("There is no ongoing election", "error");
      navigate("/");
    }
  }, [user, election, notify, navigate]);

  // Fetch election data
  useEffect(() => {
    const fetchElectionData = async () => {
      if (
        !election ||
        election === "0x0000000000000000000000000000000000000000"
      ) {
        // console.warn("No valid election contract. Skipping data fetch.");
        return;
      }

      setLoading(true);
      try {
        // console.log("[Election.jsx] Creating contract instance for:", election);
        const Election = Electioneth(election);

        // console.log("[Election.jsx] Fetching started/ended flags...");
        const started = await Election.methods.started().call();
        const ended = await Election.methods.ended().call();
        // console.log(
        //   `[Election.jsx] Election started: ${started}, ended: ${ended}`
        // );

        // console.log("[Election.jsx] Fetching candidate count...");
        const count = await Election.methods.candidateCount().call();
        const countNum = Number(count);
        setCount(countNum);
        // console.log(`[Election.jsx] Candidate count: ${countNum}`);

        // console.log("[Election.jsx] Fetching election name...");
        const name = await Election.methods.electionName().call();
        setElectionName(name);
        // console.log(`[Election.jsx] Election name: ${name}`);

        if (countNum > 0) {
          // console.log("[Election.jsx] Fetching candidates...");
          const tempCandidates = await Promise.all(
            Array(countNum)
              .fill(1)
              .map((_, index) => Election.methods.candidates(index).call())
          );
          setCandidates(tempCandidates);
          // console.log("[Election.jsx] Candidates fetched:", tempCandidates);
        } else {
          setCandidates([]);
          // console.log("[Election.jsx] No candidates found.");
        }
      } catch (err) {
        // console.error("[Election.jsx] Error fetching election data:", err);
        notify("Error fetching election data", "error");
      } finally {
        setLoading(false);
        // console.log("[Election.jsx] Loading set to false");
      }
    };

    fetchElectionData();
  }, [election, notify]);

  // Handle election ending
  // useEndElection("election", setLoading); // If you want to use the hook, uncomment this line

  //   return (
  //     <>
  //       {/* Election Title Header */}
  //       {!loading && candidateCount >= 0 && (
  //         <h2 className="mt-10 mb-8 text-4xl font-extrabold tracking-tight text-center text-indigo-700 drop-shadow-md">
  //           {electionName}
  //         </h2>
  //       )}

  //       {/* No Candidates UI */}
  //       {!loading && candidateCount === 0 && (
  //         <div className="flex flex-col gap-6 justify-center items-center mt-16">
  //           <h2 className="text-2xl font-medium text-center text-gray-600">
  //             No candidates available. Click 'Add Candidate' to begin setting up
  //             your election!
  //           </h2>
  //           <Link
  //             to="/addCandidate"
  //             className="px-6 py-2 text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
  //           >
  //             Add Candidate
  //           </Link>
  //         </div>
  //       )}

  //       {/* Candidate grid and action buttons */}
  //       {!loading &&
  //         election !== "0x0000000000000000000000000000000000000000" &&
  //         candidateCount > 0 && (
  //           <>
  //             <div className="grid grid-cols-1 gap-6 px-6 pb-32 sm:grid-cols-2 lg:grid-cols-3">
  //               {candidates.map((candidate, index) => (
  //                 <ShowCandidate
  //                   key={index}
  //                   id={index}
  //                   candidate={candidate}
  //                   candidateCount={candidateCount}
  //                   setLoading={setLoading}
  //                 />
  //               ))}
  //             </div>

  //             {/* Action Button Bar (Bottom Fixed) */}
  //             <div className="fixed bottom-0 left-0 z-10 w-full border-t border-gray-300 shadow-md backdrop-blur-sm bg-white/80">
  //               <div className="flex flex-col gap-4 justify-center items-center px-4 py-4 md:flex-row">
  //                 {user && !user.electionOngoing && user.role === "admin" && (
  //                   <>
  //                     <div className="w-full md:w-auto">
  //                       <StartElection setLoading={setLoading} />
  //                     </div>
  //                     <Link to="/addCandidate" className="w-full md:w-auto">
  //                       <button className="px-6 py-2 w-full text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 md:w-auto">
  //                         Add Candidate
  //                       </button>
  //                     </Link>
  //                   </>
  //                 )}
  //                 {user && user.electionOngoing && user.role === "admin" && (
  //                   <div className="w-full md:w-auto">
  //                     <EndElection setLoading={setLoading} />
  //                   </div>
  //                 )}
  //               </div>
  //             </div>
  //           </>
  //         )}

  //       {loading && <Loading />}
  //     </>
  //   );
  // };

  return (
    <>
      {loading && <Loading />}

      {!loading && (
        <div className="relative pb-40">
          {/* Election Title Header */}
          {candidateCount >= 0 && (
            <h2 className="mt-10 mb-8 text-4xl font-extrabold tracking-tight text-center text-indigo-700 drop-shadow-md">
              {electionName}
            </h2>
          )}

          {/* No Candidates UI */}
          {candidateCount === 0 && (
            <div className="flex flex-col gap-6 justify-center items-center mt-16">
              <h2 className="text-2xl font-medium text-center text-gray-600">
                No candidates available. Click 'Add Candidate' to begin setting
                up your election!
              </h2>
              <Link
                to="/addCandidate"
                className="px-6 py-2 text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                Add Candidate
              </Link>
            </div>
          )}

          {/* Candidate grid and action buttons */}
          {election !== "0x0000000000000000000000000000000000000000" &&
            candidateCount > 0 && (
              <>
                <div className="grid grid-cols-1 gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
                  {candidates.map((candidate, index) => (
                    <ShowCandidate
                      key={index}
                      id={index}
                      candidate={candidate}
                      candidateCount={candidateCount}
                      setLoading={setLoading}
                    />
                  ))}
                </div>

                {/* Action Button Bar (Now absolute inside relative wrapper) */}
                <div className="absolute bottom-0 left-0 w-full border-t border-gray-300 shadow-md backdrop-blur-sm bg-white/80">
                  <div className="flex flex-col gap-4 justify-center items-center px-4 py-4 md:flex-row">
                    {user && !user.electionOngoing && user.role === "admin" && (
                      <>
                        <div className="w-full md:w-auto">
                          <StartElection setLoading={setLoading} />
                        </div>
                        <Link to="/addCandidate" className="w-full md:w-auto">
                          <button className="px-6 py-2 w-full text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 md:w-auto">
                            Add Candidate
                          </button>
                        </Link>
                      </>
                    )}
                    {user && user.electionOngoing && user.role === "admin" && (
                      <div className="w-full md:w-auto">
                        <EndElection setLoading={setLoading} />
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
        </div>
      )}
    </>
  );
};

export default Election;
