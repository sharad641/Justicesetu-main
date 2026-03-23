require('dotenv').config();
const jwt = require('jsonwebtoken');

async function testFetch() {
  const payload = { user: { id: "a94cc45f-7297-4c1c-bbb7-3590035614e5", role: "citizen" } };
  const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '5h' });

  try {
    const res = await fetch('http://localhost:5000/api/admin/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", text);
  } catch (e) {
    console.error(e);
  }
}

testFetch();
