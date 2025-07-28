const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    // Note: Password is not required, allowing for potential future OAuth integration
  },
  // --- FIX: Correctly define arrays of ObjectIds ---
  repositories: [{
    type: Schema.Types.ObjectId,
    ref: "Repository",
  }],
  followedUsers: [{
    type: Schema.Types.ObjectId,
    ref: "User",
  }],
  starRepos: [{
    type: Schema.Types.ObjectId,
    ref: "Repository",
  }],
}, { 
  // --- BEST PRACTICE: Enable timestamps ---
  timestamps: true 
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
