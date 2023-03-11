// import fetch from 'node-fetch'

require('dotenv').config() // Read environment variables from .env
const express = require('express')
// const fetch = require("node-fetch");
const path = require('path')
const mime = require('mime');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5163

const app = express()

// Body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Connect to the database
const db = new sqlite3.Database('artistDB.sqlite', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

// Create the artist table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS artists (
      id INTEGER PRIMARY KEY,
      name TEXT
    )
  `, (err) => {
    if (err) {
      throw err;
    }
    console.log('Artist table created');
  });

  // Query the database
  db.all('SELECT * FROM artists', [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach(row => {
      console.log(row.name);
    });
  });
});

// Define an HTTP endpoint to handle adding an artist to the database
app.post('/add-artist', (req, res) => {
  // Get the artist name from the request body
  const artistName = req.body.name;

  // Insert the artist into the database
  db.run(`
    INSERT INTO artists (name) VALUES (?)
  `, [artistName], function(err) {
    if (err) {
      console.error(err.message);
      res.status(500).send('Error adding artist to database.');
    } else {
      console.log(`New artist ${artistName} added to the database with ID ${this.lastID}`);
      res.send(`New artist ${artistName} added to the database with ID ${this.lastID}`);
    }
  });
});

app.get('/get-past-five-artists', (req, res) => {
  db.all('SELECT * FROM artists ORDER BY id DESC LIMIT 5', [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Error retrieving artists from database.');
    } else {
      res.json(rows);
    }
  });
});


app
.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: function(res, path) {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', mime.getType(path));
    }
  }
}))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')

  // Step 5
   .get('/', function(req, res) {
    const SPOTIFY_KEY_FROM_ENV = process.env.SPOTIFY_KEY;
    res.render('pages/index', { SPOTIFY_KEY_FROM_ENV })
   })

  // Step 6
  .get('/about', function(req, res) {
    res.render('pages/about')
  })

  // Step 4
  .get('/health', function(req, res) {
    res.status(200).send('Healthy')
  })
// end of implementation ///////////////////////////////////


const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`))

// close the database connection
server.on('close', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Closed the database connection');
  });
});
