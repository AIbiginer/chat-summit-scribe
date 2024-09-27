import { verifyToken } from '../utils/auth';

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: '認証トークンがありません' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: '無効なトークンです' });
  }

  req.userId = decoded.id;
  next();
};

export default authMiddleware;