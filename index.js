require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const passport = require("passport");

const session = require("express-session");

const cors = require("cors");
require("./strategies/github");
require("./strategies/linkedin");
const app = express();
const PORT = process.env.PORT || 3030;
const MONGODB_URL = process.env.MONGODB_URL;

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/api/user", userRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose.connect(MONGODB_URL, () => console.log("Connected to DB!"));
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
