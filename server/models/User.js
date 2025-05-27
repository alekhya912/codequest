import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  about: { type: String },
  tags: { type: [String] },
  joinedOn: { type: Date, default: Date.now },
  avatar: { type: String },
  friendCount: { type: Number, default: 0 },
  postsToday: { type: Number, default: 0 },
  lastPostDate: { type: Date },
  subscription: {
    planId: String,
    startAt: Date,
    endAt: Date,
    dailyQuestionLimit: Number,
    questionsAskedToday: { type: Number, default: 0 },
    lastQuestionDate: Date,
  },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  postsToday: { type: Number, default: 0 },
  lastPostDate: Date,
});

export default mongoose.model("User", UserSchema);