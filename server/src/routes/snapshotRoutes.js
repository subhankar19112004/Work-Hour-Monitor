import express from 'express';
import  uploadSnapshot, { getSnapshots }  from '../controllers/snapshotController.js';  // Ensure the correct import
import protect from '../middlewares/auth.js';  // Keep this as a reference

const router = express.Router();

// Temporary route for testing without authentication
router.post('/upload',protect, uploadSnapshot);  // Remove the `protect` middleware for now
router.get('/', protect, getSnapshots);

export default router;
