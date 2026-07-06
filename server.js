const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// Resolve the project root regardless of where the process runs
const ROOT = path.resolve(__dirname);

// Serve all static files (CSS, JS, images, HTML, components)
app.use(express.static(ROOT));

// Explicit root fallback
app.get('/', (req, res) => {
  res.sendFile(path.join(ROOT, 'index.html'));
});

// Support the Credits page under both the correct and older typo-based URLs
app.get(['/credits.html', '/credits', '/credit.html', '/credit'], (req, res) => {
  res.sendFile(path.join(ROOT, 'credits.html'));
});

// Catch-all: serve any .html file by name
app.get('/:page', (req, res, next) => {
  const file = path.join(ROOT, req.params.page);
  res.sendFile(file, err => {
    if (err) next();
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`EgoTech site running at http://localhost:${PORT}`);
  });
}

module.exports = app;
