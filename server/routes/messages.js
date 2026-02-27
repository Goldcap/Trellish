import { Router } from 'express';
import db from '../db.js';
import { sendSms } from '../services/sms.js';
import { sendEmail } from '../services/email.js';

const router = Router();

// GET /api/messages — log with optional filters
router.get('/', (req, res) => {
  const { task_id, recipient, channel } = req.query;
  let sql = 'SELECT * FROM message_log WHERE 1=1';
  const params = [];

  if (task_id) { sql += ' AND task_id = ?'; params.push(task_id); }
  if (recipient) { sql += ' AND recipient = ?'; params.push(recipient); }
  if (channel) { sql += ' AND channel = ?'; params.push(channel); }

  sql += ' ORDER BY sent_at DESC';
  const messages = db.prepare(sql).all(...params);
  res.json(messages);
});

// POST /api/messages/sms
router.post('/sms', async (req, res) => {
  const { to, task_id, body } = req.body;
  if (!to || !body) return res.status(400).json({ error: 'to and body are required' });

  const recipients = getRecipients(to);
  if (recipients.length === 0) return res.status(404).json({ error: 'Recipient not found' });

  const results = [];
  for (const crew of recipients) {
    const logEntry = { task_id: task_id || null, recipient: crew.name, channel: 'sms', body };
    try {
      if (!crew.phone) throw new Error(`No phone number configured for ${crew.name}`);
      await sendSms(crew.phone, body);
      const result = db.prepare(
        'INSERT INTO message_log (task_id, recipient, channel, body, status) VALUES (?, ?, ?, ?, ?)'
      ).run(logEntry.task_id, logEntry.recipient, logEntry.channel, logEntry.body, 'sent');
      results.push({ id: result.lastInsertRowid, recipient: crew.name, status: 'sent' });
    } catch (err) {
      const result = db.prepare(
        'INSERT INTO message_log (task_id, recipient, channel, body, status, error_message) VALUES (?, ?, ?, ?, ?, ?)'
      ).run(logEntry.task_id, logEntry.recipient, logEntry.channel, logEntry.body, 'failed', err.message);
      results.push({ id: result.lastInsertRowid, recipient: crew.name, status: 'failed', error: err.message });
    }
  }
  res.json(results);
});

// POST /api/messages/email
router.post('/email', async (req, res) => {
  const { to, task_id, subject, body } = req.body;
  if (!to || !body) return res.status(400).json({ error: 'to and body are required' });

  const recipients = getRecipients(to);
  if (recipients.length === 0) return res.status(404).json({ error: 'Recipient not found' });

  const results = [];
  for (const crew of recipients) {
    const logEntry = { task_id: task_id || null, recipient: crew.name, channel: 'email', body };
    try {
      if (!crew.email) throw new Error(`No email address configured for ${crew.name}`);
      await sendEmail(crew.email, subject || '[Das Boot] Update', body);
      const result = db.prepare(
        'INSERT INTO message_log (task_id, recipient, channel, body, status) VALUES (?, ?, ?, ?, ?)'
      ).run(logEntry.task_id, logEntry.recipient, logEntry.channel, logEntry.body, 'sent');
      results.push({ id: result.lastInsertRowid, recipient: crew.name, status: 'sent' });
    } catch (err) {
      const result = db.prepare(
        'INSERT INTO message_log (task_id, recipient, channel, body, status, error_message) VALUES (?, ?, ?, ?, ?, ?)'
      ).run(logEntry.task_id, logEntry.recipient, logEntry.channel, logEntry.body, 'failed', err.message);
      results.push({ id: result.lastInsertRowid, recipient: crew.name, status: 'failed', error: err.message });
    }
  }
  res.json(results);
});

function getRecipients(to) {
  if (to === 'ALL') {
    return db.prepare('SELECT * FROM crew').all();
  }
  const member = db.prepare('SELECT * FROM crew WHERE name = ?').get(to);
  return member ? [member] : [];
}

export default router;
