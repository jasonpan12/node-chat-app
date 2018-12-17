// Add libraries
const path = require('path');
const express = require('express');

// Set up constants
const publicPath = path.join(__dirname, '../public'); // build a path that we can pass into express middleware. aviods .. popping up in path
const port = process.env.PORT || 3000;

// Set up express app
var app = express();
app.use(express.static(publicPath));
app.set('title', 'JPans Chat App');

// Define routes
app.get('/',(req, res) => {
  res.render('index');
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
