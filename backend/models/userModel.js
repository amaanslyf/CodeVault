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
    
  },
  
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

  timestamps: true 
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
