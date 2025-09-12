// TypeScript with Mongoose
import { Schema, model } from "mongoose";

const shortURLSchema = new Schema(
  {
    originalUrl: { type: String, required: true },
    shortCode: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "user", default: null },
    expiresAt: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
    title: { type: String }, // Optional: fetched via metadata
    utm: {
      source: String,
      medium: String,
      campaign: String,
      term: String,
      content: String,
    },
    clickCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ShortURL = model("shortURL", shortURLSchema);
