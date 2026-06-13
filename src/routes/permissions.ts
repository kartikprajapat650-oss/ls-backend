import { Router } from 'express';
import Permission from '../models/Permission';
import User from '../models/User';
import { authenticate, AuthRequest } from '../middleware/auth';
import { requirePermission } from '../middleware/authorization';
import { recordActivity } from '../utils/activity';

const router = Router();

router.use(authenticate);

router.get('/', requirePermission('permission-management'), async (req, res, next) => {
  try {
    const permissions = await Permission.find().sort({ key: 1 });
    res.json({ permissions });
  } catch (error) {
    next(error);
  }
});

router.post('/', requirePermission('permission-management'), async (req: AuthRequest, res, next) => {
  try {
    const { key, name, description } = req.body;
    if (!key || !name || !description) {
      return res.status(400).json({ message: 'Missing permission data' });
    }

    const existing = await Permission.findOne({ key });
    if (existing) {
      return res.status(409).json({ message: 'Permission key already exists' });
    }

    const permission = await Permission.create({ key, name, description, active: true });
    await recordActivity(req.user!, 'create-permission', permission._id.toString(), `Created permission ${key}`);
    res.status(201).json({ permission });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', requirePermission('permission-management'), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, active } = req.body;
    const permission = await Permission.findById(id);
    if (!permission) {
      return res.status(404).json({ message: 'Permission not found' });
    }

    if (name) permission.name = name;
    if (description) permission.description = description;
    if (typeof active === 'boolean') permission.active = active;

    await permission.save();
    await recordActivity(req.user!, 'update-permission', id, `Updated permission ${permission.key}`);
    res.json({ message: 'Permission updated' });
  } catch (error) {
    next(error);
  }
});

router.post('/assign', requirePermission('permission-management'), async (req: AuthRequest, res, next) => {
  try {
    const { userId, permissionKey } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.permissions.includes(permissionKey)) {
      user.permissions.push(permissionKey);
      await user.save();
    }

    await recordActivity(req.user!, 'assign-permission', userId, `Assigned ${permissionKey} to ${user.email}`);
    res.json({ message: 'Permission assigned', permissions: user.permissions });
  } catch (error) {
    next(error);
  }
});

router.post('/remove', requirePermission('permission-management'), async (req: AuthRequest, res, next) => {
  try {
    const { userId, permissionKey } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.permissions = user.permissions.filter((permission: string) => permission !== permissionKey);
    await user.save();
    await recordActivity(req.user!, 'remove-permission', userId, `Removed ${permissionKey} from ${user.email}`);
    res.json({ message: 'Permission removed', permissions: user.permissions });
  } catch (error) {
    next(error);
  }
});

export default router;
