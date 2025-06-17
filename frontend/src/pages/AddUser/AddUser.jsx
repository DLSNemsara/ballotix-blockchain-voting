import axios from "axios";
import { useEffect, useContext, useState } from "react";
import { AiOutlineMail } from "react-icons/ai";
import { FaEthereum } from "react-icons/fa";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { useNavigate } from "react-router";
import Loading from "../../components/Loading";
import AuthContext from "../../store/auth-context";
import { Button } from "@/components/ui/button";

/**
 * Component for registering new users in the system
 * @returns {JSX.Element} The AddUser component
 */
const AddUser = () => {
  const { user, notify } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    eAddress: "",
  });

  useEffect(() => {
    if (!user) {
      notify("You need to login first", "error");
      navigate("/login");
      return;
    }

    if (user.role === "user") {
      notify("You do not have access to this route", "error");
      navigate("/");
      return;
    }

    if (user.role === "admin" && user.electionOngoing) {
      notify("You cannot register a user after starting an election", "error");
      navigate("/");
    }
  }, [user, notify, navigate]);

  /**
   * Handles the form submission for user registration
   * @param {Event} e - The form submission event
   */
  const userRegisterHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/election/register", formData, {
        withCredentials: true,
      });
      notify("User registered successfully", "success");
      navigate("/users");
    } catch (err) {
      notify(
        err.response?.data?.errMessage || "Error registering user",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles input changes and updates the form state
   * @param {Event} e - The input change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      {!loading && (
        <div className="flex justify-center items-center px-2 py-8 min-h-screen bg-gray-50 sm:px-4">
          <div className="p-8 mx-auto space-y-8 w-full max-w-lg bg-white rounded-3xl shadow-2xl sm:p-10">
            <div>
              <h2 className="mb-2 text-3xl font-extrabold text-center text-gray-900">
                Register a User
              </h2>
              <p className="text-sm text-center text-gray-500">
                Fill in the details to create a new voter/admin account.
              </p>
            </div>
            <form
              className="space-y-6"
              onSubmit={userRegisterHandler}
              autoComplete="off"
            >
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 text-sm font-semibold text-gray-700"
                >
                  Email
                </label>
                <div className="relative">
                  <span className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <AiOutlineMail className="w-5 h-5 text-indigo-400" />
                  </span>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="block py-2 pr-3 pl-10 w-full placeholder-gray-400 rounded-lg border border-gray-200 shadow-sm transition-all duration-150 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Username Input */}
              <div>
                <label
                  htmlFor="name"
                  className="block mb-1 text-sm font-semibold text-gray-700"
                >
                  Username
                </label>
                <div className="relative">
                  <span className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <MdOutlineDriveFileRenameOutline className="w-5 h-5 text-indigo-400" />
                  </span>
                  <input
                    name="name"
                    id="name"
                    className="block py-2 pr-3 pl-10 w-full placeholder-gray-400 rounded-lg border border-gray-200 shadow-sm transition-all duration-150 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                    value={formData.name}
                    placeholder="Enter user's name"
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Ethereum Address Input */}
              <div>
                <label
                  htmlFor="eAddress"
                  className="block mb-1 text-sm font-semibold text-gray-700"
                >
                  Ethereum Address
                </label>
                <div className="relative">
                  <span className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <FaEthereum className="w-5 h-5 text-indigo-400" />
                  </span>
                  <input
                    name="eAddress"
                    id="eAddress"
                    className="block py-2 pr-3 pl-10 w-full placeholder-gray-400 rounded-lg border border-gray-200 shadow-sm transition-all duration-150 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                    placeholder="0x0000000000000000000000000000000000000000"
                    value={formData.eAddress}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Register Button */}
              <div>
                <Button
                  type="submit"
                  className="flex relative justify-center px-4 py-2 w-full text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg border border-transparent group hover:scale-[1.03] hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 transition-all duration-150"
                >
                  Register
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {loading && <Loading />}
    </>
  );
};

export default AddUser;
