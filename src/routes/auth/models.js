import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: Boolean,
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model("User", userSchema);
