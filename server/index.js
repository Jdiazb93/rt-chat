const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log("A user has disconnected");
  });

  socket.on("getMessage", (msg) => {
    io.emit('sendMessage', msg)
  });
});

const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("It works");
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
