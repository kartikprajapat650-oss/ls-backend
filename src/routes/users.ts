import { Router } from 'express';
import User from '../models/User';
import { authenticate, AuthRequest } from '../middleware/auth';
import { requirePermission } from '../middleware/authorization';
import { hashPassword } from '../utils/password';
import { recordActivity } from '../utils/activity';

const router = Router();

router.use(authenticate);

router.get('/', requirePermission('user-management'), async (req: AuthRequest, res, next) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    next(error);
  }
});

router.post('/', requirePermission('user-management'), async (req: AuthRequest, res, next) => {
  try {
    const { email, name, password, role } = req.body;
    if (!email || !name || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({ email, name, role, passwordHash, permissions: [] });
    await recordActivity(req.user!, 'create-user', user._id.toString(), `Created user ${email}`);
    res.status(201).json({ user: { email: user.email, name: user.name, role: user.role, active: user.active } });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', requirePermission('user-management'), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { name, role, active, permissions } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (role) user.role = role;
    if (typeof active === 'boolean') user.active = active;
    if (Array.isArray(permissions)) user.permissions = permissions;

    await user.save();
    await recordActivity(req.user!, 'update-user', id, `Updated user ${user.email}`);
    res.json({ message: 'User updated' });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/reset-password', requirePermission('user-management'), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: 'New password is required' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.passwordHash = await hashPassword(password);
    await user.save();
    await recordActivity(req.user!, 'reset-password', id, `Reset password for ${user.email}`);
    res.json({ message: 'Password reset' });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requirePermission('user-management'), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await recordActivity(req.user!, 'delete-user', id, `Deleted user ${user.email}`);
    res.json({ message: 'User deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
