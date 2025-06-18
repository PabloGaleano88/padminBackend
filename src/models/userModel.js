import mongoose from "mongoose";
import UserSchema from "../models/schemas/userSchema.js";

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
