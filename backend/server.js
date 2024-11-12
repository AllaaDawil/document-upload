const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Ställ in uppladdningsmappen och filnamnet
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Folder where files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Keep the original filename
  }
});

const upload = multer({ storage });

// Middleware för att tillåta CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Endpoint för att ladda upp filer
app.post('/upload', upload.single('file'), (req, res) => {
  res.send({ message: 'Fil uppladdad!', fileName: req.file.originalname });
});

// Endpoint för att söka efter filer
app.get('/search', (req, res) => {
  const query = req.query.q.toLowerCase();
  const files = fs.readdirSync('uploads');

  // Filtrera filer som matchar sökfrågan
  const results = files.filter(file => file.toLowerCase().includes(query));
  res.send(results);
});

// Endpoint för att ladda ner en specifik fil
app.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  res.download(filePath); // Skicka filen som nedladdning
});

app.get('/files', (req, res) => {
    const files = fs.readdirSync('uploads');
    const sortedFiles = files.sort((a, b) => a.localeCompare(b)); // Sort alphabetically
    res.send(sortedFiles);
  });
  

// Servern startar
app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
});
