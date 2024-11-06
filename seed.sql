-- Make new table and drop if it already exist
DROP TABLE IF EXISTS progressTrackerTasks;
CREATE TABLE progressTrackerTasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    progress INT DEFAULT 0,
    frequency VARCHAR(50) CHECK (frequency IN ('daily', 'weekly')) NOT NULL,
    due_date TIMESTAMP,
    editing BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  