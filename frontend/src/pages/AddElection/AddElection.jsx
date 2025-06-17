import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import web3 from "../../ethereum/web3";
import factory from "../../ethereum/factory";
import AuthContext from "../../store/auth-context";
import Loading from "../../components/Loading";
import { useUserValidation } from "../../components/hooks/user-validation";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const AddElection = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [electionName, setElectionName] = useState("");
  const { notify, validAccount, setElection, getAccount, user, setUser } =
    useContext(AuthContext);

  useUserValidation(false);

  const addElectionHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    await getAccount();
    console.log(
      "MetaMask:",
      window.ethereum.selectedAddress,
      "User:",
      user.eAddress,
      "Valid:",
      validAccount
    );

    if (!validAccount) {
      notify("You are using wrong ethereum account", "error");
      setLoading(false);
      return;
    }

    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createElection(electionName).send({
        from: accounts[0],
      });

      notify("Election added successfully", "success");
      // const address = await factory.methods.deployedElection().call();
      // setElection(address);
      // navigate("/election");

      const address = await factory.methods.deployedElection().call();
      setElection(address);

      // Refresh user from backend
      const userResp = await axios.get("/election/getUser", {
        withCredentials: true,
      });
      setUser(userResp.data.user);

      console.log("Updated user in context:", userResp.data.user);

      navigate("/election");
    } catch (err) {
      notify(err.message, "error");
    }
    setLoading(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex justify-center items-center px-16 py-12 min-h-screen bg-gray-50 sm:px-6 lg:px-8"
    >
      <div className="space-y-8 w-full max-w-md">
        <motion.div variants={itemVariants}>
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
            Add Election
          </h2>
        </motion.div>

        <motion.form
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="mt-8 space-y-6"
          onSubmit={addElectionHandler}
        >
          <motion.div variants={itemVariants}>
            <label
              htmlFor="electionName"
              className="block text-sm font-medium text-gray-700"
            >
              Election Name
            </label>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <MdOutlineDriveFileRenameOutline
                  className="w-5 h-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                name="electionName"
                id="electionName"
                className="block py-2 pl-10 w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={electionName}
                onChange={(e) => setElectionName(e.target.value)}
                placeholder="Enter Election's name"
                required
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="flex relative justify-center px-4 py-2 w-full text-sm font-medium text-white bg-indigo-500 rounded-md border border-transparent transition-colors duration-200 group hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
            >
              Add Election
            </motion.button>
          </motion.div>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default AddElection;
