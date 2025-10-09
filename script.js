let socket = io();

let message = document.getElementById("messageInput");
let sendButton = document.getElementById("send");
let chatBox = document.getElementById("chat-box");

let button1 = document.getElementById("vijupuju");
let button2 = document.getElementById("bugapuga");

let currentSender = "vijupuju";

// Button selection
button1.onclick = function() {
  currentSender = "vijupuju";
  button1.classList.add("active");
  button2.classList.remove("active");
};

button2.onclick = function() {
  currentSender = "bugapuga";
  button2.classList.add("active");
  button1.classList.remove("active");
};

// Load old messages when connected
socket.on("loadMessages", (messages) => {
  chatBox.innerHTML = "";
  messages.forEach(msg => {
    addMessage(msg);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
});

// Receive new messages live
socket.on("newMessage", (msg) => {
  addMessage(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
});

// Send message
sendButton.onclick = function() {
  let messageText = message.value.trim();
  if (messageText === "") return;

  let msg = { text: messageText, sender: currentSender };
  socket.emit("sendMessage", msg);
  message.value = "";
};

// Helper function to display message
function addMessage(msg) {
  let newMessage = document.createElement("div");
  newMessage.innerText = msg.text;

  if (msg.sender === "vijupuju") {
    newMessage.className = "chat-bubble";
  } else {
    newMessage.className = "chat-bubble2";
  }

  chatBox.appendChild(newMessage);
}
