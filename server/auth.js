import { randomUUID } from 'crypto';

// In-memory token store (survives for the lifetime of the process)
const tokens = new Set();

/**
 * POST /api/auth/login
 * Body: { password: "..." }
 * Returns: { token: "..." }
 */
export function loginHandler(req, res) {
  const appPassword = process.env.APP_PASSWORD;

  // If no password configured, auth is disabled
  if (!appPassword) {
    const token = randomUUID();
    tokens.add(token);
    return res.json({ token });
  }

  const { password } = req.body || {};
  if (!password || password !== appPassword) {
    return res.status(401).json({ error: 'Invalid passphrase' });
  }

  const token = randomUUID();
  tokens.add(token);
  res.json({ token });
}

/**
 * Middleware: checks Bearer token on all /api/* routes except /api/auth/login and /api/health
 */
export function authMiddleware(req, res, next) {
  // Skip auth if no password configured
  if (!process.env.APP_PASSWORD) return next();

  // Only protect /api/* routes (let static files through)
  if (!req.path.startsWith('/api/')) return next();

  // Public API routes
  if (req.path === '/api/auth/login' || req.path === '/api/health') return next();

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.slice(7);
  if (!tokens.has(token)) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  next();
}
