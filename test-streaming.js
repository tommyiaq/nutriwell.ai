// Simple test for the streaming API implementation
// This is just for debugging purposes to verify our SSE parsing works

// Mock streaming response data
const mockStreamData = `data: {"type":"delta","delta":"Hello "}

data: {"type":"delta","delta":"there! "}

data: {"type":"delta","delta":"How can I help "}

data: {"type":"delta","delta":"you today?"}

data: {"type":"end","status":"ok","data":{"sessionId":"test123","creditLimit":100,"usedCredit":5}}

`;

// Test our streaming parser logic
function testStreamParser() {
  console.log('Testing streaming parser...');
  
  let buffer = mockStreamData;
  const lines = buffer.split('\n');
  
  for (const line of lines) {
    if (line.trim().startsWith('data: ')) {
      const eventData = line.trim().substring(6);
      
      if (eventData.trim() === '') continue;
      
      try {
        const event = JSON.parse(eventData);
        console.log('Parsed event:', event);
        
        if (event.type === 'delta') {
          console.log('Delta received:', event.delta);
        } else if (event.type === 'end') {
          console.log('Stream ended:', event);
        }
      } catch (parseError) {
        console.error('Failed to parse:', parseError, 'Raw data:', eventData);
      }
    }
  }
}

testStreamParser();
