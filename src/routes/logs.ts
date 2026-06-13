import { Router } from 'express';
import LoginHistory from '../models/LoginHistory';
import ActivityLog from '../models/ActivityLog';
import { authenticate } from '../middleware/auth';
import { requirePermission } from '../middleware/authorization';

const router = Router();
router.use(authenticate);

router.get('/login-history', requirePermission('login-history'), async (req, res, next) => {
  try {
    const { page = 1, limit = 20, email, status } = req.query;
    const query: any = {};
    if (email) query.email = String(email);
    if (status) query.status = String(status);

    const histories = await LoginHistory.find(query)
      .sort({ loginAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await LoginHistory.countDocuments(query);
    res.json({ histories, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    next(error);
  }
});

router.get('/activity', requirePermission('activity-logs'), async (req, res, next) => {
  try {
    const { page = 1, limit = 20, action, email } = req.query;
    const query: any = {};
    if (action) query.action = String(action);
    if (email) query.email = String(email);

    const activities = await ActivityLog.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await ActivityLog.countDocuments(query);
    res.json({ activities, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    next(error);
  }
});

export default router;
