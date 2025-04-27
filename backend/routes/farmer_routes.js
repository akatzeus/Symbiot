// routes/farmerRoutes.js
import express from 'express';
import farmerController from '../controllers/farmerController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateFarmerData } from '../middleware/validation.js';

const router = express.Router();

// Public routes (if you want some endpoints to be public)
router.get('/stats', farmerController.getFarmerStats);

// Protected routes
router.use(protect); // All routes below this will require authentication

// GET all farmers (with optional filtering)
router.get('/', farmerController.getFarmers);

// GET single farmer by ID
router.get('/:id', farmerController.getFarmerById);

// POST create new farmer record
router.post('/', validateFarmerData, farmerController.createFarmer);

// PUT update farmer record
router.put('/:id', validateFarmerData, farmerController.updateFarmer);

// DELETE farmer record (admin only)
router.delete('/:id', authorize('admin'), farmerController.deleteFarmer);

export default router;