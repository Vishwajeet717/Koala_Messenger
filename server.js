const express = require("express");
const fs = require("fs");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

const messagesFile = path.join(__dirname, "messages.json");

// Make sure the messages file exists
if (!fs.existsSync(messagesFile)) {
  fs.writeFileSync(messagesFile, JSON.stringify([]));
}

// Serve old messages when someone connects
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Send old messages
  const messages = JSON.parse(fs.readFileSync(messagesFile, "utf8"));
  socket.emit("loadMessages", messages);

  // Listen for new messages
  socket.on("sendMessage", (data) => {
    let messages = JSON.parse(fs.readFileSync(messagesFile, "utf8"));
    messages.push(data);

    // Keep only last 5
    if (messages.length > 5) {
      messages = messages.slice(messages.length - 5);
    }

    fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));

    // Broadcast new message to everyone
    io.emit("newMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
