import mongoose from 'mongoose';
import { DEPARTMENTS } from './User.js';

export const CATEGORIES = [
  'Symposium',
  'Workshop',
  'Hackathon',
  'Paper Presentation',
  'Seminar',
  'Technical Contest'
];

export const VENUES = [
  'TRP Auditorium',
  'EEC Mini Auditorium',
  'Hi-Tech Seminar Hall - Block 5',
  'Cyber Defense Lab (CS)',
  'Robotics & Automation Lab (RA)',
  'Power Electronics Lab (EEE)',
  'Smart Computing Center (CSE)',
  'IoT & Embedded Systems Lab (ECE)',
  'CAD/CAM Simulation Center (Mech)',
  'EEC Convention Ground',
  'Virtual (Google Meet / Zoom)'
];

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an event title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide detailed event description']
    },
    department: {
      type: String,
      enum: DEPARTMENTS,
      required: [true, 'Please specify the host department']
    },
    category: {
      type: String,
      enum: CATEGORIES,
      required: [true, 'Please select event category']
    },
    clubName: {
      type: String,
      required: [true, 'Please specify the organizing club or student body'],
      trim: true
    },
    venue: {
      type: String,
      required: [true, 'Please specify event venue or virtual link'],
      trim: true
    },
    mode: {
      type: String,
      enum: ['In-Person', 'Virtual', 'Hybrid'],
      default: 'In-Person'
    },
    eventDate: {
      type: Date,
      required: [true, 'Please set event date and time']
    },
    endDate: {
      type: Date
    },
    registrationDeadline: {
      type: Date,
      required: [true, 'Please set registration deadline']
    },
    totalSeats: {
      type: Number,
      required: [true, 'Please set maximum seating capacity'],
      min: [1, 'Total seats must be at least 1']
    },
    seatsAvailable: {
      type: Number,
      required: true,
      min: [0, 'Available seats cannot be negative']
    },
    bannerUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80'
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    contactEmail: {
      type: String,
      trim: true
    },
    contactPhone: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming'
    },
    certificateProvided: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes for super fast search & filter queries
eventSchema.index({ department: 1, category: 1, eventDate: 1 });
eventSchema.index({ title: 'text', description: 'text', tags: 'text' });

const Event = mongoose.model('Event', eventSchema);
export default Event;
