const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Load projects safely
let projects = [];
try {
  projects = JSON.parse(fs.readFileSync('projects.json'));
} catch (err) {
  console.error('Could not read projects.json, starting with empty array.');
}

// Portfolio page
app.get('/', (req, res) => {
  res.render('index', { projects });
});

// Admin page
app.get('/admin', (req, res) => {
  res.render('admin', { projects });
});

// Upload new project (up to 4 images)
app.post('/upload', upload.array('images', 4), (req, res) => {
  try {
    const { title, description } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).send("No images uploaded");
    }

    const images = req.files.map(file => file.filename);

    projects.push({ name: title, description, images });
    fs.writeFileSync('projects.json', JSON.stringify(projects, null, 2));

    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Delete project
app.post('/delete/:index', (req, res) => {
  const index = parseInt(req.params.index);
  if (!isNaN(index) && index >= 0 && index < projects.length) {
    // Delete all image files
    projects[index].images.forEach(img => {
      const imgPath = path.join(__dirname, 'public', 'uploads', img);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    });

    // Remove project
    projects.splice(index, 1);
    fs.writeFileSync('projects.json', JSON.stringify(projects, null, 2));
  }
  res.redirect('/admin');
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
