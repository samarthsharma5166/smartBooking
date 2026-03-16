import express from 'express'
import {
  createSessionType,
  deleteSessionType,
  getSessionType,
  getSessionTypes,
  updateSessionType,
} from '../controllers/sessionType.controller.js';

const router = express.Router();

router.route('/').post(createSessionType).get(getSessionTypes);
router
  .route('/:id')
  .get(getSessionType)
  .patch(updateSessionType)
  .delete(deleteSessionType);

export default router;
