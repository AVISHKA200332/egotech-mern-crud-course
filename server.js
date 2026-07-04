const express = require('express');
const path    = require('path');

const app  = express();
const PORT = 3000;

// Serve everything in the project root as static files
app.use(express.static(path.join(__dirname)));

// Explicit root route fallback for Vercel
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`EgoTech site running at http://localhost:${PORT}`);
  });
}

module.exports = app;
