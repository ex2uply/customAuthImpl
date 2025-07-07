const express = require("express");
const jwt = require("jsonwebtoken");
const { UserModel } = require("./db");
const router = express.Router();

const JWT_SECRET = "nofuckingway";

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


router.post("/signup", async (req, res) => {
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
      // Duplicate key error 
      res.status(400).json({
        error: "Email already in use.",
      });
    } else {
      res.status(500).json({
        error: "Internal server error.",
      });
      console.log(err);
    }
  }
});

router.post("/signin", async (req, res) => {
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

router.get("/me",loggedInCheckerMiddleware ,async (req,res)=>{
   let id = req.id;

   let user = await UserModel.findById(id);
   res.send({
    email: user.email,
    name: user.name
   });
})


module.exports = router;
