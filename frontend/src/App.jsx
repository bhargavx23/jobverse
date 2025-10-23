  import React from "react";
import { Routes, Route } from "react-router-dom";
import JobList from "./pages/JobList";
import JobDetails from "./pages/JobDetails";
import ApplyJob from "./pages/ApplyJob";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ManageJobs from "./pages/ManageJobs";
import ManageUsers from "./pages/ManageUsers";
import CreateJob from "./pages/CreateJob";
import ReviewApplications from "./pages/ReviewApplications";
import ApplicationDetails from "./pages/ApplicationDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<JobList />} />
      <Route path="/jobs/:id" element={<JobDetails />} />
      <Route path="/jobs/:id/apply" element={<ApplyJob />} />
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/jobs" element={<CreateJob />} />
      <Route path="/admin/jobs/manage" element={<ManageJobs />} />
      <Route path="/admin/applications" element={<ReviewApplications />} />
      <Route path="/admin/applications/:id" element={<ApplicationDetails />} />
      <Route path="/admin/users" element={<ManageUsers />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default App;
