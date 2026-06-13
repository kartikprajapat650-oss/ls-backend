import { Router } from 'express';
import User from '../models/User';
import LoginHistory from '../models/LoginHistory';
import { comparePassword } from '../utils/password';
import { signToken } from '../utils/jwt';
import { recordActivity } from '../utils/activity';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/login', async (req, res, next) => {
  try {
    const { email, password, device, browser } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !user.active) {
      await LoginHistory.create({ email, status: 'failed', device, browser });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      await LoginHistory.create({ user: user._id, email, status: 'failed', device, browser });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken({ userId: user._id.toString() });
    await LoginHistory.create({ user: user._id, email: user.email, device, browser, status: 'success' });
    await recordActivity(user, 'login', 'auth', 'User logged in');

    res.json({ token, user: { email: user.email, name: user.name, role: user.role, permissions: user.permissions } });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const user = req.user!;
    await recordActivity(user, 'logout', 'auth', 'User logged out');
    res.json({ message: 'Logged out' });
  } catch (error) {
    next(error);
  }
});

export default router;
