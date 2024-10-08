import mongoose from "mongoose";

const User = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
});

const UserSchema = mongoose.model("User", User);

export default UserSchema;
