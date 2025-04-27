// middleware/validation.js
import { body, validationResult } from 'express-validator';

// Validate farmer data
export const validateFarmerData = [
  // General Information validation
  body('farmerName').trim().notEmpty().withMessage('Farmer name is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('contactNumber').trim().notEmpty().withMessage('Contact number is required'),
  body('email').optional().isEmail().withMessage('Please provide a valid email address'),
  
  // Land Details validation
  body('totalLandSize').isNumeric().withMessage('Land size must be a number'),
  body('landSizeUnit').isIn(['acres', 'hectares', 'sqm']).withMessage('Invalid land size unit'),
  body('soilType').notEmpty().withMessage('Soil type is required'),
  body('irrigationSource').notEmpty().withMessage('Irrigation source is required'),
  
  // Crop Information validation
  body('primaryCrops').isArray().withMessage('Primary crops must be an array'),
  body('primaryCrops.*.cropName').notEmpty().withMessage('Crop name is required'),
  body('primaryCrops.*.areaAllocated').isNumeric().withMessage('Area allocated must be a number'),
  
  // Historical Data validation
  body('previousYieldData.*.cropName').optional().notEmpty().withMessage('Crop name is required for yield data'),
  body('previousYieldData.*.year').optional().isNumeric().withMessage('Year must be a number'),
  body('previousYieldData.*.yield').optional().isNumeric().withMessage('Yield must be a number'),
  
  // Financial Information validation
  body('annualInvestment').optional().isNumeric().withMessage('Annual investment must be a number'),
  body('irrigationCost').optional().isNumeric().withMessage('Irrigation cost must be a number'),
  body('fertilizerCost').optional().isNumeric().withMessage('Fertilizer cost must be a number'),
  body('pesticideCost').optional().isNumeric().withMessage('Pesticide cost must be a number'),
  body('laborCost').optional().isNumeric().withMessage('Labor cost must be a number'),
  body('expectedRoi').optional().isNumeric().withMessage('Expected ROI must be a number'),
  
  // Check for validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: errors.array()
      });
    }
    next();
  }
];

export default {
  validateFarmerData
};