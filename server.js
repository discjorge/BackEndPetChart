import app from "./app.js";
import db from "./db/client.js";
import cors from "cors";

console.log("🚀 Running server.js");

const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true
}));

async function startServer() {
  try {
    // Connect to database
    await db.connect();
    console.log('Connected to database');
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();