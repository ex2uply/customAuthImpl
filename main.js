const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./authRoutes");
const todoRoutes = require("./todoRoutes");

const JWT_SECRET = "nofuckingway";

const app = express();

mongoose.connect(
  "mongodb+srv://adityakumarso2003:12345678910@cluster0.ngahshr.mongodb.net/todo-app-db"
);

app.use(express.json());
app.use(cors());

function loggedInCheckerMiddleware(req, res, next) {
  const token = req.headers.token;

  if (!token) {
    return res.status(401).send("INVALID TOKEN");
  }
  try {
    const decodedInformation = jwt.verify(token, JWT_SECRET);
    if (!decodedInformation.id) {
      return res.status(403).send("NOT LOGGED IN");
    } else {
      req.id = decodedInformation.id;
      next();
    }
  } catch (e) {
    return res.status(401).send("INVALID TOKEN");
  }
}

function logger(req, res, next) {
  console.log(req.method + " request came");
  next();
}

app.use(logger);

app.use("/auth",authRoutes);

app.use("/todo", loggedInCheckerMiddleware,todoRoutes);

app.listen(3000);


