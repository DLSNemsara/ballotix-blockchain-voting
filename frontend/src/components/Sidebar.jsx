import axios from "axios";
import { useContext, useEffect } from "react";
import { GiPodiumWinner, GiVote } from "react-icons/gi";
import { SiBlockchaindotcom } from "react-icons/si";
import { BiHome, BiLogIn, BiLogOut } from "react-icons/bi";
import { HiUserGroup } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../store/auth-context";
import { AiOutlinePlusSquare, AiOutlineUserAdd } from "react-icons/ai";

const SideBar = ({ setShowSidebar, showSidebar }) => {
  const { user, setUser, notify, election } = useContext(AuthContext);
  const location = useLocation();

  // Debug: Log user and election context
  console.log("Sidebar user (full):", JSON.stringify(user));
  console.log("Sidebar election:", election);

  const logoutHandler = async () => {
    try {
      await axios.get("election/logout", {
        withCredentials: true,
      });
      setUser(null);
      notify("User Logged out", "success");
    } catch (err) {
      notify(err.response.data.errMessage, "error");
    }
  };

  useEffect(() => {
    console.log("🟢 Sidebar re-rendered. Election:", election);
  }, [election]);

  useEffect(() => {
    console.log(
      "⚡ Final render condition:",
      user?.role,
      user?.electionOngoing,
      election
    );
  }, [user, election]);

  // Sidebar menu items logic
  const menuItems = (
    <>
      {/* Guest user menu */}
      {!user && (
        <>
          <li className="mb-2">
            <Link
              to="/login"
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-white hover:bg-indigo-600 transition ${location.pathname === "/login" ? "bg-indigo-600 font-semibold" : ""}`}
            >
              <BiLogIn className="text-xl" />
              <span className="text-base">Login</span>
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/"
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-white hover:bg-indigo-600 transition ${location.pathname === "/" ? "bg-indigo-600 font-semibold" : ""}`}
            >
              <BiHome className="text-xl" />
              <span className="text-base">Home Page</span>
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/results"
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-white hover:bg-indigo-600 transition ${location.pathname === "/results" ? "bg-indigo-600 font-semibold" : ""}`}
            >
              <GiPodiumWinner className="text-xl" />
              <span className="text-base">All Results</span>
            </Link>
          </li>
        </>
      )}
      {/* Regular user menu - no election ongoing */}
      {user && user.role === "user" && !user.electionOngoing && (
        <>
          <li className="mb-2">
            <Link
              to="/"
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-white hover:bg-indigo-600 transition ${location.pathname === "/" ? "bg-indigo-600 font-semibold" : ""}`}
            >
              <BiHome className="text-xl" />
              <span className="text-base">Home Page</span>
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/results"
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-white hover:bg-indigo-600 transition ${location.pathname === "/results" ? "bg-indigo-600 font-semibold" : ""}`}
            >
              <GiPodiumWinner className="text-xl" />
              <span className="text-base">All Results</span>
            </Link>
          </li>
          <li className="mb-2">
            <button
              onClick={logoutHandler}
              className="flex gap-4 items-center px-4 py-3 w-full text-white rounded-lg transition hover:bg-indigo-600"
            >
              <BiLogOut className="text-xl" />
              <span className="text-base">Logout</span>
            </button>
          </li>
        </>
      )}
      {/* Regular user menu - election ongoing */}
      {user &&
        user.role === "user" &&
        user.electionOngoing &&
        election !== "0x0000000000000000000000000000000000000000" && (
          <>
            <li className="mb-2">
              <Link
                to="/"
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-white hover:bg-indigo-600 transition ${location.pathname === "/" ? "bg-indigo-600 font-semibold" : ""}`}
              >
                <BiHome className="text-xl" />
                <span className="text-base">Home Page</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/election"
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-white hover:bg-indigo-600 transition ${location.pathname === "/election" ? "bg-indigo-600 font-semibold" : ""}`}
              >
                <GiVote className="text-xl" />
                <span className="text-base">Vote</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/results"
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-white hover:bg-indigo-600 transition ${location.pathname === "/results" ? "bg-indigo-600 font-semibold" : ""}`}
              >
                <GiPodiumWinner className="text-xl" />
                <span className="text-base">All Results</span>
              </Link>
            </li>
            <li className="mb-2">
              <button
                onClick={logoutHandler}
                className="flex gap-4 items-center px-4 py-3 w-full text-white rounded-lg transition hover:bg-indigo-600"
              >
                <BiLogOut className="text-xl" />
                <span className="text-base">Logout</span>
              </button>
            </li>
          </>
        )}
      {/* Admin menu - election ongoing */}
      {user &&
        user.electionOngoing &&
        user.role === "admin" &&
        election !== "0x0000000000000000000000000000000000000000" && (
          <>
            <li className="mb-2">
              <Link
                to="/"
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-white hover:bg-indigo-600 transition ${location.pathname === "/" ? "bg-indigo-600 font-semibold" : ""}`}
              >
                <BiHome className="text-xl" />
                <span className="text-base">Home Page</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/election"
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-white hover:bg-indigo-600 transition ${location.pathname === "/election" ? "bg-indigo-600 font-semibold" : ""}`}
              >
                <GiVote className="text-xl" />
                <span className="text-base">Manage Election</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/addCandidate"
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-white hover:bg-indigo-600 transition ${location.pathname === "/addCandidate" ? "bg-indigo-600 font-semibold" : ""}`}
              >
                <AiOutlineUserAdd className="text-xl" />
                <span className="text-base">Add Candidate</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/results"
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-white hover:bg-indigo-600 transition ${location.pathname === "/results" ? "bg-indigo-600 font-semibold" : ""}`}
              >
                <GiPodiumWinner className="text-xl" />
                <span className="text-base">All Results</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/users"
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-white hover:bg-indigo-600 transition ${location.pathname === "/users" ? "bg-indigo-600 font-semibold" : ""}`}
              >
                <HiUserGroup className="text-xl" />
                <span className="text-base">All Users</span>
              </Link>
            </li>
            <li className="mb-2">
              <button
                onClick={logoutHandler}
                className="flex gap-4 items-center px-4 py-3 w-full text-white rounded-lg transition hover:bg-indigo-600"
              >
                <BiLogOut className="text-xl" />
                <span className="text-base">Logout</span>
              </button>
            </li>
          </>
        )}
      {/* Admin menu - no election ongoing */}
      {/* Admin: no election deployed yet */}
      {user &&
        user.role === "admin" &&
        !user.electionOngoing &&
        election === "0x0000000000000000000000000000000000000000" && (
          <>
            <li className="mb-2">
              <Link
                to="/"
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-white hover:bg-indigo-600 transition ${location.pathname === "/" ? "bg-indigo-600 font-semibold" : ""}`}
              >
                <BiHome className="text-xl" />
                <span className="text-base">Home Page</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/addElection"
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-white hover:bg-indigo-600 transition ${location.pathname === "/addElection" ? "bg-indigo-600 font-semibold" : ""}`}
              >
                <AiOutlinePlusSquare className="text-xl" />
                <span className="text-base">Add Election</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/results"
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-white hover:bg-indigo-600 transition ${location.pathname === "/results" ? "bg-indigo-600 font-semibold" : ""}`}
              >
                <GiPodiumWinner className="text-xl" />
                <span className="text-base">All Results</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/users"
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-white hover:bg-indigo-600 transition ${location.pathname === "/users" ? "bg-indigo-600 font-semibold" : ""}`}
              >
                <HiUserGroup className="text-xl" />
                <span className="text-base">All Users</span>
              </Link>
            </li>
            <li className="mb-2">
              <button
                onClick={logoutHandler}
                className="flex gap-4 items-center px-4 py-3 w-full text-white rounded-lg transition hover:bg-indigo-600"
              >
                <BiLogOut className="text-xl" />
                <span className="text-base">Logout</span>
              </button>
            </li>
          </>
        )}
      {/* Admin: election deployed, but not started */}
      {user &&
        user.role === "admin" &&
        !user.electionOngoing &&
        election !== "0x0000000000000000000000000000000000000000" && (
          <>
            <li className="mb-2">
              <Link
                to="/"
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-white hover:bg-indigo-600 transition ${location.pathname === "/" ? "bg-indigo-600 font-semibold" : ""}`}
              >
                <BiHome className="text-xl" />
                <span className="text-base">Home Page</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/election"
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-white hover:bg-indigo-600 transition ${location.pathname === "/election" ? "bg-indigo-600 font-semibold" : ""}`}
              >
                <GiVote className="text-xl" />
                <span className="text-base">Manage Election</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/addCandidate"
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-white hover:bg-indigo-600 transition ${location.pathname === "/addCandidate" ? "bg-indigo-600 font-semibold" : ""}`}
              >
                <AiOutlineUserAdd className="text-xl" />
                <span className="text-base">Add Candidate</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/results"
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-white hover:bg-indigo-600 transition ${location.pathname === "/results" ? "bg-indigo-600 font-semibold" : ""}`}
              >
                <GiPodiumWinner className="text-xl" />
                <span className="text-base">All Results</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/users"
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-white hover:bg-indigo-600 transition ${location.pathname === "/users" ? "bg-indigo-600 font-semibold" : ""}`}
              >
                <HiUserGroup className="text-xl" />
                <span className="text-base">All Users</span>
              </Link>
            </li>
            <li className="mb-2">
              <button
                onClick={logoutHandler}
                className="flex gap-4 items-center px-4 py-3 w-full text-white rounded-lg transition hover:bg-indigo-600"
              >
                <BiLogOut className="text-xl" />
                <span className="text-base">Logout</span>
              </button>
            </li>
          </>
        )}
    </>
  );

  // Only one sidebar per screen size
  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className={`fixed md:hidden z-50 flex items-center left-4 top-6 p-2 rounded-full bg-white shadow-lg border border-indigo-200 transition-colors ${showSidebar ? "bg-indigo-600" : "bg-white"}`}
        aria-label="Open sidebar"
      >
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
          <rect
            y="5"
            width="24"
            height="2"
            rx="1"
            fill={showSidebar ? "#fff" : "#6366f1"}
          />
          <rect
            y="11"
            width="24"
            height="2"
            rx="1"
            fill={showSidebar ? "#fff" : "#6366f1"}
          />
          <rect
            y="17"
            width="24"
            height="2"
            rx="1"
            fill={showSidebar ? "#fff" : "#6366f1"}
          />
        </svg>
      </button>

      {/* Mobile Sidebar + Backdrop */}
      {showSidebar && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-30 backdrop-blur-sm transition-opacity md:hidden"
            onClick={() => setShowSidebar(false)}
          ></div>
          <nav className="flex fixed top-0 left-0 z-50 flex-col justify-between p-6 w-72 min-h-screen bg-gradient-to-b from-indigo-700 via-indigo-800 to-indigo-900 rounded-tr-3xl rounded-br-3xl shadow-md animate-slideIn">
            <div className="flex flex-col items-center mb-12">
              <div className="p-3 bg-white rounded-full shadow-md">
                <SiBlockchaindotcom className="w-8 h-8 text-indigo-600" />
              </div>
              <h1 className="mt-3 text-xl font-bold tracking-wide text-white">
                Ballotix
              </h1>
            </div>
            <ul className="flex-1">{menuItems}</ul>
            <p className="mt-10 text-sm text-center text-white/60">
              {user ? `Logged in as ${user.role}` : "Not logged in"}
            </p>
          </nav>
        </>
      )}

      {/* Desktop Sidebar */}
      <nav className="hidden flex-col justify-between p-6 w-72 min-h-screen bg-gradient-to-b from-indigo-700 via-indigo-800 to-indigo-900 rounded-tr-3xl rounded-br-3xl shadow-md md:flex">
        <div className="flex flex-col items-center mb-12">
          <div className="p-3 bg-white rounded-full shadow-md">
            <SiBlockchaindotcom className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="mt-3 text-xl font-bold tracking-wide text-white">
            Ballotix
          </h1>
        </div>
        <ul className="flex-1">{menuItems}</ul>
        <p className="mt-10 text-sm text-center text-white/60">
          {user ? `Logged in as ${user.role}` : "Not logged in"}
        </p>
      </nav>
    </>
  );
};

export default SideBar;
