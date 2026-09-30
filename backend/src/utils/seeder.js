import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting SRM Easwari Engineering College Seeder...');

    // Clear existing data
    await User.deleteMany();
    await Event.deleteMany();
    await Registration.deleteMany();

    console.log('🧹 Cleaned existing database records.');

    // 1. Create Users
    const organizer = await User.create({
      name: 'Dr. R. Anand (Faculty Coordinator)',
      email: 'organizer@eec.srmrmp.edu.in',
      password: 'Admin@123',
      role: 'organizer',
      department: 'Cybersecurity',
      collegeName: 'SRM Easwari Engineering College (Autonomous)',
      rollNo: 'FAC-CYS-104',
      year: 4,
      phone: '+91 98401 23456'
    });

    const student1 = await User.create({
      name: 'Adhiragul S',
      email: 'student@eec.srmrmp.edu.in',
      password: 'Student@123',
      role: 'student',
      department: 'Cybersecurity',
      collegeName: 'SRM Easwari Engineering College (Autonomous)',
      rollNo: '310621205001',
      year: 3,
      phone: '+91 94441 56789'
    });

    const student2 = await User.create({
      name: 'Karthik Narayanan',
