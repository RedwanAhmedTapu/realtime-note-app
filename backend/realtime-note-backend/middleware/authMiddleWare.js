const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); 
    req.userId = decoded.id; 
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token', error: err.message });
  }
};

module.exports = verifyToken;
