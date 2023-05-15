const path = require("path");
require("dotenv-safe").config({
  path: path.join(__dirname, "./.env"),
  // example: path.join(__dirname, '../../.env.example'),
});

const express = require("express");
const mongoose = require("mongoose");

// Create the Express app
const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
  });

// Define a schema for the data
const payloadSchema = new mongoose.Schema(
  {
    // Define the fields for your payload here
    payload: {
      type: Object,
    },
    // ...
  },
  {
    timestamps: { currentTime: () => Date.now() },
    strict: false,
  }
);

// Create a model based on the schema
const Payload = mongoose.model("Payload", payloadSchema);

// Configure middleware to parse JSON bodies
app.use(express.json());

// Define the POST endpoint for /callback
app.post("/callback", (req, res) => {
  // Extract the payload from the request body
  const payload = req.body;
  console.log("Received Callback", payload);

  // Create a new instance of the Payload model with the extracted data
  const newPayload = new Payload(payload);

  // Save the payload to MongoDB
  newPayload
    .save()
    .then(() => {
      console.log("Payload saved to MongoDB");
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error("Failed to save payload to MongoDB", error);
      res.sendStatus(500);
    });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
