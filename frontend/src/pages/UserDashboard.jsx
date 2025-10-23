import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import {
  FaBriefcase,
  FaEye,
  FaClock,
  FaCheck,
  FaTimes,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

const UserDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchApplications();
  }, [user, navigate]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:30000/api/applications/my-applications",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setApplications(response.data);

      // Calculate stats
      const total = response.data.length;
      const pending = response.data.filter(
        (app) => app.status === "pending"
      ).length;
      const accepted = response.data.filter(
        (app) => app.status === "accepted"
      ).length;
      const rejected = response.data.filter(
        (app) => app.status === "rejected"
      ).length;

      setStats({ total, pending, accepted, rejected });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaClock className="text-yellow-600" />;
      case "accepted":
        return <FaCheck className="text-green-600" />;
      case "rejected":
        return <FaTimes className="text-red-600" />;
      default:
        return <FaBriefcase className="text-gray-600" />;
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 p-4 sm:p-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user.name}!
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your job applications and profile
              </p>
            </div>
            <div className="flex gap-4">
              <Link to="/" className="btn-secondary px-6 py-3">
                Browse Jobs
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaBriefcase className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
                <p className="text-gray-600 text-sm">Total Applications</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FaClock className="text-yellow-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pending}
                </p>
                <p className="text-gray-600 text-sm">Pending Review</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaCheck className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.accepted}
                </p>
                <p className="text-gray-600 text-sm">Accepted</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <FaTimes className="text-red-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.rejected}
                </p>
                <p className="text-gray-600 text-sm">Rejected</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Applications List */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Your Applications
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12">
              <FaBriefcase className="text-gray-300 text-6xl mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No applications yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start applying for jobs to see your applications here.
              </p>
              <Link to="/" className="btn-primary px-8 py-3">
                Browse Available Jobs
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((application, index) => (
                <motion.div
                  key={application._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-start gap-4">
                        {application.job?.companyLogo ? (
                          <img
                            src={`http://localhost:30000/uploads/${application.job.companyLogo}`}
                            alt={application.job.company}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FaBriefcase className="text-purple-600" />
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {application.job?.title}
                          </h3>
                          <p className="text-gray-600 mb-2">
                            {application.job?.company}
                          </p>
                          <p className="text-sm text-gray-500">
                            Applied on{" "}
                            {new Date(
                              application.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(application.status)}
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(
                            application.status
                          )}`}
                        >
                          {application.status}
                        </span>
                      </div>

                      <Link
                        to={`/jobs/${application.job?._id}`}
                        className="btn-secondary px-4 py-2 text-sm flex items-center gap-2"
                      >
                        <FaEye />
                        View Job
                      </Link>
                    </div>
                  </div>

                  {application.coverLetter && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        <strong>Cover Letter:</strong> {application.coverLetter}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UserDashboard;
