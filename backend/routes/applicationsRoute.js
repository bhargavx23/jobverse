import express from "express";
import { Application } from "../models/applicationModel.js";
import { Job } from "../models/jobModel.js";
import { authenticate, authorize } from "../middleware/auth.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Ensure uploads directory exists
if (!fs.existsSync("public/uploads")) {
  fs.mkdirSync("public/uploads", { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Get user's applications
router.get("/my-applications", authenticate, async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate({
        path: "job",
        populate: { path: "postedBy", select: "name email" },
      })
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Get applications for a job (admin only)
router.get(
  "/job/:jobId",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const applications = await Application.find({ job: req.params.jobId })
        .populate("applicant", "name email profile")
        .sort({ createdAt: -1 });

      res.json(applications);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Update application status (admin only)
router.put(
  "/:id/status",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const { status } = req.body;

      const application = await Application.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      ).populate([
        { path: "job", populate: { path: "postedBy", select: "name email" } },
        { path: "applicant", select: "name email profile" },
      ]);

      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      res.json({
        message: "Application status updated successfully",
        application,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Create application (apply for job)
router.post("/", authenticate, upload.single("resume"), async (req, res) => {
  try {
    const {
      jobId,
      coverLetter,
      portfolio,
      linkedin,
      github,
      expectedSalary,
      availability,
      additionalInfo,
    } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });

    if (existingApplication) {
      return res.status(400).json({ message: "Already applied for this job" });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      coverLetter,
      resume: req.file ? req.file.filename : null,
      portfolio,
      linkedin,
      github,
      expectedSalary,
      availability,
      additionalInfo,
    });

    // Increment application count
    await Job.findByIdAndUpdate(jobId, {
      $inc: { applicationCount: 1 },
    });

    await application.populate([
      { path: "job", populate: { path: "postedBy", select: "name email" } },
      { path: "applicant", select: "name email" },
    ]);

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Delete application
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Only allow applicant or admin to delete
    if (
      application.applicant.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Application.findByIdAndDelete(req.params.id);

    // Decrement application count
    await Job.findByIdAndUpdate(application.job, {
      $inc: { applicationCount: -1 },
    });

    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
