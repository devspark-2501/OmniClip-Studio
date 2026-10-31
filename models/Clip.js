import mongoose from "mongoose";

const ClipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startTime: { type: Number, required: true },
  endTime: { type: Number, required: true },
  caption: { type: String },
  scheduledDate: { type: Date },
}, { timestamps: true });

export default mongoose.models.Clip || mongoose.model("Clip", ClipSchema);