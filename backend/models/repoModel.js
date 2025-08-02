const mongoose = require("mongoose");
const { Schema } = mongoose;

const CommitSchema = new Schema({
  commitId: { type: String, required: true },
  message: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now },
});

const RepositorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    visibility: {
      type: Boolean,
      default: false
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    issues: [
      {
        type: Schema.Types.ObjectId,
        ref: "Issue",
      },
    ],
    commits: [CommitSchema], // This will store the history of pushes
  },
  {
    timestamps: true,
  }
);

const Repository = mongoose.model("Repository", RepositorySchema);
module.exports = Repository;
