import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { eventApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  Image, 
  Tag, 
  Award, 
  Sparkles, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';

const DEPARTMENTS = [
  'Cybersecurity',
  'Robotics and Automation',
  'Electrical and Electronics Engineering',
  'Computer Science & Engineering',
  'Information Technology',
  'Artificial Intelligence & Data Science',
  'Electronics & Communication Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Biomedical Engineering',
  'Management Studies'
];

const CATEGORIES = [
  'Symposium',
  'Workshop',
  'Hackathon',
  'Paper Presentation',
  'Seminar',
  'Technical Contest'
];

const VENUES = [
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

