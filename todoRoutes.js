const express = require("express");
const { TodoModel } = require("./db");
const router = express.Router();





router.post("/", async (req, res) => {
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

router.get("/allTodos", async (req, res) => {
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


module.exports = router;