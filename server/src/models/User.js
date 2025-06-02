import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
    min: 18,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  status: { // Add this field for active/inactive status
    type: String,
    enum: ["active", "inactive"],
    default: "inactive", // Default value
  },
  role: {
    type: String,
    enum: ["admin", "employee"],
    default: "employee",
  },
  profileUrl: {
    type: String,
    default: "https://files.slack.com/files-pri/T08J90YLEQK-F08TM5S4S2F/png_new.png", // default avatar
  },
}, {
  timestamps: true,
});
const User = mongoose.model("User", userSchema);
export default User;
