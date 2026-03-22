exports.handler = async (event) => {
  const headers = { 'Access-Control-Allow-Origin': '*' };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: 'Method Not Allowed' };

  try {
    const d = JSON.parse(event.body);

    // Send to Airtable
    const airtableRes = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Orders`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: {
            'Name': d.name || '',
            'Phone': d.phone || '',
            'Address': d.address || '',
            'Items': d.items || '',
            'Notes': d.notes || '',
            'Total': d.total || '',
            'Method': d.method || ''
          }
        })
      }
    );

    const airtableBody = await airtableRes.text();
    console.log('Airtable response:', airtableRes.status, airtableBody);

    // Send email via Apps Script (fire and forget — don't block on it)
    fetch(process.env.APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(d)
    }).catch(e => console.log('Email notify error:', e.message));

    return { statusCode: 200, headers, body: 'OK' };
  } catch (err) {
    console.error('Function error:', err.message);
    return { statusCode: 500, headers, body: 'Error: ' + err.message };
  }
};
