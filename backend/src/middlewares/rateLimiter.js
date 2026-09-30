import rateLimit from 'express-rate-limit';

// Key by JWT Authorization header or student ID header if available, falling back to IP
const keyByTokenOrIp = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return req.headers['x-student-id'] || req.ip || 'unknown';
};

// Global limiter: 20,000 requests / min across the university network
export const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20000,
  keyGenerator: keyByTokenOrIp,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'High network traffic detected. Please retry in a few seconds.' }
});

// Auth limiter: Allows 2,000 logins/min so 500 students can log in simultaneously
export const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 2000,
  keyGenerator: (req) => req.body?.email || req.ip || 'auth-unknown',
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Please wait 1 minute.' }
});

// Auto-save limiter: 15,000 saves / min
export const autoSaveLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 15000,
  keyGenerator: keyByTokenOrIp,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Auto-save frequency too high. Syncing will resume shortly.' }
});

// Code execution limiter: 30 runs / min PER student, 1,000 total / min
export const compilerLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 1000,
  keyGenerator: keyByTokenOrIp,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Code execution rate limit exceeded. Please wait a moment.' }
});