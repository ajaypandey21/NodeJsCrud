const mongoose = require("mongoose");

// Define the schema for the model
const postSchema = new mongoose.Schema({
  postText: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // Assuming there is a 'User' model with this reference
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

// Create the model using the schema
module.exports = mongoose.model("Post", postSchema);
