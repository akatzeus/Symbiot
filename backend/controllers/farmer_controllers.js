// controllers/farmerController.js
import Farmer from '../models/farmer.js';

// Create a new farmer record
export const createFarmer = async (req, res) => {
  try {
    const farmerData = req.body;
    
    // Create a new farmer document
    const farmer = new Farmer(farmerData);
    
    // Save the farmer data
    const savedFarmer = await farmer.save();
    
    res.status(201).json({
      success: true,
      data: savedFarmer,
      message: 'Farmer data collected successfully'
    });
  } catch (error) {
    console.error('Error creating farmer record:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: validationErrors
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to save farmer data'
    });
  }
};

// Get all farmers (with optional filtering)
export const getFarmers = async (req, res) => {
  try {
    // Basic query object
    const query = {};
    
    // Apply filters if provided
    if (req.query.location) {
      query.location = { $regex: req.query.location, $options: 'i' };
    }
    
    if (req.query.soilType) {
      query.soilType = req.query.soilType;
    }
    
    if (req.query.crop) {
      query['primaryCrops.cropName'] = { $regex: req.query.crop, $options: 'i' };
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    
    // Execute query with pagination
    const farmers = await Farmer.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    // Get total count for pagination
    const total = await Farmer.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: farmers.length,
      total: total,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit)
      },
      data: farmers
    });
  } catch (error) {
    console.error('Error fetching farmers:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to retrieve farmer data'
    });
  }
};

// Get a single farmer by ID
export const getFarmerById = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    
    if (!farmer) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Farmer not found with the provided ID'
      });
    }
    
    res.status(200).json({
      success: true,
      data: farmer
    });
  } catch (error) {
    console.error('Error fetching farmer by ID:', error);
    
    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID',
        message: 'The provided ID is not valid'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to retrieve farmer data'
    });
  }
};

// Update a farmer record
export const updateFarmer = async (req, res) => {
  try {
    const updatedFarmer = await Farmer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedFarmer) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Farmer not found with the provided ID'
      });
    }
    
    res.status(200).json({
      success: true,
      data: updatedFarmer,
      message: 'Farmer data updated successfully'
    });
  } catch (error) {
    console.error('Error updating farmer:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: validationErrors
      });
    }
    
    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID',
        message: 'The provided ID is not valid'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to update farmer data'
    });
  }
};

// Delete a farmer record
export const deleteFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findByIdAndDelete(req.params.id);
    
    if (!farmer) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Farmer not found with the provided ID'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Farmer data deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting farmer:', error);
    
    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID',
        message: 'The provided ID is not valid'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to delete farmer data'
    });
  }
};

// Get statistical summaries
export const getFarmerStats = async (req, res) => {
  try {
    // Common crops distribution
    const cropDistribution = await Farmer.aggregate([
      { $unwind: '$primaryCrops' },
      { $group: {
          _id: '$primaryCrops.cropName',
          count: { $sum: 1 },
          totalArea: { $sum: '$primaryCrops.areaAllocated' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    // Soil type distribution
    const soilTypeDistribution = await Farmer.aggregate([
      { $group: {
          _id: '$soilType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    // Average farm size
    const averageFarmSize = await Farmer.aggregate([
      { $group: {
          _id: null,
          avgSize: { $avg: '$totalLandSize' }
        }
      }
    ]);
    
    // Common weather issues
    const weatherIssues = await Farmer.aggregate([
      { $unwind: '$majorWeatherIssues' },
      { $group: {
          _id: '$majorWeatherIssues',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        cropDistribution,
        soilTypeDistribution,
        averageFarmSize: averageFarmSize.length > 0 ? averageFarmSize[0].avgSize : 0,
        weatherIssues
      }
    });
  } catch (error) {
    console.error('Error generating farmer statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: 'Failed to generate statistical data'
    });
  }
};

export default {
  createFarmer,
  getFarmers,
  getFarmerById,
  updateFarmer,
  deleteFarmer,
  getFarmerStats
};