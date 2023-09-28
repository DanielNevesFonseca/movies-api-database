import "dotenv/config";

import express from "express";
import { moviesRoute } from "./movies.route";
import { connectDatabase } from "./database";

const app = express();

app.use(express.json());

app.use("/movies", moviesRoute);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server initialized on port ${PORT}`);
  connectDatabase();
});
