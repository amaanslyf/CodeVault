const mongoose = require("mongoose");
const { Schema } = mongoose;

const IssueSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
    repository: {
      type: Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Issue = mongoose.model("Issue", IssueSchema);
module.exports = Issue;
