// Test Supabase Connection
require('dotenv').config();

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

console.log('\n🔍 Testing Supabase Connection...\n');
console.log('URL:', SUPABASE_URL);
console.log('Key:', SUPABASE_KEY ? `${SUPABASE_KEY.substring(0, 20)}...` : 'NOT FOUND');

async function testConnection() {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    if (response.ok || response.status === 404) {
      console.log('\n✅ Supabase connection successful!');
      console.log('Status:', response.status);
      return true;
    } else {
      console.log('\n❌ Connection failed');
      console.log('Status:', response.status);
      console.log('Response:', await response.text());
      return false;
    }
  } catch (error) {
    console.log('\n❌ Error connecting to Supabase');
    console.error(error.message);
    return false;
  }
}

testConnection();
