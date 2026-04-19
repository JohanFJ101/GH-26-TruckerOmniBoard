const BASE_URL = 'https://api.truckerpath.com/navpro';
const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIzYTgyMTg5YmE3MmMxNTMzODg4ZWU1ZDkzN2EyMzM4ZiIsImlhdCI6MTc3NjU2ODA3NCwiZXhwIjoxODA4MTA0MDc0fQ.vVTC9gDeAnLjCTq__Z7woAGspn5EfTrrhsPNKIDeC0MZIMxRspciudQX6yk0xtTimIHsF2fNIuR9K9cNFlabSYS3JVIBcaz3vqlS6JSEG3xXUGvW0YTShiVLobhtycMYpTuYPj8bmctcCTQ8hjew647_g4RqYPKnmj2e74a1bUYdmnF4fwmOqxrVlOOUB4qvTZw3PMm2NnKH67DowS6awYdtKlR0BEX9W0U3olmwwcLoihyVe4WxbsSzsH2ZQXBa5He1_obMdq5yenjVt7xZefucmuEG9Mvvzwu8zkrQLoMzD1p3MWHG1woFg-29Sky0S8WQUFN8Qi96Gmz5B7f1OQ';

const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};

async function apiCall(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });
  const data = await res.json();
  console.log(`POST ${path} ->`, data);
  return data;
}

async function seedData() {
  console.log("Starting to seed demo data into NavPro API...\n");

  // 1. Create a Terminal
  console.log("Creating Terminals...");
  await apiCall('/api/terminal/create', { terminal_name: "Chicago Main Hub" });
  await apiCall('/api/terminal/create', { terminal_name: "Dallas Secondary Terminal" });

  // 2. Create a POI Group
  console.log("\nCreating POI Group...");
  const groupRes = await apiCall('/api/poi/add/group', {
    group_name: "Preferred Rest Stops",
    group_description: "Safe overnight parking and rest areas"
  });

  // 3. Add POIs
  if (groupRes.code === 0 && groupRes.data?.id) {
    console.log("\nAdding POIs to Group ID:", groupRes.data.id);
    await apiCall('/api/poi/add', {
      name: "Iowa 80 Truckstop",
      poi_group_id: groupRes.data.id,
      latitude: 41.6146,
      longitude: -90.7719,
      poi_detail: {
        street: "755 W Iowa 80 Rd",
        city: "Walcott",
        state: "IA",
        country: "US",
        zip_code: "52773",
        contact_number: "563-284-6961",
        site_instruction: "World's largest truckstop. Lots of parking."
      },
      external_id: "POI-IA80"
    });
  }

  // 4. Create Vehicles
  console.log("\nCreating Vehicles...");
  await apiCall('/api/vehicle/add', {
    vehicle_type: "TRUCK",
    vehicle_no: "TRK-2051",
    vehicle_vin: "1HGCM82633A000001",
    fuel_type: "DIESEL",
    trailer_type: "VAN",
    axles: "AXLES_5",
    gross_vehicle_weight: 80000,
    vehicle_year: "2023",
    vehicle_make: "FREIGHTLINER",
    vehicle_model: "Cascadia",
    assign_drivers: [], // Assuming we don't have driver IDs yet
    vehicle_details: {
      vehicle_height: 162,
      vehicle_width: 102,
      vehicle_length: 864,
      vehicle_odometer: 45000,
      vehicle_owner_name: "DispatchIQ Fleet",
      year_purchased: "2023",
      transmission: "AUTOMATIC",
      sleeper_berth: true,
      braking: "FULL_AIR_BRAKE",
      fuel_capacity: 300
    }
  });

  await apiCall('/api/vehicle/add', {
    vehicle_type: "TRUCK",
    vehicle_no: "TRK-2052",
    vehicle_vin: "1HGCM82633A000002",
    fuel_type: "DIESEL",
    trailer_type: "REEFER",
    axles: "AXLES_5",
    gross_vehicle_weight: 80000,
    vehicle_year: "2022",
    vehicle_make: "VOLVO",
    vehicle_model: "VNL 860",
    assign_drivers: [],
    vehicle_details: {
      vehicle_height: 162,
      vehicle_width: 102,
      vehicle_length: 864,
      vehicle_odometer: 120000,
      vehicle_owner_name: "DispatchIQ Fleet",
      year_purchased: "2022",
      transmission: "AUTOMATIC",
      sleeper_berth: true,
      braking: "FULL_AIR_BRAKE",
      fuel_capacity: 250
    }
  });

  console.log("\nSeeding complete!");
}

seedData();
