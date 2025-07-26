const Issue = require('../models/issueModel');
const mongoose = require('mongoose');

// --- MODIFIED: createIssue now uses the authenticated user as the author ---
async function createIssue(req, res) {
  const { title, description } = req.body;
  const { repoId } = req.params; // The ID of the repository to which the issue belongs.

  try {
    // --- NEW: Get the author's ID from the authenticated user ---
    // The `authMiddleware` provides the logged-in user's data in `req.user`.
    const authorId = req.user._id;

    // Create the new issue with the Mongoose model.
    const newIssue = new Issue({
      title,
      description,
      repository: repoId,
      author: authorId, // Set the author to the logged-in user.
    });

    const savedIssue = await newIssue.save();

    // Also, add the new issue's ID to the corresponding repository's 'issues' array.
    // This is optional but good for data consistency.
    await mongoose.model('Repository').findByIdAndUpdate(repoId, {
      $push: { issues: savedIssue._id },
    });

    res.status(201).json(savedIssue);
  } catch (error) {
    console.error("Error creating issue:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// --- No major changes needed below, but I've ensured they are correct and consistent. ---

async function getAllIssues(req, res) {
  const { repoId } = req.params;
  try {
    // find() returns a query, so we must 'await' it.
    const issues = await Issue.find({ repository: repoId }).populate('author', 'username');

    res.status(200).json(issues);
  } catch (err) {
    console.error("Error fetching issues: ", err.message);
    res.status(500).json({ message: "Server error" });
  }
}

async function getIssueById(req, res) {
  const { id } = req.params;
  try {
    const issue = await Issue.findById(id).populate('author', 'username');
    if (!issue) {
      return res.status(404).json({ message: "Issue not found!" });
    }
    res.json(issue);
  } catch (err) {
    console.error("Error fetching issue: ", err.message);
    res.status(500).json({ message: "Server error" });
  }
}

async function updateIssueById(req, res) {
  const { id } = req.params;
  const { title, description, status } = req.body;
  try {
    // Note: Add authorization here later if you only want the author to be able to update it.
    const updatedIssue = await Issue.findByIdAndUpdate(
      id,
      { title, description, status },
      { new: true }
    );

    if (!updatedIssue) {
      return res.status(404).json({ message: "Issue not found!" });
    }
    res.json({ message: "Issue updated", issue: updatedIssue });
  } catch (err) {
    console.error("Error during issue update: ", err.message);
    res.status(500).json({ message: "Server error" });
  }
}

async function deleteIssueById(req, res) {
  const { id } = req.params;
  try {
    // Note: Add authorization here later if you only want the author to be able to delete it.
    const issue = await Issue.findByIdAndDelete(id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found!" });
    }
    res.json({ message: "Issue deleted successfully" });
  } catch (err) {
    console.error("Error during issue deletion: ", err.message);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  createIssue,
  updateIssueById,
  deleteIssueById,
  getAllIssues,
  getIssueById,
};
