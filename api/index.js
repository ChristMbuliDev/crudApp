import express from "express";
import dotenv from "dotenv";
import userRoutes from "../routes/user.route.js";
import connectDB from "../config/database.js";

dotenv.config();

const app = express();

// Connexion Mongo
connectDB();

app.use(express.json());
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});


if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

// IMPORTANT : export pour serverless
export default app;
