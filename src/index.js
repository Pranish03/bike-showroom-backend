import express from "express";
import authRouter from "./routes/auth/index.js";
import mongoose from "mongoose";
import { config } from "dotenv";
import bikeRouter from "./routes/bikes/index.js";

config();

const app = express();

app.use(express.json());

app.use("/auth", authRouter);
app.use("/bike", bikeRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    if (!conn) throw new Error("Failed to connect to DB");

    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  } catch (error) {
    console.error("Failed to connect to database", err);
  }
};

connectDB();
