const https = require('https');
 
module.exports = function handler(req, res) {
  const { lat, lng } = req.query;
 
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=600');
 
  if (!lat || !lng) {
    return res.status(400).json({ error: 'lat and lng required' });
  }
 
  const path = `/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weathercode,windspeed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`;
 
  https.get(`https://api.open-meteo.com${path}`, (r) => {
    let body = '';
    r.on('data', chunk => body += chunk);
    r.on('end', () => {
      try {
        res.status(200).json(JSON.parse(body));
      } catch(e) {
        res.status(500).json({ error: 'Parse error', detail: e.message });
      }
    });
  }).on('error', (e) => {
    res.status(500).json({ error: e.message });
  });
};
