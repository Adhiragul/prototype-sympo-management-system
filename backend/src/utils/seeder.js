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
      email: 'karthik.ra@eec.srmrmp.edu.in',
      password: 'Student@123',
      role: 'student',
      department: 'Robotics and Automation',
      collegeName: 'SRM Easwari Engineering College (Autonomous)',
      rollNo: '310621206015',
      year: 3,
      phone: '+91 98840 98765'
    });

    const student3 = await User.create({
      name: 'Swetha Raman',
      email: 'swetha.eee@eec.srmrmp.edu.in',
      password: 'Student@123',
      role: 'student',
      department: 'Electrical and Electronics Engineering',
      collegeName: 'SRM Easwari Engineering College (Autonomous)',
      rollNo: '310621207042',
      year: 2,
      phone: '+91 97910 11223'
    });

    const student4 = await User.create({
      name: 'Praveen Kumar',
      email: 'praveen.cse@eec.srmrmp.edu.in',
      password: 'Student@123',
      role: 'student',
      department: 'Computer Science & Engineering',
      collegeName: 'SRM Easwari Engineering College (Autonomous)',
      rollNo: '310621208088',
      year: 4,
      phone: '+91 91760 33445'
    });

    console.log('✅ Created Demo Users (Organizer & Students).');

    // Dates
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const inTwoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    const inThreeWeeks = new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000);
    const inOneMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    // 2. Create Events
    const events = await Event.create([
      {
        title: "CYBERBLITZ '26 - National Level Cyber Defense & Ethical Hacking Symposium",
        description:
