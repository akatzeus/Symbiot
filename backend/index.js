import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth_routes.js";
// import userRoutes from "./routes/user_routes.js";
import cookieParser from "cookie-parser";
// import postRoutes from "./routes/post_routes.js";
// import notificationRoutes from "./routes/notification_routes.js";
// import connectionRoutes from "./routes/connection_routes.js";
import cors from "cors";
import axios from "axios";
import geminiRoutes from "./routes/gemini_routes.js";

const app = express();
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
dotenv.config();
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

const PORT = process.env.PORT || 5000;

const dburl = process.env.MONGO_URI;
main().then((res) => {
    console.log("connection successful to database");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dburl);
}

app.listen(PORT, (req, res) => {
    console.log(`server is running on port ${PORT}`);
});

const RPI_IP = 'http://192.168.11.124:5000';

app.get('/api/v1/disease', async (req, res) => {
  try {
    console.log(`Attempting to connect to ${RPI_IP}/disease-data`);
    
    const response = await axios.get(`${RPI_IP}/disease-data`, {
      timeout: 5000 // 5 second timeout
    });
    
    console.log('Response received:', response.data);
    
    // Validate the response data
    const { disease, confidence } = response.data;
    if (!disease || confidence === undefined) {
      return res.status(500).json({
        error: 'Invalid data received from Raspberry Pi'
      });
    }
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching from Raspberry Pi:', error.message);
    
    // Provide more specific error messages
    if (error.code === 'ECONNREFUSED') {
      return res.status(500).json({
        error: 'Could not connect to Raspberry Pi. Please check if it is powered on and connected to the network.'
      });
    }
    
    if (error.code === 'ETIMEDOUT') {
      return res.status(500).json({
        error: 'Connection to Raspberry Pi timed out. The device might be busy or unresponsive.'
      });
    }
    
    res.status(500).json({
      error: `Failed to fetch disease data: ${error.message}`
    });
  }
});

// Use consistent API versioning for all routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/gemini", geminiRoutes);
// app.use("/api/v1/users", userRoutes);
// app.use("/api/v1/posts", postRoutes);
// app.use("/api/v1/notifications", notificationRoutes);
// app.use("/api/v1/connections", connectionRoutes);