CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT DEFAULT '',
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO tasks (title, description)
SELECT 'Learn Docker', 'Build and run the application container'
WHERE NOT EXISTS (SELECT 1 FROM tasks);

INSERT INTO tasks (title, description)
SELECT 'Deploy with Kubernetes', 'Deploy the application and PostgreSQL using Helm'
WHERE NOT EXISTS (SELECT 1 FROM tasks WHERE title = 'Deploy with Kubernetes');
