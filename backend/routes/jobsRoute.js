import express from "express";
import { Job } from "../models/jobModel.js";
import { Application } from "../models/applicationModel.js";
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

// Get all jobs
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      location,
      type,
      category,
    } = req.query;

    let query = { isActive: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (type) {
      query.type = type;
    }

    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    const jobs = await Job.find(query)
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Job.countDocuments(query);

    res.json({
      jobs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Get job stats
router.get("/stats", async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments({ isActive: true });
    const totalCompanies = await Job.distinct("company", {
      isActive: true,
    }).then((companies) => companies.length);
    const totalApplications = await Application.countDocuments();

    res.json({
      totalJobs,
      totalCompanies,
      totalApplications,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Get single job
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "postedBy",
      "name email"
    );
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Create job (admin only)
router.post(
  "/",
  authenticate,
  authorize("admin"),
  upload.single("companyLogo"),
  async (req, res) => {
    try {
      const jobData = {
        ...req.body,
        postedBy: req.user._id,
        companyLogo: req.file ? req.file.filename : null,
      };

      const job = await Job.create(jobData);
      await job.populate("postedBy", "name email");

      res.status(201).json(job);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Update job (admin only)
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  upload.single("companyLogo"),
  async (req, res) => {
    try {
      const updates = req.body;
      if (req.file) {
        updates.companyLogo = req.file.filename;
      }

      const job = await Job.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
      }).populate("postedBy", "name email");

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      res.json(job);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Delete job (admin only)
router.delete("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Delete associated applications
    await Application.deleteMany({ job: req.params.id });

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Apply for job
router.post(
  "/:id/apply",
  authenticate,
  upload.single("resume"),
  async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Check if already applied
      const existingApplication = await Application.findOne({
        job: req.params.id,
        applicant: req.user._id,
      });

      if (existingApplication) {
        return res
          .status(400)
          .json({ message: "Already applied for this job" });
      }

      const application = await Application.create({
        job: req.params.id,
        applicant: req.user._id,
        coverLetter: req.body.coverLetter,
        resume: req.file ? req.file.filename : null,
      });

      // Increment application count
      await Job.findByIdAndUpdate(req.params.id, {
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
  }
);

export default router;
