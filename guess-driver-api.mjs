const BASE_URL = 'https://api.truckerpath.com/navpro';
const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIzYTgyMTg5YmE3MmMxNTMzODg4ZWU1ZDkzN2EyMzM4ZiIsImlhdCI6MTc3NjU2ODA3NCwiZXhwIjoxODA4MTA0MDc0fQ.vVTC9gDeAnLjCTq__Z7woAGspn5EfTrrhsPNKIDeC0MZIMxRspciudQX6yk0xtTimIHsF2fNIuR9K9cNFlabSYS3JVIBcaz3vqlS6JSEG3xXUGvW0YTShiVLobhtycMYpTuYPj8bmctcCTQ8hjew647_g4RqYPKnmj2e74a1bUYdmnF4fwmOqxrVlOOUB4qvTZw3PMm2NnKH67DowS6awYdtKlR0BEX9W0U3olmwwcLoihyVe4WxbsSzsH2ZQXBa5He1_obMdq5yenjVt7xZefucmuEG9Mvvzwu8zkrQLoMzD1p3MWHG1woFg-29Sky0S8WQUFN8Qi96Gmz5B7f1OQ';

const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};

async function run() {
  try {
    const phones = [
        "+12025550123", 
        "12025550123", 
        "202-555-0123", 
        "+1 202-555-0123", 
        "+1 (202) 555-0123", 
        "1-202-555-0123"
    ];
    
    for (const p of phones) {
        const payload = { 
            driver_info: [
                { 
                    driver_first_name: "James", 
                    driver_last_name: "Smith", 
                    driver_phone_number: p,
                    driver_email: "jsmith@dispatchiq.demo.com",
                    driver_password: "Password123!",
                    driver_type: 1
                }
            ] 
        };
        const res = await fetch(`${BASE_URL}/api/driver/invite`, { method: 'POST', headers, body: JSON.stringify(payload) });
        const text = await res.text();
        console.log(`Phone ${p} ->`, text);
    }
  } catch (err) {
    console.error(`Error:`, err.message);
  }
}

run();
