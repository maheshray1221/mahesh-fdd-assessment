// models/Ticket.js
import mongoose from "mongoose"

const ticketSchema = new mongoose.Schema(
  {
    // Customer Info
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please use a valid email address"],  // use regerxr
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },

    // AI Triage Fields
    category: {
      type: String,
      enum: ['Bug Report', 'Feature Request', 'Billing Issue', 'General Question', 'Urgent/Critical'],
      default: null,
    },
    priority: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    aiSummary: {
      type: String,
      default: null,
    },
    aiStatus: {
      type: String,
      enum: ['pending', 'processed', 'failed'],
      default: 'pending',
    },

    // Admin Fields
    status: {
      type: String,
      enum: ['open', 'resolved'],
      default: 'open',
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt auto
  }
);

// Indexes for dashboard filtering & sorting
ticketSchema.index({ category: 1 });
ticketSchema.index({ priority: -1 });
ticketSchema.index({ status: 1 });
ticketSchema.index({ createdAt: -1 });

const TIcket = mongoose.model('Ticket', ticketSchema);

export default TIcket