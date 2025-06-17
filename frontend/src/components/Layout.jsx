import axios from "axios";
import { useContext, useState } from "react";
import { GiPodiumWinner, GiVote } from "react-icons/gi";
import { SiBlockchaindotcom } from "react-icons/si";
import { BiHome, BiLogIn, BiLogOut } from "react-icons/bi";
import { HiUserGroup } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AuthContext from "../store/auth-context";
import {
  AiFillEdit,
  AiOutlinePlusSquare,
  AiOutlineUserAdd,
  AiFillLinkedin,
  AiFillMail,
} from "react-icons/ai";
import SideBar from "./Sidebar";
import { useMediaQuery } from "usehooks-ts";

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

/**
 * Main layout component that provides the application structure
 * Includes sidebar navigation and handles user authentication state
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to be rendered
 */
const Layout = ({ children }) => {
  const { user, setUser, notify, election } = useContext(AuthContext);
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");

  //Handles user logout by making an API call and updating the auth state
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

  return (
    <div className="flex overflow-y-hidden max-h-screen">
      {/* Only render the sidebar using SideBar component */}
      <SideBar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <main
        className={`flex-1 overflow-y-auto h-screen ${showSidebar ? "bg-gray-400 bg-opacity-80 md:bg-inherit md:bg-opacity-0" : ""}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Layout;
