// import { useContext, useEffect } from "react";
// import Electioneth from "../../ethereum/election";
// import Factory from "../../ethereum/factory";
// import web3 from "../../ethereum/web3";
// import { useNavigate } from "react-router";
// import axios from "axios";
// import AuthContext from "../../store/auth-context";

// export const useEndElection = (page, setLoading) => {
//   const navigate = useNavigate();
//   const { notify, election, setUser, setElection } = useContext(AuthContext);
//   //use effect to remove bug where user rejects second transaction while ending election
//   useEffect(() => {
//     (async () => {
//       if (election !== "0x0000000000000000000000000000000000000000") {
//         setLoading(true);
//         //get the election contract
//         const Election = Electioneth(election);
//         const accounts = await web3.eth.getAccounts();
//         let started = await Election.methods.started().call();
//         let ended = await Election.methods.ended().call();
//         //checking if correct election has ended
//         if (!started && ended) {
//           //removing election from factory
//           try {
//             await Factory.methods.clearFactory().send({
//               from: accounts[0],
//             });
//             notify("Election has ended", "success");
//           } catch (err) {
//             notify("You need to end the election to proceed", "error");
//             navigate("/");
//             return;
//           }

//           //changing electionOngoing to false and hasVoted to false
//           try {
//             setLoading(true);
//             await axios.put(
//               "/election/endElection",
//               {
//                 address: election,
//               },
//               {
//                 withCredentials: true,
//               }
//             );
//             //get updated user back
//             const response = await axios.get("/election/getUser", {
//               withCredentials: true,
//             });
//             console.log(response.data.user);
//             setUser(response.data.user);
//             setElection("0x0000000000000000000000000000000000000000");
//             if (page === "election") navigate(`/`);
//             else navigate("/election");
//           } catch (err) {
//             notify(err.response.data.errMessage, "error");
//             setLoading(false);
//             return;
//           }
//         }
//         setLoading(false);
//       }
//     })();
//   }, []);
// };

import { useContext } from "react";
import Electioneth from "../../ethereum/election";
import Factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { useNavigate } from "react-router";
import axios from "axios";
import AuthContext from "../../store/auth-context";

// Returns a function instead of executing side-effects directly
export const useEndElection = () => {
  const navigate = useNavigate();
  const { notify, election, setUser, setElection } = useContext(AuthContext);

  const endElectionCheck = async (page, setLoading) => {
    if (
      !election ||
      election === "0x0000000000000000000000000000000000000000"
    ) {
      return;
    }

    try {
      const Election = Electioneth(election);
      const accounts = await web3.eth.getAccounts();
      const started = await Election.methods.started().call();
      const ended = await Election.methods.ended().call();

      if (!started || !ended) return;

      setLoading(true);

      try {
        await Factory.methods.clearFactory().send({ from: accounts[0] });
        notify("Election has ended", "success");
      } catch (err) {
        notify("You need to end the election to proceed", "error");
        navigate("/");
        return;
      }

      try {
        await axios.put(
          "/election/endElection",
          { address: election },
          { withCredentials: true }
        );

        const response = await axios.get("/election/getUser", {
          withCredentials: true,
        });

        setUser(response.data.user);
        setElection("0x0000000000000000000000000000000000000000");

        if (page === "election") {
          navigate("/");
        } else {
          navigate("/election");
        }
      } catch (err) {
        notify(err.response?.data?.errMessage || "Server error", "error");
      } finally {
        setLoading(false);
      }
    } catch (err) {
      console.error("Election end check failed:", err);
    }
  };

  return endElectionCheck;
};
