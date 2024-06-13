const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data.js");
const connectDB = require("./config/db.js");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes.js");
const chatRoutes = require("./routes/chatRoutes.js");
const cors = require("cors");

const { notFound, errorHandler } = require("./middleware/errorMiddleware.js");
dotenv.config();

connectDB();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>API is Running Successfully</h1>");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = 2000;

app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`.yellow.bold);
});
