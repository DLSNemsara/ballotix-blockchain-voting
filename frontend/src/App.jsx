import "./App.css";
import Login from "./pages/Login.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LandingPage from "./pages/LandingPage/LandingPage.jsx";
import Election from "./pages/Election/Election.jsx";
import AddElection from "./pages/AddElection/AddElection.jsx";
import AddCandidate from "./pages/AddCandidate/AddCandidate.jsx";
import AllResults from "./pages/AllResults/AllResults.jsx";
import SingleResult from "./pages/SingleResult/SingleResult.jsx";
import AllUser from "./pages/AllUsers/AllUser.jsx";
import AddUser from "./pages/AddUser/AddUser.jsx";
import EditUser from "./pages/EditUser/EditUser.jsx";
import axios from "axios";
import Layout from "./components/Layout.jsx";

// Set base URL for API calls
// axios.defaults.baseURL = import.meta.env.VITE_BE_URL;

/**
 * Main application component
 * @returns {JSX.Element} The App component
 */
function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<p>Register user</p>} />
          <Route path="/election" element={<Election />} />
          <Route path="/results" element={<AllResults />} />
          <Route path="/results/:address" element={<SingleResult />} />
          <Route path="/users" element={<AllUser />} />
          <Route path="/addUser" element={<AddUser />} />
          <Route path="/addElection" element={<AddElection />} />
          <Route path="/addCandidate" element={<AddCandidate />} />
          <Route path="/editUser" element={<EditUser />} />
          <Route path="/*" element={<p>Page not found</p>} />
        </Routes>
      </Layout>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
