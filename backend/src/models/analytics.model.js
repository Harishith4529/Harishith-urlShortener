import { Schema, model } from "mongoose";

const analyticsSchema = new Schema(
  {
    shortCode: { type: String, required: true, index: true },
    timestamp: { type: Date, default: Date.now },
    ip: { type: String },
    userAgent: { type: String },
    referrer: { type: String },
    location: {
      city: String,
      country: String,
      region: String,
    },
    device: {
      type: String, // mobile, desktop
      os: String,
      browser: String,
    },
  },
  { timestamps: true }
);

export const URLAnalytics = model("urlAnalytics", analyticsSchema);
