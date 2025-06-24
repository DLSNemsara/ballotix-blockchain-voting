import axios from "axios";
import { useContext, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import Loading from "../../components/Loading";
import { Link } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import ShowUser from "./ShowUser";
// ShadCN UI imports
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

/**
 * Component for displaying all users in the system
 * @returns {JSX.Element} The AllUser component
 */
const AllUser = () => {
  const { user, notify } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
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

      try {
        setLoading(true);
        const response = await axios.get("/election/allUsers", {
          withCredentials: true,
        });
        setUsers(response.data.users);
      } catch (err) {
        notify(
          err.response?.data?.errMessage || "Error fetching users",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user, notify, navigate]);

  // Derived filtered users
  const filteredUsers = useMemo(() => {
    let filtered = users;
    if (filter !== "all") {
      filtered = filtered.filter((u) =>
        filter === "voted" ? u.hasVoted : !u.hasVoted
      );
    }
    if (search.trim() !== "") {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(s) ||
          u.email.toLowerCase().includes(s) ||
          (u.eAddress && u.eAddress.toLowerCase().includes(s))
      );
    }
    return filtered;
  }, [users, search, filter]);

  return (
    <div className="flex flex-col items-center px-2 pt-8 w-full min-h-screen bg-background">
      <Card className="mx-auto w-full max-w-5xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            All Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Controls */}
          <div className="flex flex-col gap-3 justify-between items-stretch mb-4 sm:flex-row sm:items-center">
            <div className="flex flex-1 gap-2">
              <Input
                placeholder="Search by name, email, or Ethereum address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-xs"
                aria-label="Search users"
              />
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-36"
                aria-label="Filter by status"
              >
                <option value="all">All</option>
                <option value="voted">Voted</option>
                <option value="not-voted">Not Voted</option>
              </Select>
            </div>
          </div>
          <div className="overflow-x-auto bg-white rounded-lg border border-muted">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="sticky top-0 z-10 bg-indigo-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                    Ethereum Address
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                    Role
                  </th>
                  {user && !user.electionOngoing && (
                    <th className="px-6 py-3 text-xs font-semibold tracking-wider text-right text-gray-700 uppercase">
                      Action
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={user && !user.electionOngoing ? 5 : 4}>
                        <Skeleton className="my-2 w-full h-10" />
                      </td>
                    </tr>
                  ))
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((singleUser) => (
                    <ShowUser
                      key={singleUser._id}
                      id={singleUser._id}
                      user={singleUser}
                      setLoading={setLoading}
                      loading={loading}
                      setUsers={setUsers}
                    />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={user && !user.electionOngoing ? 5 : 4}
                      className="py-8 text-center text-gray-400"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {!loading && user && !user.electionOngoing && (
            <Button asChild variant="default" className="mt-6">
              <Link to="/addUser">
                <span className="flex gap-2 items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Register User
                </span>
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AllUser;
