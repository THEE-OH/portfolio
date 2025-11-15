const fs = require('fs');
const path = require('path');

// Root project folder (current directory)
const root = process.cwd();

// Folder structure
const folders = [
  'public',
  'public/css',
  'public/js',
  'public/uploads',
  'views',
  'views/partials'
];

// Files to create with content
const files = [
  {
    path: 'server.js',
    content: `const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
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

// Load projects
let projects = require('./projects.json');

// Admin page
app.get('/admin', (req, res) => {
  res.render('admin', { projects });
});

// Handle uploads
app.post('/upload', upload.single('image'), (req, res) => {
  const { title, description } = req.body;
  projects.push({ name: title, description, image: req.file.filename });
  fs.writeFileSync('projects.json', JSON.stringify(projects, null, 2));
  res.redirect('/admin');
});

// Portfolio page
app.get('/', (req, res) => {
  res.render('index', { projects });
});

app.listen(port, () => console.log(\`Server running at http://localhost:\${port}\`));`
  },
  {
    path: 'projects.json',
    content: `[]`
  },
  {
    path: 'views/index.ejs',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Portfolio</title>
<link rel="stylesheet" href="/css/style.css">
</head>
<body>
<h1>My Substance Painter Portfolio</h1>
<div class="portfolio-grid">
  <% projects.forEach(p => { %>
    <div class="project">
      <img src="/uploads/<%= p.image %>" alt="<%= p.name %>">
      <h3><%= p.name %></h3>
      <p><%= p.description %></p>
    </div>
  <% }) %>
</div>
</body>
</html>`
  },
  {
    path: 'views/admin.ejs',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Admin Panel</title>
<link rel="stylesheet" href="/css/style.css">
</head>
<body>
<h1>Admin Panel</h1>
<form action="/upload" method="post" enctype="multipart/form-data">
  <input type="text" name="title" placeholder="Project Title" required><br>
  <textarea name="description" placeholder="Project Description"></textarea><br>
  <input type="file" name="image" accept="image/*" required><br>
  <button type="submit">Upload Project</button>
</form>
<h2>Existing Projects</h2>
<ul>
  <% projects.forEach(p => { %>
    <li><%= p.name %> - <%= p.image %></li>
  <% }) %>
</ul>
</body>
</html>`
  },
  {
    path: 'public/css/style.css',
    content: `body { background-color: #111; color: #fff; font-family: sans-serif; text-align: center; }
.portfolio-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; padding: 20px; }
.project img { width: 100%; border-radius: 10px; }`
  },
  {
    path: 'public/js/script.js',
    content: `// Placeholder for future JS`
  }
];

// Create folders
folders.forEach(folder => {
  const dirPath = path.join(root, folder);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log('Created folder:', folder);
  }
});

// Create files
files.forEach(file => {
  const filePath = path.join(root, file.path);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, file.content);
    console.log('Created file:', file.path);
  }
});

console.log('Setup complete! Run "npm install express ejs multer body-parser" and then "node server.js" to start your portfolio.');
