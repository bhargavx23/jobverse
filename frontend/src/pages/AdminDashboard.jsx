import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

import {
  FaBriefcase,
  FaUsers,
  FaFileAlt,
  FaChartLine,
  FaSignOutAlt,
  FaPlus,
  FaCog,
  FaEye,
  FaTrash,
  FaEdit,
  FaSearch,
} from "react-icons/fa";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalUsers: 0,
    totalApplications: 0,
    pendingApplications: 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, logout, loading: authLoading } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return; // Wait for auth loading to complete
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "admin") {
      navigate("/");
      return;
    }
    fetchDashboardData();
  }, [user, navigate, authLoading]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Fetch stats
      const statsResponse = await axios.get(
        "http://localhost:30000/api/admin/stats",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStats(statsResponse.data);

      // Fetch recent jobs
      const jobsResponse = await axios.get(
        "http://localhost:30000/api/admin/jobs?limit=5",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRecentJobs(jobsResponse.data.jobs || []);

      // Fetch recent applications
      const applicationsResponse = await axios.get(
        "http://localhost:30000/api/admin/applications/recent",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRecentApplications(applicationsResponse.data);

      // Fetch recent users
      const usersResponse = await axios.get(
        "http://localhost:30000/api/admin/users/recent",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRecentUsers(usersResponse.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 w-20 h-20 bg-purple-200 rounded-full opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-20"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-24 h-24 bg-green-200 rounded-full opacity-20"
          animate={{
            x: [0, 120, 0],
            y: [0, -40, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/3 w-18 h-18 bg-yellow-200 rounded-full opacity-20"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">

      {/* Sidebar for Quick Actions */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="space-y-4">
          <Link
            to="/admin/jobs"
            className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
          >
            <FaPlus className="text-blue-600 text-xl" />
            <div>
              <p className="font-semibold text-gray-900">Post New Job</p>
              <p className="text-sm text-gray-600">Create a new job listing</p>
            </div>
          </Link>
          <Link
            to="/admin/jobs/manage"
            className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200"
          >
            <FaCog className="text-green-600 text-xl" />
            <div>
              <p className="font-semibold text-gray-900">Manage Jobs</p>
              <p className="text-sm text-gray-600">
                Edit or delete existing jobs
              </p>
            </div>
          </Link>
          <Link
            to="/admin/users"
            className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200"
          >
            <FaUsers className="text-purple-600 text-xl" />
            <div>
              <p className="font-semibold text-gray-900">Manage Users</p>
              <p className="text-sm text-gray-600">
                View and manage user accounts
              </p>
            </div>
          </Link>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="lg:col-span-3 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage jobs, users, and applications
              </p>
            </div>
            <div className="flex gap-4">
              <Link to="/" className="btn-secondary px-6 py-3">
                View Public Site
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaBriefcase className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalJobs}
                </p>
                <p className="text-gray-600 text-sm">Total Jobs</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaUsers className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalUsers}
                </p>
                <p className="text-gray-600 text-sm">Total Users</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaFileAlt className="text-purple-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalApplications}
                </p>
                <p className="text-gray-600 text-sm">Total Applications</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FaChartLine className="text-yellow-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pendingApplications}
                </p>
                <p className="text-gray-600 text-sm">Pending Applications</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Global Search */}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Search Dashboard
          </h2>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs, users, and applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </motion.div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Jobs */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Jobs</h2>
              <Link
                to="/admin/jobs/manage"
                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
              >
                View All
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : recentJobs.length === 0 ? (
              <div className="text-center py-8">
                <FaBriefcase className="text-gray-300 text-4xl mb-4 mx-auto" />
                <p className="text-gray-500">No jobs posted yet</p>
                <Link
                  to="/admin/jobs"
                  className="btn-primary mt-4 inline-block"
                >
                  Post First Job
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentJobs
                  .filter(
                    (job) =>
                      searchTerm === "" ||
                      job.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      job.company
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                  )
                  .map((job, index) => (
                    <motion.div
                      key={job._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-center gap-3">
                        {job.companyLogo ? (
                          <img
                            src={`http://localhost:30000/uploads/${job.companyLogo}`}
                            alt={job.company}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <FaBriefcase className="text-purple-600" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-1">
                            {job.title}
                          </p>
                          <p className="text-sm text-gray-600">{job.company}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/jobs/${job._id}`}
                          className="p-2 text-gray-400 hover:text-purple-600 transition-colors duration-200"
                          title="View Job"
                        >
                          <FaEye />
                        </Link>
                        <Link
                          to={`/admin/jobs/${job._id}/edit`}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                          title="Edit Job"
                        >
                          <FaEdit />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
              </div>
            )}
          </motion.div>

          {/* Recent Users */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Users</h2>
              <Link
                to="/admin/users"
                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
              >
                View All
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : recentUsers.length === 0 ? (
              <div className="text-center py-8">
                <FaUsers className="text-gray-300 text-4xl mb-4 mx-auto" />
                <p className="text-gray-500">No users yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentUsers
                  .filter(
                    (user) =>
                      searchTerm === "" ||
                      user.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      user.email
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                  )
                  .map((user, index) => (
                    <motion.div
                      key={user._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FaUsers className="text-green-600" />
                        </div>
                        <div className="min-w-0 flex-1 overflow-hidden">
                          <p className="font-semibold text-gray-900 truncate">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-600 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          to={`/admin/users/${user._id}`}
                          className="p-2 text-gray-400 hover:text-purple-600 transition-colors duration-200"
                          title="View User"
                        >
                          <FaEye />
                        </Link>
                        <Link
                          to={`/admin/users/${user._id}/edit`}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                          title="Edit User"
                        >
                          <FaEdit />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
              </div>
            )}
          </motion.div>
          </div>


          {/* Recent Applications */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Recent Applications
              </h2>
              <Link
                to="/admin/applications"
                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
              >
                View All
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : recentApplications.length === 0 ? (
              <div className="text-center py-8">
                <FaFileAlt className="text-gray-300 text-4xl mb-4 mx-auto" />
                <p className="text-gray-500">No applications yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentApplications
                  .filter(
                    (application) =>
                      searchTerm === "" ||
                      application.job?.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      application.user?.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                  )
                  .map((application, index) => (
                    <motion.div
                      key={application._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <FaFileAlt className="text-yellow-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-1">
                            {application.job?.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            {application.user?.name} •{" "}
                            {new Date(
                              application.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                            application.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : application.status === "accepted"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {application.status}
                        </span>
                        <Link
                          to={`/admin/applications/${application._id}`}
                          className="p-2 text-gray-400 hover:text-purple-600 transition-colors duration-200"
                          title="View Application"
                        >
                          <FaEye />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
