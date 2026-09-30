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
          "The premier annual symposium of SRM Easwari Engineering College's Department of Cybersecurity. Featuring live capture-the-flag (CTF), reverse engineering, threat hunting sessions, and a keynote by top CERT-In security researchers.",
        department: 'Cybersecurity',
        category: 'Symposium',
        clubName: 'CyberDef Club EEC',
        venue: 'TRP Auditorium',
        mode: 'In-Person',
        eventDate: nextWeek,
        endDate: new Date(nextWeek.getTime() + 6 * 60 * 60 * 1000),
        registrationDeadline: new Date(nextWeek.getTime() - 24 * 60 * 60 * 1000),
        totalSeats: 150,
        seatsAvailable: 147, // 3 registrations seeded
        bannerUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80',
        tags: ['Cybersecurity', 'CTF', 'Ethical Hacking', 'Symposium', 'Network Security'],
        organizer: organizer._id,
        contactEmail: 'cyberdef@eec.srmrmp.edu.in',
        contactPhone: '+91 98401 23456',
        certificateProvided: true
      },
      {
        title: 'Industrial Robotics & ROS 2 (Robot Operating System) Hands-on Workshop',
        description:
          'Deep dive into autonomous mobile robotics, ROS 2 Humble framework, LiDAR SLAM mapping, and kinematics simulation in Gazebo. Participants will program real manipulator arms in the advanced RA lab.',
        department: 'Robotics and Automation',
        category: 'Workshop',
        clubName: 'RoboTech Club EEC',
        venue: 'Robotics & Automation Lab (RA)',
        mode: 'In-Person',
        eventDate: inTwoWeeks,
        endDate: new Date(inTwoWeeks.getTime() + 8 * 60 * 60 * 1000),
        registrationDeadline: new Date(inTwoWeeks.getTime() - 48 * 60 * 60 * 1000),
        totalSeats: 45,
        seatsAvailable: 43, // 2 registrations seeded
        bannerUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&auto=format&fit=crop&q=80',
        tags: ['Robotics', 'ROS2', 'SLAM', 'Automation', 'Manipulators'],
        organizer: organizer._id,
        contactEmail: 'robotech@eec.srmrmp.edu.in',
        contactPhone: '+91 98401 23457',
        certificateProvided: true
      },
      {
        title: "ELECTROVOLT '26 - Smart Grid & EV Powertrain Hackathon",
        description:
          'A 24-hour innovation sprint addressing next-generation Electric Vehicle Battery Management Systems (BMS), Regenerative Braking, and Microgrid integration. Cash prizes worth Rs. 50,000 up for grabs.',
        department: 'Electrical and Electronics Engineering',
        category: 'Hackathon',
        clubName: 'IEEE EEC Student Branch & EEE Association',
        venue: 'Power Electronics Lab (EEE)',
        mode: 'In-Person',
        eventDate: inThreeWeeks,
        endDate: new Date(inThreeWeeks.getTime() + 24 * 60 * 60 * 1000),
        registrationDeadline: new Date(inThreeWeeks.getTime() - 3 * 24 * 60 * 60 * 1000),
        totalSeats: 60,
        seatsAvailable: 58,
        bannerUrl: 'https://images.unsplash.com/photo-1558441719-8b489c63f7d1?w=1200&auto=format&fit=crop&q=80',
        tags: ['Electric Vehicles', 'BMS', 'Smart Grid', 'IEEE', 'Hackathon'],
        organizer: organizer._id,
        contactEmail: 'ieee@eec.srmrmp.edu.in',
        contactPhone: '+91 98401 23458',
        certificateProvided: true
      },
      {
        title: 'Generative AI & Agentic Workflows with LangChain Masterclass',
        description:
          'Build end-to-end multi-agent AI systems, fine-tune open-weights LLMs, and implement Retrieval Augmented Generation (RAG) pipelines for academic and industrial datasets.',
        department: 'Artificial Intelligence & Data Science',
        category: 'Workshop',
        clubName: 'NextGen AI Club EEC',
        venue: 'Hi-Tech Seminar Hall - Block 5',
        mode: 'Hybrid',
        eventDate: inOneMonth,
        endDate: new Date(inOneMonth.getTime() + 6 * 60 * 60 * 1000),
        registrationDeadline: new Date(inOneMonth.getTime() - 48 * 60 * 60 * 1000),
        totalSeats: 100,
        seatsAvailable: 98,
        bannerUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&auto=format&fit=crop&q=80',
        tags: ['GenAI', 'LLM', 'LangChain', 'Python', 'AI'],
        organizer: organizer._id,
        contactEmail: 'aids@eec.srmrmp.edu.in',
        contactPhone: '+91 98401 23459',
        certificateProvided: true
      },
      {
        title: "INTERFACE '26 - State-Level Technical Symposium & Competitive Coding Arena",
        description:
          'Easwari Engineering College CSE Department proudly presents Interface 2026! Packed with Blind Coding, Web Development sprints, Bug Bounty, Technical Paper Presentation, and Gaming Contests.',
        department: 'Computer Science & Engineering',
        category: 'Symposium',
        clubName: 'Association of Computer Engineers (ACE)',
        venue: 'TRP Auditorium',
        mode: 'In-Person',
        eventDate: new Date(now.getTime() + 35 * 24 * 60 * 60 * 1000),
        registrationDeadline: new Date(now.getTime() + 32 * 24 * 60 * 60 * 1000),
        totalSeats: 200,
        seatsAvailable: 200,
        bannerUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
        tags: ['Coding', 'Algorithms', 'ACE', 'Competitive Programming', 'Paper Presentation'],
        organizer: organizer._id,
        contactEmail: 'ace@eec.srmrmp.edu.in',
        contactPhone: '+91 98401 23460',
        certificateProvided: true
      }
    ]);

    console.log(`✅ Created ${events.length} SRM EEC Events.`);

    // 3. Create Sample Registrations
    const reg1 = await Registration.create({
      event: events[0]._id, // CyberBlitz
      user: student1._id, // Adhiragul S
      ticketId: 'EEC-CYS-849201',
      status: 'confirmed',
      attended: true,
      attendedAt: new Date(),
      registeredAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
    });

    const reg2 = await Registration.create({
      event: events[0]._id, // CyberBlitz
      user: student2._id, // Karthik
      ticketId: 'EEC-CYS-849202',
      status: 'confirmed',
      attended: false,
      registeredAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
    });

    const reg3 = await Registration.create({
      event: events[0]._id, // CyberBlitz
      user: student3._id, // Swetha
      ticketId: 'EEC-CYS-849203',
      status: 'confirmed',
      attended: true,
      attendedAt: new Date(),
      registeredAt: new Date(now.getTime() - 12 * 60 * 60 * 1000)
    });

    // Registrations for Robotics Workshop
    await Registration.create({
      event: events[1]._id,
      user: student1._id,
      ticketId: 'EEC-ROB-190341',
      status: 'confirmed',
      attended: false,
      registeredAt: new Date(now.getTime() - 20 * 60 * 60 * 1000)
    });

    await Registration.create({
      event: events[1]._id,
      user: student2._id,
      ticketId: 'EEC-ROB-190342',
      status: 'confirmed',
      attended: true,
      attendedAt: new Date(),
      registeredAt: new Date(now.getTime() - 18 * 60 * 60 * 1000)
    });

    // Registrations for EEE Hackathon
    await Registration.create({
      event: events[2]._id,
      user: student3._id,
      ticketId: 'EEC-EEE-552109',
      status: 'confirmed',
      attended: false,
      registeredAt: new Date(now.getTime() - 15 * 60 * 60 * 1000)
    });

    await Registration.create({
      event: events[2]._id,
      user: student4._id,
      ticketId: 'EEC-EEE-552110',
      status: 'confirmed',
      attended: false,
      registeredAt: new Date(now.getTime() - 10 * 60 * 60 * 1000)
    });

    console.log('✅ Created Demo Registrations with unique tickets.');
    console.log('🎉 Seeding successfully completed!');
  } catch (error) {
    console.error('❌ Seeding Error:', error);
  }
};

// If run directly from CLI
if (process.argv[1]?.endsWith('seeder.js')) {
  (async () => {
    await connectDB();
    await seedDatabase();
    await mongoose.disconnect();
    process.exit(0);
  })();
}
