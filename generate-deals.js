// Simple script to trigger daily deal generation
async function generateDeals() {
  try {
    const response = await fetch('http://localhost:3000/api/deals/generate-daily?key=secure-daily-key-2024', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    console.log('Generation result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

generateDeals();
