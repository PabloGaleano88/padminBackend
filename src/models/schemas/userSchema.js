import { Schema } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["medico", "psicologo", "kinesiologo"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },

  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
});

export default UserSchema;
