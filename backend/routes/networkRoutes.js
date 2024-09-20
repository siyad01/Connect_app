import { getSuggestions, getConnections, sendConnectionRequest,unConnectUser } from '../controllers/networkControllers.js';
import { isAuth } from "../middlewares/isAuth.js";
import express from 'express'
const router = express.Router();

// Get people you may know (suggestions)
router.get('/:userId/suggestions', isAuth, getSuggestions);

// Get existing connections
router.get('/:userId/connections', isAuth, getConnections);

// Send a connection request
router.post('/:userId/connect', isAuth, sendConnectionRequest);


router.post('/unconnect', isAuth, unConnectUser);

export default router;
