const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// app.get("/", (req, res) => {
//     res.send("server is running");
// });


// post part that insert the data 

app.post("/tasks", (req, res) => {

  const { title, description } = req.body;

  const sql = "INSERT INTO tasks (title, description) VALUES (?, ?)";

  db.query(sql, [title, description], (err, result) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database insert failed" });
    }

    res.json({
      message: "Task added successfully",
      taskId: result.insertId
    });

  });

});

// get response part that'll seen in browser

app.get("/tasks", (req, res) => {

  const sql = "SELECT * FROM tasks";

  db.query(sql, (err, results) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database fetch failed" });
    }

    res.json(results);

  });

});

// PUT part where data is updated..

app.put("/tasks/:id", (req, res) => {

  const { id } = req.params;
  const { status } = req.body;

  const sql = "UPDATE tasks SET status = ? WHERE id = ?";

  db.query(sql, [status, id], (err, result) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database update failed" });
    }

    res.json({
      message: "Task status updated"
    });

  });

});

// status count for pie chart...

app.get("/stats", (req, res) => {

  const sql = `
    SELECT status, COUNT(*) AS count
    FROM tasks
    GROUP BY status
  `;

  db.query(sql, (err, results) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Stats query failed" });
    }

    res.json(results);

  });

});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});