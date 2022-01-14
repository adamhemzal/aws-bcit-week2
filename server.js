require("dotenv").config();

const express = require("express");
const multer = require("multer");
const database = require("./database");
const fs = require("fs");
const path = require("path");

// specify where to upload your images
const upload = multer({ dest: "images/" });
const app = express();

// Serve static files from the images folder
app.use("/images", express.static("images"));

// Serve static files from the build folder where is the React app
//app.use(express.static(path.join(__dirname, "build")))

/**
 * Routes
 */
app.get("/", (req, res) => {
  res.send("It works! But for images use /api/images");
});

// GET AN IMAGE FROM THE LOCAL FOLDER ON THE SERVER
app.get("/images/:imageName", (req, res) => {
  // do a bunch of if statements to make sure the user is
  // authorized to view this image, then
  const imageName = req.params.imageName;
  const readStream = fs.createReadStream(`images/${imageName}`);
  readStream.pipe(res);
});

// GET AN IMAGE FROM THE DATABASE
app.get("/api/images", async (req, res) => {
  const images = await database.getImages();
  res.send({ images });
});

// UPLOAD IMAGE using MULTER MIDDLEWARE
app.post("/api/images", upload.single("image"), async (req, res) => {
  const imagePath = req.file.path;
  const description = req.body.description;

  const image = await database.addImage(imagePath, description);

  res.status(200).send({ image });
});

/**
 * Port
 */
const port = process.env.PORT || 4200;
app.listen(port, () => {
  console.log(`App is listening on port: ${port}`);
});
