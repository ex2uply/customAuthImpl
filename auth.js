const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const mongoose = require("mongoose");
const { UserModel, TodoModel } = require("./db");

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
  console.log(req.method + "request came");
  next();
}
app.use(logger);

app.post("/signup", async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let name = req.body.name;

  try {
    await UserModel.create({
      email: email,
      password: password,
      name: name,
    });
    res.json({
      message: "You're signed up.",
    });
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error (email already exists)
      res.status(400).json({
        error: "Email already in use.",
      });
    } else {
      res.status(500).json({
        error: "Internal server error.",
      });
    }
  }
});

app.post("/signin", async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  const user = await UserModel.findOne({
    email: email,
    password: password,
  });

  console.log(user);

  if (user) {
    let token = jwt.sign(
      {
        id: user._id,
      },
      JWT_SECRET
    );
    res.json({
      token: token,
    });
  } else {
    res.status(403).json({
      message: "INVALID CREDENTIALS",
    });
  }
});

app.use(loggedInCheckerMiddleware);

app.get("/me", async (req,res)=>{
   let id = req.id;

   let user = await UserModel.findById(id);
   res.send({
    email: user.email,
    name: user.name
   });
})

app.post("/todo", async (req, res) => {
  let title = req.body.title;
  let done = req.body.done;
  let id = req.id;

  await TodoModel.create({
    title: title,
    done: done,
    userId: id,
  });

  res.send({
    message: "Saved",
  });
});

app.get("/todos", async (req, res) => {
  let id = req.id;
  try {
    const todos = await TodoModel.find({
      userId: id,
    });
    res.json(todos);
  } catch (e) {
    res.status(500).json({
      error: e,
    });
  }
});
app.listen(3000);


