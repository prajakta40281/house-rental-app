console.log("server running");
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import propertyRoutes from "./routes/property";

dotenv.config();
const app = express();

app.use(express.json());

app.use(cors({
  origin: "https://house-rental-app-iota.vercel.app",
  credentials: true
}));

app.use("/auth", authRoutes);
app.use("/property", propertyRoutes);



app.listen(3000, () => {
    console.log("Server running on port 3000");
})