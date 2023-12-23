const mongoose = require("mongoose");
const plm = require("passport-local-mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/Crud");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
  posts:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  }],
  password: {
    type: String,
   
    trim: true,
  },
  image:{
    type:String
  },
});

userSchema.plugin(plm)

module.exports=mongoose.model("user",userSchema)