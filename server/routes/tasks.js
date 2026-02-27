import { Router } from 'express';
import db from '../db.js';

const router = Router();

// GET /api/tasks — list with optional filters
router.get('/', (req, res) => {
  const { assigned, status, category, priority } = req.query;
  let sql = 'SELECT * FROM tasks WHERE deleted = 0';
  const params = [];

  if (assigned) { sql += ' AND assigned = ?'; params.push(assigned); }
  if (status) { sql += ' AND status = ?'; params.push(status); }
  if (category) { sql += ' AND category = ?'; params.push(category); }
  if (priority) { sql += ' AND priority = ?'; params.push(priority); }

  sql += ' ORDER BY id ASC';
  const tasks = db.prepare(sql).all(...params);
  res.json(tasks);
});

// GET /api/tasks/:id — single task with message history
router.get('/:id', (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND deleted = 0').get(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const messages = db.prepare(
    'SELECT * FROM message_log WHERE task_id = ? ORDER BY sent_at DESC'
  ).all(req.params.id);

  res.json({ ...task, messages });
});

// POST /api/tasks — create
router.post('/', (req, res) => {
  const { task, category, assigned, status, priority, notes, start_date, etd_days } = req.body;
  if (!task) return res.status(400).json({ error: 'Task name is required' });

  const result = db.prepare(`
    INSERT INTO tasks (task, category, assigned, status, priority, notes, start_date, etd_days)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    task,
    category || '',
    assigned || '',
    status || 'todo',
    priority || 'medium',
    notes || '',
    start_date || null,
    etd_days != null ? etd_days : null
  );

  const created = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(created);
});

// PATCH /api/tasks/:id — update any subset of fields
router.patch('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ? AND deleted = 0').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Task not found' });

  const allowed = ['task', 'category', 'assigned', 'status', 'priority', 'notes', 'date_started', 'date_completed', 'start_date', 'etd_days'];
  const updates = [];
  const params = [];

  for (const field of allowed) {
    if (req.body[field] !== undefined) {
      updates.push(`${field} = ?`);
      params.push(req.body[field]);
    }
  }

  // Auto-set date_started when moving to in_progress
  if (req.body.status === 'in_progress' && !existing.date_started && req.body.date_started === undefined) {
    updates.push('date_started = ?');
    params.push(new Date().toISOString());
  }

  // Auto-set date_completed when moving to done
  if (req.body.status === 'done' && !existing.date_completed && req.body.date_completed === undefined) {
    updates.push('date_completed = ?');
    params.push(new Date().toISOString());
  }

  // Clear date_completed if moving out of done
  if (req.body.status && req.body.status !== 'done' && existing.date_completed && req.body.date_completed === undefined) {
    updates.push('date_completed = NULL');
  }

  if (updates.length === 0) return res.json(existing);

  updates.push("updated_at = datetime('now')");
  params.push(req.params.id);

  db.prepare(`UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// DELETE /api/tasks/:id — soft delete
router.delete('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ? AND deleted = 0').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Task not found' });

  db.prepare("UPDATE tasks SET deleted = 1, updated_at = datetime('now') WHERE id = ?").run(req.params.id);
  res.json({ message: 'Task deleted' });
});

export default router;
