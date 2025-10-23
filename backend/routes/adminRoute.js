import express from "express";
import { User } from "../models/userModel.js";
import { Job } from "../models/jobModel.js";
import { Application } from "../models/applicationModel.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Get all users (admin only)
router.get("/users", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Update user role (admin only)
router.put(
  "/users/:id/role",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const { role } = req.body;

      if (!["user", "admin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true }
      ).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        message: "User role updated successfully",
        user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Delete user (admin only)
router.delete(
  "/users/:id",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Prevent deleting admin users
      if (user.role === "admin") {
        return res.status(400).json({ message: "Cannot delete admin user" });
      }

      await User.findByIdAndDelete(req.params.id);

      // Delete user's applications
      await Application.deleteMany({ applicant: req.params.id });

      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Get all jobs with applications count (admin only)
router.get("/jobs", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    let query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
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

// Get dashboard stats (admin only)
router.get("/stats", authenticate, authorize("admin"), async (req, res) => {
  try {
    const [totalUsers, totalJobs, totalApplications, pendingApplications] =
      await Promise.all([
        User.countDocuments(),
        Job.countDocuments(),
        Application.countDocuments(),
        Application.countDocuments({ status: "pending" }),
      ]);

    res.json({
      totalUsers,
      totalJobs,
      totalApplications,
      pendingApplications,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Get all applications (admin only)
router.get(
  "/applications",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const { page = 1, limit = 10, search, status } = req.query;

      let query = {};
      if (search) {
        query.$or = [
          { "applicant.name": { $regex: search, $options: "i" } },
          { "job.title": { $regex: search, $options: "i" } },
          { "job.company": { $regex: search, $options: "i" } },
        ];
      }

      if (status && status !== "all") {
        query.status = status;
      }

      const applications = await Application.find(query)
        .populate("applicant", "name email")
        .populate("job", "title company")
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Application.countDocuments(query);

      res.json({
        applications,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Get recent applications (admin only)
router.get(
  "/applications/recent",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const applications = await Application.find()
        .populate("applicant", "name email")
        .populate("job", "title company")
        .sort({ createdAt: -1 })
        .limit(5);

      res.json(applications);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Get recent users (admin only)
router.get(
  "/users/recent",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const users = await User.find({ role: "user" })
        .select("-password")
        .sort({ createdAt: -1 })
        .limit(5);

      res.json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Get single application by ID (admin only)
router.get(
  "/applications/:id",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const application = await Application.findById(req.params.id)
        .populate("applicant", "name email")
        .populate("job", "title company");

      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      res.json(application);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;
