import { Router } from 'express';
import { coverLetterController as controller } from '../../config/container';
import { requireAuth, requireRole } from '../../middleware/auth.middleware';

const router = Router();

// All routes require user to be logged in as candidate
router.use(requireAuth, requireRole('candidate'));

router.post('/', controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.patch('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
