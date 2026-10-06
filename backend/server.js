const express = require("express");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const port = Number(process.env.PORT || 8080);

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://taskuser:taskpass@localhost:5432/tasks",
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

async function waitForDatabase() {
  const maxAttempts = 30;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await pool.query("SELECT 1");
      console.log("Database connection established.");
      return;
    } catch (error) {
      console.log(`Database not ready (attempt ${attempt}/${maxAttempts})`);
      if (attempt === maxAttempts) throw error;
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    res.status(503).json({ status: "error", database: "unavailable" });
  }
});

app.get("/api/tasks", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, title, description, completed, created_at FROM tasks ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

app.post("/api/tasks", async (req, res) => {
  const { title, description = "" } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *",
      [title.trim(), description]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

app.patch("/api/tasks/:id", async (req, res) => {
  const { completed } = req.body;

  if (typeof completed !== "boolean") {
    return res.status(400).json({ error: "completed must be boolean" });
  }

  try {
    const result = await pool.query(
      "UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *",
      [completed, req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING id",
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

waitForDatabase()
  .then(() => {
    app.listen(port, "0.0.0.0", () => {
      console.log(`Task Manager listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Could not connect to database:", error);
    process.exit(1);
  });
