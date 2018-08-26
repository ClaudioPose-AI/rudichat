'use strict';

const express = require('express');
const path = require('path');

const app = express();

//app.set('views', './src/views' );
//app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, "dist")))

app.get('/', (req, res) => {
  res.render('index.html');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});