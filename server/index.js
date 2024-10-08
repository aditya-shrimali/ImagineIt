import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import connectDB from "./mongodb/connect.js";
import postRoutes from "./routes/postRoutes.js";
import replicateRoutes from "./routes/replicateRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use("/api/v1/post", postRoutes);
app.use("/api/v1/replicate", replicateRoutes);
app.use("/api/v1/user", userRoutes);

app.get("/", async (req, res) => {
  res.send("Hello user");
});

const startServer = async () => {
  try {
    connectDB(process.env.MONGO_URI);
    app.listen(8080, () => {
      console.log("Server is running on port 8080");
    });
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
  }
};

startServer();
