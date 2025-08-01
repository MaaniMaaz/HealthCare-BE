const rateLimitStore = new Map();

const checkRateLimit = (email, maxAttempts = 3, windowMs = 15 * 60 * 1000) => {
  const now = Date.now();
  const key = `login_${email}`;
  
  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxAttempts - 1, resetTime: now + windowMs };
  }
  
  const record = rateLimitStore.get(key);
  
  if (now > record.resetTime) {
    // Reset the window
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxAttempts - 1, resetTime: now + windowMs };
  }
  
  if (record.count >= maxAttempts) {
    return { 
      allowed: false, 
      remaining: 0, 
      resetTime: record.resetTime,
      retryAfter: Math.ceil((record.resetTime - now) / 1000)
    };
  }
  
  record.count++;
  rateLimitStore.set(key, record);
  
  return { 
    allowed: true, 
    remaining: maxAttempts - record.count, 
    resetTime: record.resetTime 
  };
};

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes

module.exports = { checkRateLimit };