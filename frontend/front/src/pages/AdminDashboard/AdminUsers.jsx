import axios from "axios";
import { useEffect, useState } from "react";
import "../../styles/adminreports.css";

const BASE_URL = "https://crime-snap-main-3.onrender.com";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH USERS =================
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No token found");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `${BASE_URL}/api/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("USERS RESPONSE:", res.data);

      const data = res.data;

      if (Array.isArray(data)) {
        setUsers(data);
      } else if (Array.isArray(data?.users)) {
        setUsers(data.users);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.log("FETCH ERROR:", err.response?.data || err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= BLOCK USER =================
  const blockUser = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${BASE_URL}/api/admin/users/block/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, status: "Blocked" } : u
        )
      );
    } catch (err) {
      console.log("BLOCK ERROR:", err.response?.data || err);
    }
  };

  // ================= UNBLOCK USER =================
  const unblockUser = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${BASE_URL}/api/admin/users/unblock/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, status: "Active" } : u
        )
      );
    } catch (err) {
      console.log("UNBLOCK ERROR:", err.response?.data || err);
    }
  };

  if (loading) {
    return <h2>Loading users...</h2>;
  }

  return (
    <div className="admin-page">
      <h1>Admin - Users Management</h1>

      {users.length === 0 ? (
        <h3>No users found</h3>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <tr key={user._id || index}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>

                <td>
                  <span
                    style={{
                      color:
                        (user.status || "Active") === "Blocked"
                          ? "red"
                          : "green",
                      fontWeight: "bold",
                    }}
                  >
                    {user.status || "Active"}
                  </span>
                </td>

                <td>
                  {(user.status || "Active") === "Blocked" ? (
                    <button
                      onClick={() => unblockUser(user._id)}
                      style={{
                        background: "green",
                        color: "white",
                        padding: "6px 12px",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Unblock
                    </button>
                  ) : (
                    <button
                      onClick={() => blockUser(user._id)}
                      style={{
                        background: "red",
                        color: "white",
                        padding: "6px 12px",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Block
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}