import { Router } from 'express';
import ContentPage from '../models/ContentPage';
import { authenticate, AuthRequest } from '../middleware/auth';
import { requirePermission } from '../middleware/authorization';
import { recordActivity } from '../utils/activity';

const router = Router();
router.use(authenticate);

router.get('/:slug', requirePermission('content-management'), async (req: AuthRequest, res, next) => {
  try {
    const { slug } = req.params;
    let page = await ContentPage.findOne({ slug });
    if (!page) {
      page = await ContentPage.create({ slug, title: slug.replace('-', ' ').toUpperCase(), body: `Edit content for ${slug}.`, updatedBy: 'system' });
    }
    res.json({ page });
  } catch (error) {
    next(error);
  }
});

router.put('/:slug', requirePermission('content-management'), async (req: AuthRequest, res, next) => {
  try {
    const { slug } = req.params;
    const { title, body } = req.body;
    if (!title || !body) {
      return res.status(400).json({ message: 'Title and body are required' });
    }
    const page = await ContentPage.findOneAndUpdate(
      { slug },
      { title, body, updatedBy: req.user?.email || 'system' },
      { new: true, upsert: true }
    );
    await recordActivity(req.user!, 'update-content', slug, `Updated ${slug} content`);
    res.json({ page });
  } catch (error) {
    next(error);
  }
});

export default router;
