// DEPENDENCIES
////////////////////////////////
require("dotenv").config();

const { PORT = 3000, MONGODB_URL } = process.env;
// import express
const express = require("express");
// create application object
const app = express();
const cors = require("cors");
const morgan = require("morgan");

const mongoose = require("mongoose")


//Database

// Establish Connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
mongoose.connection
.on("open", () => console.log("Connected to Mongo"))
.on("close", () => console.log("Disconnected from Mongo"))
.on("error", (error) => console.log(error))

//Models
const BookmarksSchema = new mongoose.Schema({
  title: String,
  url: String,

}) 

const Bookmarks = mongoose.model("Bookmarks", BookmarksSchema)


//Midleware
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
///////////////////////////////

// ROUTES
////////////////////////////////
// create a test route
app.get("/", (req, res) => {
  res.send("hello world");
});


// INDEX ROUTE
app.get("/bookmarks", async (req, res) => {
  try {

    res.json(await Bookmarks.find({}));
  } catch (error) {
    res.status(400).json({error});
  }
});

//  CREATE ROUTE
app.post("/bookmarks", async (req, res) => {
  try {

    res.json(await Bookmarks.create(req.body));
  } catch (error) {
    //send error
    res.status(400).json({error});
  }
});

// Update route 

app.put("/bookmarks/:id", async (req, res) => {
  try {
      res.json(
          await Bookmarks.findByIdAndUpdate(req.params.id, req.body, {new: true})
      )
  } catch (error){
      res.status(400).json({error})
  }
})

// Delete route
app.delete("/bookmarks/:id", async (req, res) => {
    try {
      res.json(await Bookmarks.findByIdAndRemove(req.params.id));
    } catch (error) {
      res.status(400).json({ error });
    }
  });

///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));