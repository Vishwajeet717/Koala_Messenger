const express = require("express");
const fs = require("fs");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// IMPORTANT for Render
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

// Serve main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "main.html"));
});

const messagesFile = path.join(__dirname, "messages.json");

if (!fs.existsSync(messagesFile)) {
  fs.writeFileSync(messagesFile, JSON.stringify([]));
}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  const messages = JSON.parse(fs.readFileSync(messagesFile, "utf8"));
  socket.emit("loadMessages", messages);

  socket.on("sendMessage", (data) => {
    let messages = JSON.parse(fs.readFileSync(messagesFile, "utf8"));
    messages.push(data);

    if (messages.length > 5) {
      messages = messages.slice(messages.length - 5);
    }

    fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));

    io.emit("newMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
