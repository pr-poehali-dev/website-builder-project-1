CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    preview_url TEXT,
    published BOOLEAN DEFAULT FALSE,
    published_url TEXT,
    file_content TEXT,
    file_name VARCHAR(255),
    file_size INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
