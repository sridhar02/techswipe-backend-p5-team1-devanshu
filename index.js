require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const morgan = require('morgan');

const MongoDBStore = require('connect-mongodb-session')(session);

const cors = require("cors");

require("./strategies/github");``
require("./strategies/linkedin");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");

const app = express();

app.use(morgan('combined'))

const PORT = process.env.PORT || 3030;
const MONGODB_URL = process.env.MONGODB_URL;

const store = new MongoDBStore({
  uri: MONGODB_URL,
  collection: 'sessions'
});

app.use((req, res, next) => {
  // logger(req, res);
  next();
})

app.use(
  session({
    secret: "your-secret-key",
    resave: true,
    store,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // 1 week
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/api/user", userRoutes);


app.get('/hello', function (req, res) {
  res.json({ message: 'Hello World', session: req.session.passport?.user });
})




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
