const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes.js");
const chatRoutes = require("./routes/chatRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");
// const cors = require("cors");

const { notFound, errorHandler } = require("./middleware/errorMiddleware.js");
dotenv.config();

connectDB();

const app = express();

// app.use(
//   cors({
//     origin: "http://127.0.0.1:3000",
//     credentials: true,
//   })
// );

app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>API is Running Successfully</h1>");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = 2000;

const server = app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`.yellow.bold);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: { origin: "https://127.0.0.1:3000" },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });

  socket.join("join chat", (room) => {
    socket.join(room);
    console.log("User joined Room:" + room);
  });

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message received", newMessageRecieved);
    });
  });

  socket.on("error", (err) => {
    console.log("Socket error: ", err);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected from socket.io");
  });
});
