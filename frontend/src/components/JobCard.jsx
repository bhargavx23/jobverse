import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaClock,
  FaDollarSign,
  FaBuilding,
} from "react-icons/fa";

const JobCard = ({ job }) => {
  const formatSalary = (salary) => {
    if (!salary) return "Not specified";
    const { min, max, currency = "USD" } = salary;
    if (min && max) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    } else if (min) {
      return `${currency} ${min.toLocaleString()}+`;
    } else if (max) {
      return `Up to ${currency} ${max.toLocaleString()}`;
    }
    return "Not specified";
  };

  const getTypeColor = (type) => {
    const colors = {
      "full-time": "bg-green-100 text-green-800",
      "part-time": "bg-blue-100 text-blue-800",
      contract: "bg-orange-100 text-orange-800",
      internship: "bg-purple-100 text-purple-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="p-6">
        {/* Company Logo and Info */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {job.companyLogo ? (
              <img
                src={`http://localhost:30000/uploads/${job.companyLogo}`}
                alt={job.company}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaBuilding className="text-purple-600 text-xl" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                {job.title}
              </h3>
              <p className="text-gray-600 text-sm">{job.company}</p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
              job.type
            )}`}
          >
            {job.type.replace("-", " ").toUpperCase()}
          </span>
        </div>

        {/* Job Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <FaMapMarkerAlt className="text-purple-500" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <FaClock className="text-purple-500" />
            <span>{job.experience} level</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <FaDollarSign className="text-purple-500" />
            <span>{formatSalary(job.salary)}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm line-clamp-3 mb-4">
          {job.description}
        </p>

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {job.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-md"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 3 && (
              <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md">
                +{job.skills.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            {new Date(job.createdAt).toLocaleDateString()}
          </div>
          <Link
            to={`/jobs/${job._id}`}
            className="btn-primary px-4 py-2 text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;
