const BASE_URL = 'https://api.truckerpath.com/navpro';
const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIzYTgyMTg5YmE3MmMxNTMzODg4ZWU1ZDkzN2EyMzM4ZiIsImlhdCI6MTc3NjU2ODA3NCwiZXhwIjoxODA4MTA0MDc0fQ.vVTC9gDeAnLjCTq__Z7woAGspn5EfTrrhsPNKIDeC0MZIMxRspciudQX6yk0xtTimIHsF2fNIuR9K9cNFlabSYS3JVIBcaz3vqlS6JSEG3xXUGvW0YTShiVLobhtycMYpTuYPj8bmctcCTQ8hjew647_g4RqYPKnmj2e74a1bUYdmnF4fwmOqxrVlOOUB4qvTZw3PMm2NnKH67DowS6awYdtKlR0BEX9W0U3olmwwcLoihyVe4WxbsSzsH2ZQXBa5He1_obMdq5yenjVt7xZefucmuEG9Mvvzwu8zkrQLoMzD1p3MWHG1woFg-29Sky0S8WQUFN8Qi96Gmz5B7f1OQ';

const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};

async function seedDrivers() {
  console.log("Inviting drivers to NavPro API...\n");

  const payload = { 
      driver_info: [
          { 
              driver_first_name: "Maria", 
              driver_last_name: "Garcia", 
              driver_phone_number: "202-555-0124",
              driver_email: "mgarcia@dispatchiq.demo.com",
              driver_password: "Password123!",
              driver_type: 1
          },
          { 
              driver_first_name: "David", 
              driver_last_name: "Chen", 
              driver_phone_number: "202-555-0125",
              driver_email: "dchen@dispatchiq.demo.com",
              driver_password: "Password123!",
              driver_type: 1
          },
          { 
              driver_first_name: "Sarah", 
              driver_last_name: "Johnson", 
              driver_phone_number: "202-555-0126",
              driver_email: "sjohnson@dispatchiq.demo.com",
              driver_password: "Password123!",
              driver_type: 1
          }
      ] 
  };

  try {
    const res = await fetch(`${BASE_URL}/api/driver/invite`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    console.log("Driver Invite Response:", JSON.stringify(data, null, 2));
  } catch (e) {
      console.error(e);
  }
}

seedDrivers();
