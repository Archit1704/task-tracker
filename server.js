const express = require('express');
const cors = require('cors');
const db = require('./db');
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "login.html"));
});

app.use(express.static(path.join(__dirname, "frontend")));

const SECRET = "secretkey";

// 🔐 AUTH MIDDLEWARE
function auth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) return res.status(403).send("No token");

  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).send("Invalid token");
  }
}


// 👤 SIGNUP
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, hashed],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send("User created");
    }
  );
});


// 🔑 LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {

      if (err) {
        console.error("LOGIN ERROR:", err);
        return res.status(500).send("Server error");
      }

      if (results.length === 0) {
        return res.status(404).send("User not found");
      }

      const user = results[0];

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).send("Wrong password");

      const token = jwt.sign({ id: user.id }, SECRET);

      res.json({ token });
    }
  );
});


// ➕ ADD TASK
app.post("/tasks", auth, (req, res) => {

  const { title, description } = req.body;

  if (!title || !description || !title.trim() || !description.trim()) {
    return res.status(400).json({ error: "Title and description required" });
  }

  const sql = "INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, 'pending', ?)";

  db.query(sql, [title, description, req.userId], (err, result) => {

    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: "Task added" });
  });
});


// 📥 GET TASKS (USER SPECIFIC)
app.get("/tasks", auth, (req, res) => {

  const sql = "SELECT * FROM tasks WHERE user_id = ?";

  db.query(sql, [req.userId], (err, results) => {

    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });

});


// ✏️ UPDATE STATUS
app.put("/tasks/:id", auth, (req, res) => {

  const { id } = req.params;
  const { status } = req.body;

  const sql = "UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?";

  db.query(sql, [status, id, req.userId], (err) => {

    if (err) {
      console.error("UPDATE ERROR:", err);
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: "Updated" });
  });

});


// ❌ DELETE TASK
app.delete("/tasks/:id", auth, (req, res) => {

  const { id } = req.params;

  const sql = "DELETE FROM tasks WHERE id = ? AND user_id = ?";

  db.query(sql, [id, req.userId], (err) => {

    if (err) {
      console.error("DELETE ERROR:", err);
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: "Deleted" });
  });

});


// 📊 STATS (USER SPECIFIC)
app.get("/stats", auth, (req, res) => {

  const sql = `
    SELECT status, COUNT(*) AS count
    FROM tasks
    WHERE user_id = ?
    GROUP BY status
  `;

  db.query(sql, [req.userId], (err, results) => {

    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });

});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});