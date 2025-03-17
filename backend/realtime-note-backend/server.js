require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const http = require("http");
const socketIo = require("socket.io");
const notesRoutes = require("./routes/notesRoutes");
const { setIoInstance, trackEditors } = require("./controller/notesController");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

setIoInstance(io);
// Socket.io connection handler
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Track editors for real-time presence
  trackEditors(socket);

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
