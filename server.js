const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

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
  fs.writeFileSync('./data/content.json', JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

app.post('/update-content', (req, res) => {
  const updatedData = req.body;

  // Write the updated data to content.json
  fs.writeFile('./data/content.json', JSON.stringify(updatedData, null, 2), (err) => {
      if (err) {
          console.error('Error writing to file:', err);
          return res.status(500).send('Failed to save data.');
      }
      res.send('Data saved successfully!');
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
