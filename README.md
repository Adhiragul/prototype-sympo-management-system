# <p align="center">🎓 SRM EEC SympoSphere</p>
### <p align="center">Campus Symposium & Workshop Registration Management System</p>
<p align="center">
  <b>Easwari Engineering College (Autonomous) — SRM Group, Ramapuram, Chennai</b><br/>
  <i>Affiliated to Anna University • Accredited by NAAC with 'A' Grade • NBA Tier-1 Accredited</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Stack-MERN-blue.svg?style=for-the-badge&logo=react" alt="MERN Stack" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="License" />
</p>

---

## 📌 Executive Summary

**SRM EEC SympoSphere** is an institutional web platform designed for **Easwari Engineering College (Autonomous)** to automate and streamline the lifecycle of technical symposiums, hands-on workshops, hackathons, and guest lectures. 

It equips departmental student clubs with tools to publish events, track live seating capacity with atomic concurrency, verify physical attendance using scannable QR tickets, and export one-click attendee reports in **CSV (RFC 4180 / Excel)** and **JSON** formats.

---

## 🏛️ Specialized Campus Departments

| Department | Department Code | Key Campus Clubs | Flagship Annual Events |
| :--- | :---: | :--- | :--- |
| **Cybersecurity** | **CS / CYS** | CyberDef Club EEC | **CYBERBLITZ '26** (National Ethical Hacking & CTF) |
| **Robotics & Automation** | **RA** | RoboTech Club EEC | **ROBOVISION '26** (ROS 2, Manipulators & SLAM) |
| **Electrical & Electronics Engineering** | **EEE** | IEEE EEC Student Branch & EEE Assoc | **ELECTROVOLT '26** (Smart Grids & EV Powertrains) |
| **Computer Science & Engineering** | **CSE** | Association of Computer Engineers (ACE) | **INTERFACE '26** (Competitive Coding Arena & Hackathon) |
| **Artificial Intelligence & Data Science** | **AI&DS** | NextGen AI Club EEC | **AI NEXUS '26** (GenAI, LangChain & Agentic LLMs) |
| **Information Technology** | **IT** | GDSC EEC Chapter | **INNOVENTURE '26** (Cloud Native & Kubernetes) |
| **Electronics & Communication** | **ECE** | IETE Student Forum | **ELECTRONICA '26** (IoT & Edge Computing) |

---

## ⚡ Core Technical Features

### 1. 🎟️ Single-Click RSVP with Atomic Concurrency
- Prevents race conditions and overbooking when hundreds of students register simultaneously.
- Employs MongoDB atomic operators: `{ seatsAvailable: { $gt: 0 } }` with `$inc: { seatsAvailable: -1 }`.
- Instant user confirmation with celebratory confetti animation.
- Instant self-service RSVP cancellation with automated seat reclaiming.

### 2. 📱 Scannable Digital Entry Pass (QR Code)
- Generates a unique institutional registration code (e.g. `EEC-CYS-849201`).
- Embeds encrypted verification data into a scannable **QR Code** (`qrcode.react`).
- Formatted printable entry badge featuring college crest, attendee roll number, department, reporting time, and venue instructions.

### 3. 📊 Administrative Attendee Roster & Export (CSV / JSON)
- **Export to CSV**: RFC 4180-compliant export formatted for Microsoft Excel & Google Sheets containing:
  - *Ticket ID, Student Name, College Email, Department, College, Roll No, Study Year, Phone, Registration Timestamp, Attendance Status, Check-in Time*.
- **Export to JSON**: Structured data payload for integration with college ERP and accreditation data pipelines.
- **Live Check-in Desk**: One-click check-in toggle directly on the organizer dashboard to mark students **Present** or **Absent** with live verification timestamps.

### 4. 🔍 Multi-Criteria Event Discovery & Filtering
- Filter by Department (including quick pills for **Cybersecurity**, **Robotics & Automation**, and **EEE**).
- Filter by Category (*Symposium*, *Workshop*, *Hackathon*, *Paper Presentation*, *Seminar*, *Technical Contest*).
- Real-time search across event titles, club names, descriptions, and tags.
- Availability toggle (*Available Seats Only*).
- Sort by Date (upcoming/latest), Remaining Seats, or Capacity.

### 5. 🛡️ Role-Based Access Control (RBAC) & Security
- Strict JWT bearer authentication with bcrypt password hashing.
- Differentiated user roles: **Student Attendee** and **Club Organizer / Faculty Coordinator**.

### 6. 💾 Zero-Config Database Fallback
- Connects to local MongoDB or MongoDB Atlas via `MONGODB_URI` in `.env`.
- Automatically spins up an embedded `mongodb-memory-server` with pre-seeded demo symposiums and test accounts if no MongoDB daemon is installed on the host machine.

---

## 👥 Pre-Seeded Demo Credentials

The application includes pre-loaded demo accounts for instant evaluation:

| Role | Email Address | Password | Profile Details |
| :--- | :--- | :--- | :--- |
| **Faculty / Club Organizer** | `organizer@eec.srmrmp.edu.in` | `Admin@123` | Dr. R. Anand (Staff Coordinator, Cybersecurity) |
| **Student (Cybersecurity)** | `student@eec.srmrmp.edu.in` | `Student@123` | Adhiragul S (3rd Year, Roll No: `310621205001`) |
| **Student (Robotics & Auto)** | `karthik.ra@eec.srmrmp.edu.in` | `Student@123` | Karthik Narayanan (3rd Year, Roll No: `310621206015`) |
| **Student (EEE)** | `swetha.eee@eec.srmrmp.edu.in` | `Student@123` | Swetha Raman (2nd Year, Roll No: `310621207042`) |

> ⚡ *Tip: Use the **Quick Demo** switcher pills located directly on the top navigation bar or the login screen for 1-click credential auto-fill!*

---

## 🏢 Campus Venues Directory

- **TRP Auditorium**: 1,200+ capacity auditorium with stage lighting and line-array audio for national symposium keynotes.
- **EEC Mini Auditorium**: Block 2 hall for technical paper presentations and guest seminars.
- **Cyber Defense Lab (CS)**: High-security isolated network lab with capture-the-flag simulation rigs.
- **Robotics & Automation Lab (RA)**: Industrial robotic arms, ROS 2 workstations, and LiDAR test tracks.
- **Power Electronics Lab (EEE)**: Smart grid testbeds, EV motor controllers, and battery management systems.
- **Hi-Tech Seminar Hall - Block 5**: Modern hybrid seminar auditorium with live broadcast equipment.

---

## 🛠️ Technology Stack Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React 19 + Vite)                      │
│   • Tailwind CSS (SRM Navy & Gold Theme)   • Lucide React Icons        │
│   • React Router DOM v7                    • Canvas Confetti           │
│   • Axios (Bearer Interceptor)             • QRCode.React              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / REST (JSON + JWT)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     BACKEND API (Node.js + Express)                    │
│   • JWT Auth & RBAC Middleware             • Concurrency Lock ($inc)   │
│   • Json2csv (RFC 4180 Stream)             • Auto-Seeder Engine        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Mongoose ODM
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        DATABASE (MongoDB Engine)                       │
│   • MongoDB Atlas / Local MongoDB          • MongoMemoryServer Fallback│
│   • Schemas: Users, Events, Registrations                              │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18, v20, or v22+)
- [Git](https://git-scm.com/)

### 1. Clone the Repository
