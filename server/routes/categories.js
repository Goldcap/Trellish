import { Router } from 'express';
import db from '../db.js';

const router = Router();

// GET /api/categories
router.get('/', (_req, res) => {
  const categories = db.prepare('SELECT * FROM categories ORDER BY id ASC').all();
  res.json(categories);
});

// POST /api/categories — create
router.post('/', (req, res) => {
  const { name, color } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Category name is required' });

  const existing = db.prepare('SELECT id FROM categories WHERE name = ?').get(name.trim());
  if (existing) return res.status(409).json({ error: 'Category already exists' });

  const result = db.prepare('INSERT INTO categories (name, color) VALUES (?, ?)').run(
    name.trim(),
    color || '#6b7280'
  );
  const created = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(created);
});

// PATCH /api/categories/:id — update name and/or color
router.patch('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Category not found' });

  const { name, color } = req.body;
  const updates = [];
  const params = [];

  if (name !== undefined) {
    if (!name.trim()) return res.status(400).json({ error: 'Category name cannot be empty' });
    updates.push('name = ?');
    params.push(name.trim());
  }
  if (color !== undefined) {
    updates.push('color = ?');
    params.push(color);
  }

  if (updates.length === 0) return res.json(existing);

  params.push(req.params.id);
  db.prepare(`UPDATE categories SET ${updates.join(', ')} WHERE id = ?`).run(...params);

  // If name changed, cascade rename to all tasks using the old name
  if (name !== undefined && name.trim() !== existing.name) {
    db.prepare('UPDATE tasks SET category = ? WHERE category = ?').run(name.trim(), existing.name);
  }

  const updated = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// DELETE /api/categories/:id
router.delete('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Category not found' });

  // Clear category from tasks that use it
  db.prepare("UPDATE tasks SET category = '' WHERE category = ?").run(existing.name);
  db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id);
  res.json({ message: 'Category deleted' });
});

export default router;
