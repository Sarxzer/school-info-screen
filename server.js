import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import fetch from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';
import dotenv from 'dotenv';

dotenv.config();

const proxyAgent = new HttpsProxyAgent(process.env.HTTPS_PROXY);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static('public'));
app.use('/admin', express.static('admin'));
app.use('/src/img', express.static(path.join(__dirname, 'src/img')));
app.use(express.json());


// Create a proxy agent using the HTTPS_PROXY environment variable
const proxyFetch = (url, options) => {
  return fetch(url, { ...options, agent: proxyAgent });
};

// 🧠 GET current data
app.get('/api/data', (req, res) => {
  const data = fs.readFileSync('./data/content.json');
  res.json(JSON.parse(data));
});

// 🌤️ GET weather data
app.get('/api/weather', async (req, res) => {
  try {
    const response = await proxyFetch(process.env.WEATHER_API_URL);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// 👑 POST new data from admin
app.post('/api/data', (req, res) => {
  try {
    const filePath = path.join(__dirname, 'data', 'content.json');
    console.log("Data received by the server:", req.body);
    fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (err) {
    console.error("FAILED TO SAVE FILE 💀:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => console.log(`🔥 Server SLAYING at http://localhost:${PORT}`));
