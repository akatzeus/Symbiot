// models/Farmer.js
import mongoose from "mongoose";

const primaryCropSchema = new mongoose.Schema({
  cropName: { type: String, required: true },
  varietyName: String,
  areaAllocated: { type: Number, required: true },
  harvestFrequency: { type: String, default: 'annual' }
});

const yieldDataSchema = new mongoose.Schema({
  cropName: { type: String, required: true },
  year: { type: Number, required: true },
  yield: { type: Number, required: true },
  yieldUnit: { type: String, default: 'tons' }
});

const farmerSchema = new mongoose.Schema({
  // General Information
  farmerName: { type: String, required: true },
  farmName: String,
  location: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String, match: /^\S+@\S+\.\S+$/ },
  
  // Land Details
  totalLandSize: { type: Number, required: true },
  landSizeUnit: { type: String, default: 'acres', enum: ['acres', 'hectares', 'sqm'] },
  soilType: { type: String, required: true },
  landTopography: String,
  irrigationSource: { type: String, required: true },
  irrigationSystem: String,
  
  // Crop Information
  primaryCrops: [primaryCropSchema],
  cropRotation: { type: Boolean, default: false },
  
  // Historical Data
  previousYieldData: [yieldDataSchema],
  commonDiseases: String,
  pestIssues: String,
  
  // Climate Conditions
  averageRainfall: Number,
  temperatureRange: {
    min: Number,
    max: Number
  },
  humidityLevels: {
    min: Number,
    max: Number
  },
  majorWeatherIssues: [String],
  
  // Financial Information
  annualInvestment: Number,
  irrigationCost: Number,
  fertilizerCost: Number,
  pesticideCost: Number,
  laborCost: Number,
  expectedRoi: Number,
  
  // Technology Access
  internetAccess: { type: Boolean, default: false },
  smartphoneAccess: { type: Boolean, default: false },
  farmingEquipment: [String],
  existingTechSolutions: String,
  
  // Specific Requirements
  moistureMonitoringPriority: { type: String, default: 'medium' },
  diseaseDetectionPriority: { type: String, default: 'medium' },
  pestMonitoringPriority: { type: String, default: 'medium' },
  nutrientDeficiencyPriority: { type: String, default: 'medium' },
  otherRequirements: String,
  
  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the 'updatedAt' field on save
farmerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Farmer = mongoose.model('Farmer', farmerSchema);

export default Farmer;