import mongoose from "mongoose";

const jobSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["full-time", "part-time", "contract", "freelance", "internship"],
      required: true,
    },
    salary: {
      type: String, // Changed to string to allow flexible salary ranges
    },
    description: {
      type: String,
      required: true,
    },
    requirements: String, // Changed to single string instead of array
    benefits: String, // Changed to single string instead of array
    skills: [String],
    experience: {
      type: String,
      enum: ["entry", "mid", "senior", "executive"],
    },
    category: String,
    companyLogo: String, // file path
    applicationDeadline: Date,
    contactEmail: String,
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    applicationCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Job = mongoose.model("Job", jobSchema);
