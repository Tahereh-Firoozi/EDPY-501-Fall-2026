CREATE TABLE IF NOT EXISTS bookings (
  slot TEXT PRIMARY KEY,
  student_name TEXT NOT NULL,
  name_key TEXT NOT NULL UNIQUE,
  submitted_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
