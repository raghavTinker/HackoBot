const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");

// * DB
mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) return console.log("Connection to MongoDB failed.\n", err);
    console.log("Connected to MongoDB");
  }
);

// * Server
const port = process.env.PORT || 5000;
const server = app.listen(port, console.log(`Server started on port ${port}`));

app.get("/", (req, res) => res.send("ROOT "));

// const { validateEmail } = require("./bot/validators");
// const Participant = require("./models/participant");
// app.get("/register/:email", async (req, res) => {
//   const { value: email, error } = validateEmail(req.params.email);
//   if (error) return res.send(error.details[0].message);
//   const newParticipant = new Participant({
//     firstName: email,
//     email,
//     teamName: email,
//   });
//   await newParticipant.save();
//   res.send(newParticipant);
// });

// * Discord Bot
require("./bot/bot.js");

// * Production setup
if (process.env.NODE_ENV === "production") {
  // * Handle unhandled promise exceptions
  process.on("uncaughtException", (err, promise) => {
    console.log(`Error: ${err.message}`);
  });
  // * Handle unhandled promise rejections
  process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`);
  });
}
