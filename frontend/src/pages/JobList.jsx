import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import JobCard from "../components/JobCard";
import Logo from "../components/Logo";
import Footer from "../components/Footer";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";

import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaSearch,
  FaFilter,
  FaStar,
  FaRocket,
  FaHandshake,
  FaChartLine,
  FaGlobe,
  FaAward,
  FaCheckCircle,
  FaArrowRight,
  FaPlay,
  FaQuoteLeft,
  FaBuilding,
  FaUserCheck,
  FaTrophy,
  FaLightbulb,
  FaHeart,
  FaShieldAlt,
} from "react-icons/fa";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCompanies: 0,
    totalApplications: 0,
  });
  const { user } = useAuth();

  const fetchJobs = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 10,
        search: searchTerm,
        location: locationFilter,
        type: typeFilter,
      });

      const response = await axios.get(
        `https://jobverse-g2td.onrender.com/api/jobs?${params}`
      );
      setJobs(response.data.jobs);
      setTotalPages(response.data.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get("https://jobverse-g2td.onrender.com/api/jobs/stats");
      setStats(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchStats();
  }, [searchTerm, locationFilter, typeFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(1);
  };

  const handlePageChange = (page) => {
    fetchJobs(page);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10"></div>
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          {/* Header Section */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 mb-6 shadow-lg"
            >
              <FaRocket className="text-purple-600" />
              <span className="text-purple-700 font-medium">
                Find Your Dream Job
              </span>
            </motion.div>

            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-6"
            >
              <Logo className="text-5xl sm:text-6xl lg:text-7xl" />
            </motion.div>
            <motion.p
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Discover amazing career opportunities and connect with top
              companies worldwide
            </motion.p>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center">
              <FaBriefcase className="text-3xl text-purple-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900">
                {stats.totalJobs}
              </div>
              <div className="text-gray-600">Active Jobs</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center">
              <FaHandshake className="text-3xl text-blue-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900">
                {stats.totalCompanies}
              </div>
              <div className="text-gray-600">Companies</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center">
              <FaChartLine className="text-3xl text-green-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900">
                {stats.totalApplications}
              </div>
              <div className="text-gray-600">Applications</div>
            </div>
          </motion.div>

          {/* Quick Stats and Features */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-all duration-300">
              <FaBriefcase className="text-3xl text-purple-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalJobs}
              </div>
              <div className="text-gray-600">Active Jobs</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-all duration-300">
              <FaHandshake className="text-3xl text-blue-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalCompanies}
              </div>
              <div className="text-gray-600">Companies</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-all duration-300">
              <FaChartLine className="text-3xl text-green-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalApplications}
              </div>
              <div className="text-gray-600">Applications</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-all duration-300">
              <FaUsers className="text-3xl text-orange-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">1000+</div>
              <div className="text-gray-600">Happy Users</div>
            </div>
          </motion.div>

          {/* Call to Action Banner */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 text-white text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">
              Find Your Perfect Job Today
            </h2>
            <p className="text-lg mb-6 text-purple-100">
              Browse through thousands of opportunities and take the next step
              in your career
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user ? (
                <>
                  <Link
                    to="/register"
                    className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    Join Now
                  </Link>
                  <Link
                    to="/login"
                    className="border-2 border-white text-white px-6 py-3 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 hover:bg-white hover:text-purple-600"
                  >
                    Sign In
                  </Link>
                </>
              ) : (
                <div className="flex gap-4">
                  <Link
                    to="/dashboard"
                    className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    My Dashboard
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      className="border-2 border-white text-white px-6 py-3 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 hover:bg-white hover:text-purple-600"
                    >
                      Admin Panel
                    </Link>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search and Filters */}
        <motion.form
          id="search"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSearch}
          className="mb-12 bg-white rounded-3xl shadow-xl p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500 text-xl" />
              <input
                type="text"
                placeholder="Search jobs, companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 text-lg"
              />
            </div>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500 text-xl" />
              <input
                type="text"
                placeholder="Location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 text-lg"
              />
            </div>
            <div className="relative">
              <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500 text-xl" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 text-lg appearance-none"
              >
                <option value="">All Types</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <FaSearch />
              Search Jobs
            </button>
          </div>
        </motion.form>

        {/* Jobs List */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {loading ? (
            <div className="flex justify-center py-20">
              <Spinner />
            </div>
          ) : jobs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-white rounded-3xl shadow-xl"
            >
              <FaBriefcase className="text-6xl text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-600 mb-4">
                No jobs found
              </h3>
              <p className="text-gray-500 text-lg mb-8">
                Try adjusting your search criteria or check back later for new
                opportunities.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setLocationFilter("");
                  setTypeFilter("");
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-200"
              >
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {jobs.length} Job{jobs.length !== 1 ? "s" : ""} Found
                </h2>
                <div className="text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {jobs.map((job, index) => (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="transform hover:scale-105 transition-all duration-200"
                  >
                    <JobCard job={job} />
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center gap-3"
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                      page === currentPage
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                        : "bg-white text-purple-600 hover:bg-purple-50 shadow-md"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Features Section */}
      <Features />

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in just three simple steps and land your dream job
              today.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Create Your Profile
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Sign up and build your professional profile to showcase your
                skills and experience.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Search & Apply
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Use our advanced search to find jobs that match your preferences
                and apply instantly.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Get Hired
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Track your applications and connect with employers for your next
                career opportunity.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      <Footer />
    </div>
  );
};

export default JobList;
