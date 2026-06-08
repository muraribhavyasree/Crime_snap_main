import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import socket from "./socket";
import { toast } from "react-toastify";

/* ================= PAGES ================= */

/* HOME & AUTH */
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";

/* USER */
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import ReportComplaint from "./pages/dashboard/ReportComplaint";
import MyComplaints from "./pages/dashboard/MyComplaints";
import Profile from "./pages/dashboard/Profile";
import TrackStatus from "./pages/dashboard/TrackStatus";

/* ADMIN */
import AdmindbLayout from "./pages/AdminDashboard/AdmindbLayout";
import Admindbhome from "./pages/AdminDashboard/Admindbhome";
import AdminReports from "./pages/AdminDashboard/AdminReports";
import AdminUsers from "./pages/AdminDashboard/AdminUsers";
import AdminOfficers from "./pages/AdminDashboard/AdminOfficers";
import AdminLocations from "./pages/AdminDashboard/AdminLocations";
import UpdateStatus from "./pages/AdminDashboard/UpdateStatus";

/* OFFICER 
import OfficerLogin from "./pages/officer/OfficerLogin";
import OfficerDashboard from "./pages/officer/OfficerDashboard";

 ================= PROTECTED ROUTES ================= */

const RequireUser = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user || user.role !== "user") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const RequireAdmin = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user || user.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

const RequireOfficer = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user || user.role !== "officer") {
    return <Navigate to="/officer/login" replace />;
  }

  return children;
};

/* ================= APP ================= */

export default function App() {
  const hasInit = useRef(false);

  useEffect(() => {
    if (hasInit.current) return;
    hasInit.current = true;

    const getUser = () => {
      try {
        return JSON.parse(localStorage.getItem("user"));
      } catch {
        return null;
      }
    };

    const user = getUser();

    /* JOIN SOCKET ROOM */
    if (user?.role) {
      socket.emit("join-room", user.role);
    }

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    /* ================= EVENTS ================= */

    // NEW COMPLAINT → ADMIN
    socket.on("new-complaint", (data) => {
      const user = getUser();
      if (user?.role === "admin") {
        toast.success(`🚨 ${data?.title || "New Complaint Created"}`);
      }
    });

    // STATUS UPDATE → USER
    socket.on("status-updated", (data) => {
      const user = getUser();
      if (user?.role === "user") {
        toast.info(`📊 ${data?.title} → ${data?.status}`);
      }
    });

    // OFFICER ASSIGN → USER
    socket.on("complaint-assigned", (data) => {
      const user = getUser();
      if (user?.role === "user") {
        toast.warning(`👮 ${data?.title} assigned to ${data?.officer}`);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("new-complaint");
      socket.off("status-updated");
      socket.off("complaint-assigned");
    };
  }, []);

  return (
    <Routes>

      {/* ================= HOME ================= */}
      <Route path="/" element={<Home />} />

      {/* ================= AUTH ================= */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/register" element={<AdminRegister />} />

      {/* ================= OFFICER ================= 
      <Route path="/officer/login" element={<OfficerLogin />} />*/}

      {/* ================= USER ================= */}
      <Route
        path="/dashboard"
        element={
          <RequireUser>
            <DashboardLayout />
          </RequireUser>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="report" element={<ReportComplaint />} />
        <Route path="my-complaints" element={<MyComplaints />} />
        <Route path="profile" element={<Profile />} />
        <Route path="track-status" element={<TrackStatus />} />
      </Route>

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdmindbLayout />
          </RequireAdmin>
        }
      >
        <Route path="dashboard" element={<Admindbhome />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="update-status" element={<UpdateStatus />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="officers" element={<AdminOfficers />} />
        <Route path="locations" element={<AdminLocations />} />
      </Route>

      {/* ================= OFFICER ================= 
      <Route path="/officer/login" element={<OfficerLogin />} />

      <Route
        path="/officer/dashboard"
        element={
          <RequireOfficer>
            <OfficerDashboard />
          </RequireOfficer>
        }
      />

     ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}