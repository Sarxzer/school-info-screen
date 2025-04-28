const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors');
const PORT = 3000;

app.use(cors());
app.use(express.static('public'));
app.use('/admin', express.static('admin'));
app.use('/src/img', express.static(path.join(__dirname, 'src/img')));
app.use(express.json());

// 🧠 GET current data
app.get('/api/data', (req, res) => {
  const data = fs.readFileSync('./data/content.json');
  res.json(JSON.parse(data));
});

// 👑 POST new data from admin
app.post('/api/data', (req, res) => {
  try {
    const filePath = path.join(__dirname, 'data', 'content.json');
    console.log("Data received by the server:", req.body); // Log the received data
    fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (err) {
    console.error("FAILED TO SAVE FILE 💀:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
