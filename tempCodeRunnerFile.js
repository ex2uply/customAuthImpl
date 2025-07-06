const express = require("express");
// const jwt = require("jsonwebtoken");
// const cors  = require("cors");

// const JWT_SECRET = "fsdfaf";

// const app = express();

// const users = [];

// app.use(express.json());
// app.use(cors());

// function loggedInCheckerMiddleware(req, res, next) {
//   const token = req.headers.token;

//   if (!token) {
//     return res.status(401).send("INVALID TOKEN");
//   }
//   try {
//     const decodedInformation = jwt.verify(token, JWT_SECRET);
//     if (!decodedInformation.username) {
//       return res.status(401).send("NOT LOGGED IN");
//     } else {
//       req.username = decodedInformation.username;
//       next();
//     }
//   } catch (e) {
//     return res.status(401).send("INVALID TOKEN");
//   }
// }

// function logger(req,res,next){
//   console.log(req.method + "request came");
//   next();
// }
// app.use(logger);

// app.post("/signup", (req, res) => {
//   let username = req.body.username;
//   let password = req.body.password;

//   users.push({
//     username: username,
//     password: password,
//   });

//   res.json({
//     Status: "success",
//   });
//   console.log(users);
// });

// app.post("/signin", (req, res) => {
//   let username = req.body.username;
//   let password = req.body.password;
//   let foundUser = null;
//   foundUser = users.find(
//     (user) => user.username === username && user.password === password
//   );
//   if (foundUser) {
//     let token = jwt.sign(
//       {
//         username,
//       },
//       JWT_SECRET
//     );
//     res.json({
//       token: token,
//     });
//   } else {
//     res.json({
//       message: "INVALID CREDENTIALS"
//     })
//   }
// });

// app.use(loggedInCheckerMiddleware);

// app.get("/me", (req, res) => {
//   const username = req.username;
//   res.send({
//     username: username
//   });
// });

// app.listen(3000);