import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  let token = req.header('auth-token') || req.header('Authorization');

  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7).trim();
  }

  if (!token) {
    return res.status(401).json({ msg: 'Access Denied. No token provided.' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'Ishan@123SecureKey';
    const verified = jwt.verify(token, secret);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(400).json({ msg: 'Invalid or expired token.' });
  }
};

export const optionalAuth = (req, res, next) => {
  let token = req.header('auth-token') || req.header('Authorization');
  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7).trim();
  }
  if (token) {
    try {
      const secret = process.env.JWT_SECRET || 'Ishan@123SecureKey';
      const verified = jwt.verify(token, secret);
      req.user = verified;
    } catch (e) {
      // Ignore token error in optional auth
    }
  }
  next();
};

export default authMiddleware;
