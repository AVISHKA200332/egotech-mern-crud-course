const express = require('express');
const path    = require('path');

const app  = express();
const PORT = 3000;

// Serve everything in the project root as static files
app.use(express.static(path.join(__dirname)));

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`EgoTech site running at http://localhost:${PORT}`);
  });
}

module.exports = app;
