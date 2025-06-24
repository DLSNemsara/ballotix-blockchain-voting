import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { FaEthereum } from "react-icons/fa";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { useNavigate } from "react-router";
import Loading from "../../components/Loading";
import AuthContext from "../../store/auth-context";

/**
 * Component for editing user profile information
 * @returns {JSX.Element} The EditUser component
 */
const EditUser = () => {
  const { user, setUser, notify } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    eAddress: user?.eAddress || "",
  });

  useEffect(() => {
    if (!user) {
      notify("Please login first", "error");
      navigate("/login");
    } else if (user.electionOngoing) {
      notify("You cannot edit your name and account during election", "error");
      navigate(-1);
    }
  }, [user, notify, navigate]);

  /**
   * Handles the form submission for editing user profile
   * @param {Event} e - The form submission event
   */
  const editUserHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put("/election/edit", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      notify("Your details have been updated", "success");
      setUser(response.data.user);
      navigate(-1);
    } catch (err) {
      notify(
        err.response?.data?.errMessage || "Error updating profile",
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
        <div className="flex justify-center items-center px-4 py-12 min-h-screen bg-gray-50 sm:px-6 lg:px-8">
          <div className="space-y-8 w-full max-w-md">
            <div>
              <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
                Edit Profile
              </h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={editUserHandler}>
              <div className="space-y-4 rounded-md shadow-sm">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Username
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                      <MdOutlineDriveFileRenameOutline
                        className="w-5 h-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      name="name"
                      id="name"
                      className="block py-2 pl-10 w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={formData.name}
                      placeholder="Enter user's name"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="eAddress"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Ethereum Address
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                      <FaEthereum
                        className="w-5 h-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      name="eAddress"
                      id="eAddress"
                      className="block py-2 pl-10 w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="0x0000000000000000000000000000000000000000"
                      value={formData.eAddress}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="flex relative justify-center px-4 py-2 w-full text-sm font-medium text-white bg-indigo-500 rounded-md border border-transparent group hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
                >
                  Edit Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {loading && <Loading />}
    </>
  );
};

export default EditUser;
