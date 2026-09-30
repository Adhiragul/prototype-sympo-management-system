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
