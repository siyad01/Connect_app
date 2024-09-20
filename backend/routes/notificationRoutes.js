import express from 'express';
import { getNotifications, acceptConnectionRequest, declineConnectionRequest, viewMessage } from '../controllers/notificationControllers.js'; // Adjust the import path as needed
import { isAuth } from '../middlewares/isAuth.js'; // Ensure you have authentication middleware

const router = express.Router();

// Get notifications
router.get('/:userId', isAuth, getNotifications);

// Accept connection request
router.post('/:userId/accept/:requestId', isAuth, acceptConnectionRequest);

// Decline connection request
router.post('/:userId/decline/:requestId', isAuth, declineConnectionRequest);

router.post('/:userId/view/:messageId', isAuth, viewMessage);

export default router;
