// Test API endpoints after deployment
const API_BASE = "https://your-app-name.vercel.app";

const tests = [
  {
    name: "Frontend Health Check",
    url: `${API_BASE}`,
    method: "GET",
  },
  {
    name: "Backend1 Health Check",
    url: `${API_BASE}/api/node/health`,
    method: "GET",
  },
  {
    name: "Backend2 Health Check",
    url: `${API_BASE}/api/python/health`,
    method: "GET",
  },
  {
    name: "Test Authentication Endpoint",
    url: `${API_BASE}/api/node/auth/signup`,
    method: "POST",
    body: {
      email: "test@example.com",
      password: "testpassword",
      fullName: "Test User",
    },
  },
  {
    name: "Test AI Recommendation",
    url: `${API_BASE}/api/python/get-recommendation`,
    method: "POST",
    body: {
      input:
        "I have a 150 sqm roof in Bangalore and want rainwater harvesting recommendations",
    },
  },
];

async function runTests() {
  console.log("🧪 Running Deployment Tests...\n");

  for (const test of tests) {
    try {
      const options = {
        method: test.method,
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (test.body) {
        options.body = JSON.stringify(test.body);
      }

      const response = await fetch(test.url, options);
      const status = response.status;
      const result = await response.json();

      console.log(`✅ ${test.name}: ${status}`);
      console.log(`   Response:`, result);
      console.log("");
    } catch (error) {
      console.log(`❌ ${test.name}: Failed`);
      console.log(`   Error:`, error.message);
      console.log("");
    }
  }
}

// Uncomment to run tests
// runTests();
