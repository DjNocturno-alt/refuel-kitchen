exports.handler = async (event) => {
  const headers = { 'Access-Control-Allow-Origin': '*' };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: 'Method Not Allowed' };
  try {
    const data = JSON.parse(event.body);
    const url = process.env.APPS_SCRIPT_URL;
    console.log('Sending to Apps Script:', url);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      redirect: 'follow'
    });
    const text = await response.text();
    console.log('Response:', response.status, text);
    return { statusCode: 200, headers, body: 'OK' };
  } catch (err) {
    console.error('Function error:', err.message);
    return { statusCode: 500, headers, body: 'Error: ' + err.message };
  }
};
