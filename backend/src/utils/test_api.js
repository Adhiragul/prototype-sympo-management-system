const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 Running Comprehensive SRM EEC API Test Suite...\n');

  // 1. Health Check
  const healthRes = await fetch(`${BASE_URL}/health`).then(r => r.json());
  console.log('1. Health Check:', healthRes.status === 'online' ? '✅ PASS' : '❌ FAIL');

  // 2. Student Login
  const studentLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'student@eec.srmrmp.edu.in',
      password: 'Student@123'
    })
  }).then(r => r.json());

  console.log('2. Student Login:', studentLoginRes.success ? '✅ PASS' : '❌ FAIL');
  const studentToken = studentLoginRes.token;

  // 3. Organizer Login
  const organizerLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'organizer@eec.srmrmp.edu.in',
      password: 'Admin@123'
    })
  }).then(r => r.json());

  console.log('3. Organizer Login:', organizerLoginRes.success ? '✅ PASS' : '❌ FAIL');
  const organizerToken = organizerLoginRes.token;

  // 4. Fetch Events & Filter by Department: Cybersecurity
  const csEventsRes = await fetch(`${BASE_URL}/events?department=Cybersecurity`).then(r => r.json());
  console.log(
    '4. Filter by Cybersecurity:',
    csEventsRes.success && csEventsRes.events.length > 0 ? `✅ PASS (${csEventsRes.events[0].title})` : '❌ FAIL'
  );

  // 5. Filter by Department: Robotics and Automation
  const raEventsRes = await fetch(`${BASE_URL}/events?department=Robotics and Automation`).then(r => r.json());
  console.log(
    '5. Filter by Robotics & Automation:',
    raEventsRes.success && raEventsRes.events.length > 0 ? `✅ PASS (${raEventsRes.events[0].title})` : '❌ FAIL'
  );

  // 6. Filter by Department: Electrical and Electronics Engineering
  const eeeEventsRes = await fetch(`${BASE_URL}/events?department=Electrical and Electronics Engineering`).then(r => r.json());
  console.log(
    '6. Filter by EEE:',
    eeeEventsRes.success && eeeEventsRes.events.length > 0 ? `✅ PASS (${eeeEventsRes.events[0].title})` : '❌ FAIL'
  );

  // 7. Single-Click RSVP for Student on the EEE Hackathon (not yet registered)
  const eeeEvent = eeeEventsRes.events[0];
  const initialSeats = eeeEvent.seatsAvailable;

  const rsvpRes = await fetch(`${BASE_URL}/registrations/rsvp/${eeeEvent._id}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${studentToken}`,
      'Content-Type': 'application/json'
    }
  }).then(r => r.json());

  console.log(
    '7. Single-Click RSVP:',
    rsvpRes.success && rsvpRes.registration?.ticketId ? `✅ PASS (Ticket: ${rsvpRes.registration.ticketId})` : '❌ FAIL',
    rsvpRes.message
  );

  // 8. Prevent Duplicate RSVP
  const duplicateRsvpRes = await fetch(`${BASE_URL}/registrations/rsvp/${eeeEvent._id}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${studentToken}`,
      'Content-Type': 'application/json'
    }
  }).then(r => r.json());

  console.log(
    '8. Duplicate RSVP Prevention:',
    !duplicateRsvpRes.success ? `✅ PASS (${duplicateRsvpRes.message})` : '❌ FAIL'
  );

  // 9. Organizer View Attendee Roster
  const attendeesRes = await fetch(`${BASE_URL}/registrations/event/${eeeEvent._id}/attendees`, {
    headers: { 'Authorization': `Bearer ${organizerToken}` }
  }).then(r => r.json());

  console.log(
    '9. Attendee Roster:',
    attendeesRes.success && attendeesRes.attendees.length > 0 ? `✅ PASS (${attendeesRes.totalAttendees} attendees)` : '❌ FAIL'
  );

  // 10. CSV Export Endpoint
  const csvRes = await fetch(`${BASE_URL}/export/event/${eeeEvent._id}/csv`, {
