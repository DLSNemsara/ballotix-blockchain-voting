import axios from "axios";
import { useContext, useState } from "react";
import AuthContext from "../../store/auth-context";
// ShadCN UI imports
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

/**
 * Component for displaying a single user in the users table
 */
const ShowUser = ({ id, user, setLoading, loading, setUsers }) => {
  const { notify } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  /**
   * Handles user deletion
   * @param {Event} e - Click event
   */
  const deleteUserHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Delete user
      await axios.delete(`/election/delete/${id}`, {
        withCredentials: true,
      });
      // Retrieve new user list
      const response = await axios.get("/election/allUsers", {
        withCredentials: true,
      });
      setUsers(response.data.users);
      notify("User has been deleted", "success");
    } catch (err) {
      notify(err.response?.data?.errMessage || "Error deleting user", "error");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    !loading && (
      <tr className="transition-shadow hover:bg-muted/50">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              {user.name}
            </span>
            <span className="text-xs text-gray-500">{user.email}</span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="font-mono text-xs text-gray-800 break-all">
            {user.eAddress}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <Badge
            variant={user.hasVoted ? "success" : "destructive"}
            className={
              user.hasVoted
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }
          >
            {user.hasVoted ? "Voted" : "Not voted"}
          </Badge>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <Badge
            variant={user.role === "admin" ? "secondary" : "outline"}
            className={
              user.role === "admin"
                ? "bg-purple-100 text-purple-800"
                : "bg-gray-100 text-gray-800"
            }
          >
            {user.role}
          </Badge>
        </td>
        {!user.electionOngoing && (
          <td className="px-6 py-4 text-right whitespace-nowrap">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this user? This action
                    cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={deleteUserHandler}
                    autoFocus
                  >
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </td>
        )}
      </tr>
    )
  );
};

export default ShowUser;
