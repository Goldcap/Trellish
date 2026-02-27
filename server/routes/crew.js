import { Router } from 'express';
import db from '../db.js';

const router = Router();

// GET /api/crew
router.get('/', (_req, res) => {
  const crew = db.prepare('SELECT * FROM crew ORDER BY id ASC').all();
  res.json(crew);
});

// PATCH /api/crew/:id
router.patch('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM crew WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Crew member not found' });

  const allowed = ['phone', 'email'];
  const updates = [];
  const params = [];

  for (const field of allowed) {
    if (req.body[field] !== undefined) {
      updates.push(`${field} = ?`);
      params.push(req.body[field]);
    }
  }

  if (updates.length === 0) return res.json(existing);

  params.push(req.params.id);
  db.prepare(`UPDATE crew SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  const updated = db.prepare('SELECT * FROM crew WHERE id = ?').get(req.params.id);
  res.json(updated);
});

export default router;
