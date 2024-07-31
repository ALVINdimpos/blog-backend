import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize, models } from "./models";
import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/postRoutes";
import commentRoutes from "./routes/commentRoutes";

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.get("/", (_, res) => {
  res.json({ message: "Welcome to the Blog API" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

const syncDatabase = async () => {
  try {
    await sequelize.sync(); // Removed { force: true }
    console.log("Database synchronized");

    // Create default roles if they do not exist
    const roles = await models.Role.findAll();
    if (roles.length === 0) {
      await models.Role.bulkCreate([{ name: "admin" }, { name: "user" }]);
      console.log("Default roles created");
    }
  } catch (error) {
    console.error("Unable to sync database:", error);
    throw error;
  }
};

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
    await syncDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start the server:", error);
  }
};

startServer();

export default app;
