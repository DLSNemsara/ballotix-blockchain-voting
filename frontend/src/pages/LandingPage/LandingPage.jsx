import { useContext, useState } from "react";
import React from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import { useEndElection } from "../../components/hooks/end-election";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCircleIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  BoltIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/solid";
import { Card, CardContent } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";

/**
 * Component for the landing page of the voting system
 */
const LandingPage = () => {
  const [loading, setLoading] = useState(false);
  const { user, notify, election } = useContext(AuthContext);

  // Handle election ending
  useEndElection("", setLoading);

  /**
   * Renders the appropriate action button based on user state
   */
  const renderActionButton = () => {
    if (!user) {
      return (
        <Link to="/login">
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 0 4px #6366f1aa" }}
            whileTap={{ scale: 0.98 }}
            className="flex relative gap-2 items-center px-8 py-4 w-full text-lg font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-xl transition-all duration-200 ease-in-out group md:w-auto focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:shadow-2xl"
          >
            <ArrowRightCircleIcon className="w-6 h-6 text-white" />
            Get Started
          </motion.button>
        </Link>
      );
    }

    if (
      user.electionOngoing &&
      election !== "0x0000000000000000000000000000000000000000"
    ) {
      return (
        <Link to="/election">
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 0 4px #6366f1aa" }}
            whileTap={{ scale: 0.98 }}
            className="flex relative gap-2 items-center px-8 py-4 w-full text-lg font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-xl transition-all duration-200 ease-in-out group md:w-auto focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:shadow-2xl"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <CheckCircleIcon className="relative w-6 h-6 text-white" />
            <span className="relative">Vote Now</span>
          </motion.button>
        </Link>
      );
    }

    if (user.role === "user") {
      return (
        <p className="text-lg font-medium text-center text-gray-600">
          No election ongoing
        </p>
      );
    }

    if (user.role === "admin") {
      if (election === "0x0000000000000000000000000000000000000000") {
        return (
          <Link to="/addElection">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 0 4px #6366f1aa" }}
              whileTap={{ scale: 0.98 }}
              className="flex relative gap-2 items-center px-8 py-4 w-full text-lg font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-xl transition-all duration-200 ease-in-out group md:w-auto focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:shadow-2xl"
            >
              <BoltIcon className="w-6 h-6 text-white" />
              Start Election
            </motion.button>
          </Link>
        );
      } else {
        return (
          <Link to="/election">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 0 4px #6366f1aa" }}
              whileTap={{ scale: 0.98 }}
              className="flex relative gap-2 items-center px-8 py-4 w-full text-lg font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-xl transition-all duration-200 ease-in-out group md:w-auto focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:shadow-2xl"
            >
              <ShieldCheckIcon className="w-6 h-6 text-white" />
              Go to Election
            </motion.button>
          </Link>
        );
      }
    }

    return null;
  };

  return (
    <>
      {/* Hero Background Blobs */}
      <div className="overflow-hidden absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-8rem] left-[-8rem] w-[36rem] h-[36rem] bg-gradient-to-tr from-indigo-200 via-indigo-100 to-white rounded-full blur-3xl opacity-60 animate-pulse" />
        <div className="absolute bottom-[-6rem] right-[-6rem] w-[28rem] h-[28rem] bg-gradient-to-br from-indigo-300 via-white to-indigo-100 rounded-full blur-2xl opacity-50 animate-pulse" />
      </div>

      <div className="flex relative justify-center items-center px-4 py-12 min-h-screen bg-gradient-to-b from-gray-50 to-white sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 items-center w-full max-w-7xl lg:flex-row lg:gap-16">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex justify-center mb-8 w-full lg:w-[55%] lg:mb-0"
          >
            <motion.div
              whileHover={{ scale: 1.02, rotate: -1 }}
              className="overflow-hidden rounded-3xl border-4 border-indigo-200 shadow-2xl backdrop-blur-lg bg-white/80 transition-all duration-500 hover:shadow-[0_0_40px_rgba(99,102,241,0.4)]"
            >
              <div className="relative p-1 bg-gradient-to-br from-indigo-100 via-white to-purple-100 rounded-3xl">
                <img
                  src="/Hero_image_voting.jpg"
                  alt="Illustration of blockchain-based secure voting system"
                  className="object-cover w-full h-[18rem] sm:h-[22rem] md:h-[28rem] lg:h-[30rem] transition-transform duration-500 hover:scale-[1.05] hover:-rotate-1 rounded-2xl"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Info & CTA */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col gap-6 w-full lg:w-1/2"
          >
            {/* Title & Subtitle */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="inline-flex gap-2 items-center px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-full"
              >
                <span>🚀</span>
                <span>Powered by Blockchain</span>
              </motion.div>
              <h1 className="mb-2 text-5xl font-extrabold tracking-tight sm:text-6xl font-manrope">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 drop-shadow-lg">
                  Ballotix
                </span>
              </h1>
              <h2 className="mb-3 text-2xl font-semibold leading-relaxed text-gray-700 sm:text-3xl">
                Secure Blockchain Voting System
              </h2>
              <p className="max-w-xl text-lg font-normal leading-relaxed text-gray-500">
                Experience the future of voting with our secure, transparent,
                and decentralized blockchain-based platform.
              </p>
            </div>

            {/* Why Choose Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="overflow-hidden rounded-3xl border-0 shadow-xl backdrop-blur-lg bg-white/80">
                <CardContent className="p-6">
                  <h3 className="flex gap-2 items-center mb-5 text-xl font-bold">
                    <ShieldCheckIcon className="w-7 h-7 text-indigo-500" />
                    Why Choose Ballotix?
                  </h3>
                  <ul className="space-y-4">
                    <motion.li
                      whileHover={{ x: 4 }}
                      className="flex gap-3 items-center group"
                    >
                      <div className="flex-shrink-0 p-2 bg-indigo-50 rounded-xl transition-colors duration-200 group-hover:bg-indigo-100">
                        <CheckCircleIcon className="w-6 h-6 text-indigo-500" />
                      </div>
                      <span className="text-gray-700">
                        Secure and transparent voting process
                      </span>
                    </motion.li>
                    <motion.li
                      whileHover={{ x: 4 }}
                      className="flex gap-3 items-center group"
                    >
                      <div className="flex-shrink-0 p-2 bg-indigo-50 rounded-xl transition-colors duration-200 group-hover:bg-indigo-100">
                        <BoltIcon className="w-6 h-6 text-indigo-500" />
                      </div>
                      <span className="text-gray-700">
                        Blockchain-powered immutable records
                      </span>
                    </motion.li>
                    <motion.li
                      whileHover={{ x: 4 }}
                      className="flex gap-3 items-center group"
                    >
                      <div className="flex-shrink-0 p-2 bg-indigo-50 rounded-xl transition-colors duration-200 group-hover:bg-indigo-100">
                        <UserCircleIcon className="w-6 h-6 text-indigo-500" />
                      </div>
                      <span className="text-gray-700">
                        Easy-to-use interface
                      </span>
                    </motion.li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col gap-4 items-center sm:flex-row"
            >
              {!loading && (
                <div className="flex justify-center w-full">
                  {renderActionButton()}
                </div>
              )}
            </motion.div>

            {/* User Profile Card */}
            {user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="flex gap-4 items-center p-5 mt-2 max-w-md bg-white rounded-3xl shadow-lg"
              >
                <div className="flex-shrink-0">
                  <UserCircleIcon className="w-14 h-14 text-indigo-400" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    {user.name}
                  </div>
                  <div className="font-mono text-xs text-gray-500 break-all">
                    {user.eAddress}
                  </div>
                  <div className="mt-1 text-xs text-indigo-500 capitalize">
                    {user.role}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
