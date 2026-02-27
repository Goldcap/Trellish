import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DB_PATH || path.join(__dirname, 'data', 'dasboot.db');

const db = new Database(dbPath);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    color TEXT NOT NULL DEFAULT '#6b7280'
  );

  CREATE TABLE IF NOT EXISTS crew (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    phone TEXT DEFAULT '',
    email TEXT DEFAULT '',
    role TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT '',
    assigned TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'todo',
    priority TEXT NOT NULL DEFAULT 'medium',
    date_started TEXT,
    date_completed TEXT,
    notes TEXT DEFAULT '',
    start_date TEXT,
    etd_days INTEGER,
    deleted INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS message_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER REFERENCES tasks(id),
    recipient TEXT NOT NULL,
    channel TEXT NOT NULL,
    body TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'sent',
    error_message TEXT,
    sent_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
  CREATE INDEX IF NOT EXISTS idx_tasks_assigned ON tasks(assigned);
  CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category);
  CREATE INDEX IF NOT EXISTS idx_tasks_deleted ON tasks(deleted);
  CREATE INDEX IF NOT EXISTS idx_message_log_task_id ON message_log(task_id);
  CREATE INDEX IF NOT EXISTS idx_message_log_recipient ON message_log(recipient);
`);

// Migrations for existing databases
const cols = db.prepare("PRAGMA table_info(tasks)").all().map(c => c.name);
if (!cols.includes('start_date')) {
  db.exec("ALTER TABLE tasks ADD COLUMN start_date TEXT");
}
if (!cols.includes('etd_days')) {
  db.exec("ALTER TABLE tasks ADD COLUMN etd_days INTEGER");
}

export default db;
