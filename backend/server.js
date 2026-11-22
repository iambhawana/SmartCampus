const express = require("express");
const cors = require("cors");

require("dotenv").config();
const mongoose = require("mongoose");
const Complaint = require("./Complaint");
const authRoutes = require("./routes/authRoutes");
const { verifyToken, verifyRole } = require("./middleware/authMiddleware");

const app = express();
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully!"))
  .catch((err) => console.log("MongoDB Connection Error:", err));
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Smart Campus Backend is running!");
});
app.post("/api/complaints", async (req, res) => {
  try {
    const complaint = await Complaint.create(req.body);

    console.log("New Complaint Saved:", complaint);

    res.status(201).json({
      message: "Complaint submitted successfully!",
      complaint: complaint
    });
  } catch (error) {
    console.log("Error saving complaint:", error);

    res.status(500).json({
      message: "Error submitting complaint"
    });
  }
});
// Get all complaints (Admin Dashboard)
app.get("/api/complaints", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching complaints"
    });
  }
});
// Track complaint using Complaint ID
app.get("/api/complaints/:id",async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found"
      });
    }

    res.json(complaint);

  } catch (error) {
    res.status(400).json({
      message: "Invalid Complaint ID"
    });
  }
});
// Update complaint status
app.patch("/api/complaints/:id", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const { status } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found"
      });
    }

    res.json({
      message: "Complaint status updated successfully",
      complaint: complaint
    });

  } catch (error) {
    res.status(400).json({
      message: "Error updating complaint status"
    });
  }
});
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
