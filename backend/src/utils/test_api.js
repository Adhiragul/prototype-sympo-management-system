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
