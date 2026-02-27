import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { authMiddleware, loginHandler } from './auth.js';
import tasksRouter from './routes/tasks.js';
import crewRouter from './routes/crew.js';
import messagesRouter from './routes/messages.js';
import categoriesRouter from './routes/categories.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(morgan('short'));
app.use(express.json());

// Auth
app.use(authMiddleware);

// API routes
app.post('/api/auth/login', loginHandler);
app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
app.use('/api/tasks', tasksRouter);
app.use('/api/crew', crewRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/categories', categoriesRouter);

// Serve static client in production
const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));
app.get('*', (_req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Das Boot PMS running on port ${PORT}`);
});
