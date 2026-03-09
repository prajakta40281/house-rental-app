console.log("server running");
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import propertyRoutes from "./routes/property";


const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/property", propertyRoutes);



app.listen(3000, () => {
    console.log("Server running on port 3000");
})