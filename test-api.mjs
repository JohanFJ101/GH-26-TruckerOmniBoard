

const BASE_URL = 'https://api.truckerpath.com/navpro';
const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIzYTgyMTg5YmE3MmMxNTMzODg4ZWU1ZDkzN2EyMzM4ZiIsImlhdCI6MTc3NjU2ODA3NCwiZXhwIjoxODA4MTA0MDc0fQ.vVTC9gDeAnLjCTq__Z7woAGspn5EfTrrhsPNKIDeC0MZIMxRspciudQX6yk0xtTimIHsF2fNIuR9K9cNFlabSYS3JVIBcaz3vqlS6JSEG3xXUGvW0YTShiVLobhtycMYpTuYPj8bmctcCTQ8hjew647_g4RqYPKnmj2e74a1bUYdmnF4fwmOqxrVlOOUB4qvTZw3PMm2NnKH67DowS6awYdtKlR0BEX9W0U3olmwwcLoihyVe4WxbsSzsH2ZQXBa5He1_obMdq5yenjVt7xZefucmuEG9Mvvzwu8zkrQLoMzD1p3MWHG1woFg-29Sky0S8WQUFN8Qi96Gmz5B7f1OQ';

async function testApi() {
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  try {
    console.log("Fetching drivers...");
    const dRes = await fetch(`${BASE_URL}/api/driver/query`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ page: 0, size: 50, driver_status: "ACTIVE" })
    });
    const dData = await dRes.json();
    console.log("Drivers:", JSON.stringify(dData, null, 2));

    console.log("\nFetching vehicles...");
    const vRes = await fetch(`${BASE_URL}/api/vehicle/query`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ status: "ACTIVE", vehicle_type: "TRUCK", page: 0, size: 50 })
    });
    const vData = await vRes.json();
    console.log("Vehicles:", JSON.stringify(vData, null, 2));
    
    console.log("\nFetching terminals...");
    const tRes = await fetch(`${BASE_URL}/api/terminal/query`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ page: 0, size: 50 })
    });
    // Assuming there's a query endpoint. It wasn't in the partial swagger but usually exists. If not, this might 404.
    if (tRes.ok) {
        const tData = await tRes.json();
        console.log("Terminals:", JSON.stringify(tData, null, 2));
    } else {
        console.log("Terminal query endpoint not available or 404");
    }

  } catch (err) {
    console.error("Error:", err);
  }
}

testApi();
