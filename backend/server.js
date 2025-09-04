import express from "express";
import cors from "cors";
import "dotenv/config";

//app configuration
const app = express();
const port = process.env.PORT || 5000;

//middlewares : Whatever the info that we request get Passed through this.
app.use(express.json());
//Express.json converts any request that we send into Json format or info that we recieve in Json format
app.use(cors());
//Cors (Cross Origin Resource Sharing) : Since frontend and backend run on different ports, this is used to connect them and make then work as one

//API endpoints
app.get("/", (req, res) => {
  res.send("API Working");
});

//Start the app
app.listen(port, () => console.log("Server running on ", port));
