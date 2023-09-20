const express = require("express");
const app = express();
const dotenv = require('dotenv');
const { Pool } = require("pg");
const cors = require('cors');
const { response } = require("express");
const port = process.env.PORT || 8000;

dotenv.config();

app.use(cors({
  origin: 'http://localhost:3000',
}));


// create a postgreSQL Database connection

const db = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,

})

app.listen(port, () => console.log(`Listening on port ${port}`));

// Store and retrieve your videos from here
// If you want, you can copy "exampleresponse.json" into here to have some data to work with
let videos = [];

// GET "/"
app.get("/", (req, res) => {
  // Delete this line after you've confirmed your server is running
  res.send({ express: "Your Backend Service is Running" });
});
// Define an endpoint to fetch videos
app.get("/videos", async (request, response) => {
  try {
    const query = 'SELECt * From videos';

    const { rows } = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'An error occured' });
  }
});

// Add a new video to the database
  app.post("/videos", async (request, response) => {
    try {
      const { title, url, rating } = request.body;

      const query = 'INSERT INTO videos (title, url, rating) VALUES ($1, $2, $3)';
      await db.query(query, [title, url, rating]);

      response.status(201).json({ message: "Video added successfully" });
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: 'An error occured' });
    }
  });

  // Update an existing video by ID
  app.put("/videos/:id", async (request, response) => {
    try {
      const { title, url, rating } = request.body;
      const videoId = request.params.id;

      const query = 'UPDATE videos SET title = $1, url = $2, rating = $3 WHERE id = $4';
      await db.query(query, [title, url, rating, videoId]);

      response.status(200).json({ message: "Video updated successfully" });
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: 'An error occured' });
    }
  });

  // Delete a video by ID
  app.delete("/videos/:id", async (request, response) => {
    try {
      const videoId = request.params.id;

      const query = 'Delete FROM videos WHERE id = $1';
      await db.query(query, [videoId]);

      response.status(200).json({ message: "Video deleted successfully" });
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: 'An error occured' });
    }
  });

  // Get a video by ID
  app.get("/videos/:id", async (request, response) => {
    try {
      const videoId = request.params.id;

      const query = 'SELECT * FROM videos WHERE id = $1';
      const { rows } = await db.query(query, [videoId]);

      if (rows.length === 0) {
        response.status(404).json({ message: "Video not found" });
      } else {
        response.status(200).json(rows[0]);
      }
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: 'An error occured' });
    }
  });