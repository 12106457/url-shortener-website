
import mongoose from "mongoose";

export const UrlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
});