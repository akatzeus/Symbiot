import { useState } from 'react';
import { ChevronRight, ChevronDown, Crop, CloudRain, Bug, Thermometer, DollarSign, BarChart3, Check } from 'lucide-react';
import Navbar from '../components/Navbar';

// Mock function for submitting data - replace with actual API call
const submitFarmerData = async (data) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Submitting data:", data);
      resolve({ success: true });
    }, 1500);
  });
};

export default function FarmerDataCollectionForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [expandedSection, setExpandedSection] = useState('general');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  
  const [formData, setFormData] = useState({
    // General Information
    farmerName: '',
    farmName: '',
    location: '',
    contactNumber: '',
    email: '',
    
    // Land Details
    totalLandSize: '',
    landSizeUnit: 'acres',
    soilType: '',
    landTopography: '',
    irrigationSource: '',
    irrigationSystem: '',
    
    // Crop Information
    primaryCrops: [{ cropName: '', varietyName: '', areaAllocated: '', harvestFrequency: 'annual' }],
    cropRotation: false,
    
    // Historical Data
    previousYieldData: [{ cropName: '', year: '', yield: '', yieldUnit: 'tons' }],
    commonDiseases: '',
    pestIssues: '',
    
    // Climate Conditions
    averageRainfall: '',
    temperatureRange: { min: '', max: '' },
    humidityLevels: { min: '', max: '' },
    majorWeatherIssues: [],
    
    // Financial Information
    annualInvestment: '',
    irrigationCost: '',
    fertilizerCost: '',
    pesticideCost: '',
    laborCost: '',
    expectedRoi: '',
    
    // Technology Access
    internetAccess: false,
    smartphoneAccess: false,
    farmingEquipment: [],
    existingTechSolutions: '',
    
    // Specific Requirements
    moistureMonitoringPriority: 'medium',
    diseaseDetectionPriority: 'medium',
    pestMonitoringPriority: 'medium',
    nutrientDeficiencyPriority: 'medium',
    otherRequirements: '',
  });
  
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? '' : section);
  };
  
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
    // Clear error when field is updated
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  const handleNestedInputChange = (parent, child, value) => {
    setFormData({
      ...formData,
      [parent]: {
        ...formData[parent],
        [child]: value
      }
    });
  };
  
  const handleArrayInputChange = (field, index, subfield, value) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = {
      ...updatedArray[index],
      [subfield]: value
    };
    
    setFormData({
      ...formData,
      [field]: updatedArray
    });
  };
  
  const addArrayItem = (field, template) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], template]
    });
  };
  
  const removeArrayItem = (field, index) => {
    const updatedArray = [...formData[field]];
    updatedArray.splice(index, 1);
    
    setFormData({
      ...formData,
      [field]: updatedArray
    });
  };
  
  const toggleArrayItem = (field, item) => {
    const currentArray = [...formData[field]];
    const itemIndex = currentArray.indexOf(item);
    
    if (itemIndex === -1) {
      currentArray.push(item);
    } else {
      currentArray.splice(itemIndex, 1);
    }
    
    setFormData({
      ...formData,
      [field]: currentArray
    });
  };

  const validateForm = () => {
    const errors = {};
    
    // Required fields validation
    if (!formData.farmerName.trim()) errors.farmerName = 'Farmer name is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.contactNumber.trim()) errors.contactNumber = 'Contact number is required';
    if (!formData.totalLandSize) errors.totalLandSize = 'Total land size is required';
    if (!formData.soilType) errors.soilType = 'Soil type is required';
    if (!formData.irrigationSource) errors.irrigationSource = 'Irrigation source is required';
    
    // Email validation if provided
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Please provide a valid email address';
    }
    
    // Crop validation
    if (formData.primaryCrops.length === 0) {
      errors.primaryCrops = 'At least one crop is required';
    } else {
      formData.primaryCrops.forEach((crop, index) => {
        if (!crop.cropName.trim()) {
          errors[`primaryCrops_${index}_cropName`] = 'Crop name is required';
        }
        if (!crop.areaAllocated) {
          errors[`primaryCrops_${index}_areaAllocated`] = 'Area allocated is required';
        }
      });
    }
    
    return errors;
  };
  
  const nextStep = () => {
    // Validate only the current step's required fields
    const errors = {};
    
    if (currentStep === 1) {
      // Step 1 validation
      if (!formData.farmerName.trim()) errors.farmerName = 'Farmer name is required';
      if (!formData.location.trim()) errors.location = 'Location is required';
      if (!formData.contactNumber.trim()) errors.contactNumber = 'Contact number is required';
      if (!formData.totalLandSize) errors.totalLandSize = 'Total land size is required';
      if (!formData.soilType) errors.soilType = 'Soil type is required';
      if (!formData.irrigationSource) errors.irrigationSource = 'Irrigation source is required';
      
      // Email validation if provided
      if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
        errors.email = 'Please provide a valid email address';
      }
    } else if (currentStep === 2) {
      // Step 2 validation
      if (formData.primaryCrops.length === 0) {
        errors.primaryCrops = 'At least one crop is required';
      } else {
        formData.primaryCrops.forEach((crop, index) => {
          if (!crop.cropName.trim()) {
            errors[`primaryCrops_${index}_cropName`] = 'Crop name is required';
          }
          if (!crop.areaAllocated) {
            errors[`primaryCrops_${index}_areaAllocated`] = 'Area allocated is required';
          }
        });
      }
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      // Scroll to the first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setCurrentStep(currentStep + 1);
    setFormErrors({}); // Clear errors when validation passes
  };
  
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    setFormErrors({}); // Clear errors when going back
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Final validation
      const errors = validateForm();
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        throw new Error('Please fix the form errors before submitting.');
      }
      
      const response = await submitFarmerData(formData);
      console.log("Form data submitted successfully:", response);
      setFormSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(error.message || 'Failed to submit data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Equipment options for checkbox selection
  const equipmentOptions = [
    'Tractor', 'Harvester', 'Plough', 'Seeder', 'Sprinkler System', 
    'Drip Irrigation', 'Drone', 'Sensors', 'Weather Station'
  ];
  
  // Weather issue options
  const weatherIssueOptions = [
    'Drought', 'Flooding', 'Hail', 'Frost', 'Extreme Heat', 
    'Strong Winds', 'Unseasonable Rain', 'Erratic Weather Patterns'
  ];
  
  // Render different form steps
  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="bg-green-50 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-medium text-green-800 mb-2">Farmer Data Collection</h2>
              <p className="text-green-700 mb-4">
                This form collects information about your farm to help optimize agricultural practices and provide tailored recommendations.
              </p>
              <p className="text-green-700">
                Fields marked with * are required. Your data will be securely stored and used for analysis and recommendations.
              </p>
            </div>
            <h2 className="text-xl font-bold mb-6">Basic Information</h2>
            
            {/* General Information Section */}
            <div className="mb-6">
              <button 
                type="button"
                className="w-full flex items-center justify-between bg-green-50 p-4 rounded-lg mb-4"
                onClick={() => toggleSection('general')}
              >
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <Crop className="text-green-600" size={20} />
                  </div>
                  <span className="font-medium">General Information</span>
                </div>
                {expandedSection === 'general' ? <ChevronDown /> : <ChevronRight />}
              </button>
              
              {expandedSection === 'general' && (
                <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Farmer Name*</label>
                      <input 
                        type="text" 
                        name="farmerName"
                        className={`w-full p-2 border ${formErrors.farmerName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        value={formData.farmerName}
                        onChange={(e) => handleInputChange('farmerName', e.target.value)}
                        required
                      />
                      {formErrors.farmerName && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.farmerName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Farm Name</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={formData.farmName}
                        onChange={(e) => handleInputChange('farmName', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location*</label>
                      <input 
                        type="text" 
                        name="location"
                        className={`w-full p-2 border ${formErrors.location ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        placeholder="City, State, Country"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        required
                      />
                      {formErrors.location && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.location}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number*</label>
                      <input 
                        type="tel" 
                        name="contactNumber"
                        className={`w-full p-2 border ${formErrors.contactNumber ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        value={formData.contactNumber}
                        onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                        required
                      />
                      {formErrors.contactNumber && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.contactNumber}</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input 
                        type="email" 
                        className={`w-full p-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Land Details Section */}
            <div className="mb-6">
              <button 
                type="button"
                className="w-full flex items-center justify-between bg-green-50 p-4 rounded-lg mb-4"
                onClick={() => toggleSection('land')}
              >
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <BarChart3 className="text-green-600" size={20} />
                  </div>
                  <span className="font-medium">Land Details</span>
                </div>
                {expandedSection === 'land' ? <ChevronDown /> : <ChevronRight />}
              </button>
              
              {expandedSection === 'land' && (
                <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Land Size*</label>
                        <input 
                          type="number" 
                          name="totalLandSize"
                          className={`w-full p-2 border ${formErrors.totalLandSize ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                          value={formData.totalLandSize}
                          onChange={(e) => handleInputChange('totalLandSize', e.target.value)}
                          required
                        />
                        {formErrors.totalLandSize && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.totalLandSize}</p>
                        )}
                      </div>
                      <div className="w-24">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                        <select 
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={formData.landSizeUnit}
                          onChange={(e) => handleInputChange('landSizeUnit', e.target.value)}
                        >
                          <option value="acres">Acres</option>
                          <option value="hectares">Hectares</option>
                          <option value="sqm">Sq. Meters</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Soil Type*</label>
                      <select 
                        name="soilType"
                        className={`w-full p-2 border ${formErrors.soilType ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        value={formData.soilType}
                        onChange={(e) => handleInputChange('soilType', e.target.value)}
                        required
                      >
                        <option value="">Select Soil Type</option>
                        <option value="clay">Clay</option>
                        <option value="silt">Silt</option>
                        <option value="sandy">Sandy</option>
                        <option value="loamy">Loamy</option>
                        <option value="peaty">Peaty</option>
                        <option value="chalky">Chalky</option>
                        <option value="other">Other</option>
                      </select>
                      {formErrors.soilType && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.soilType}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Land Topography</label>
                      <select 
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={formData.landTopography}
                        onChange={(e) => handleInputChange('landTopography', e.target.value)}
                      >
                        <option value="">Select Topography</option>
                        <option value="flat">Flat</option>
                        <option value="gentle_slope">Gentle Slope</option>
                        <option value="steep_slope">Steep Slope</option>
                        <option value="terraced">Terraced</option>
                        <option value="undulating">Undulating</option>
                        <option value="mixed">Mixed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Irrigation Source*</label>
                      <select 
                        name="irrigationSource"
                        className={`w-full p-2 border ${formErrors.irrigationSource ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        value={formData.irrigationSource}
                        onChange={(e) => handleInputChange('irrigationSource', e.target.value)}
                        required
                      >
                        <option value="">Select Source</option>
                        <option value="river">River</option>
                        <option value="lake">Lake</option>
                        <option value="well">Well</option>
                        <option value="groundwater">Groundwater</option>
                        <option value="rainwater">Rainwater</option>
                        <option value="municipal">Municipal Supply</option>
                        <option value="none">None</option>
                      </select>
                      {formErrors.irrigationSource && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.irrigationSource}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Irrigation System</label>
                      <select 
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={formData.irrigationSystem}
                        onChange={(e) => handleInputChange('irrigationSystem', e.target.value)}
                      >
                        <option value="">Select System</option>
                        <option value="drip">Drip Irrigation</option>
                        <option value="sprinkler">Sprinkler System</option>
                        <option value="flood">Flood Irrigation</option>
                        <option value="center_pivot">Center Pivot</option>
                        <option value="manual">Manual</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                type="button"
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                onClick={nextStep}
              >
                Next
              </button>
            </div>
          </>
        );
        
      case 2:
        return (
          <>
            <h2 className="text-xl font-bold mb-6">Crop & Historical Data</h2>
            
            {/* Crop Information Section */}
            <div className="mb-6">
              <button 
                type="button"
                className="w-full flex items-center justify-between bg-green-50 p-4 rounded-lg mb-4"
                onClick={() => toggleSection('crops')}
              >
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <Crop className="text-green-600" size={20} />
                  </div>
                  <span className="font-medium">Crop Information</span>
                </div>
                {expandedSection === 'crops' ? <ChevronDown /> : <ChevronRight />}
              </button>
              
              {expandedSection === 'crops' && (
                <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
                  <h3 className="font-medium text-gray-700 mb-4">Primary Crops</h3>
                  
                  {formData.primaryCrops.map((crop, index) => (
                    <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium">Crop {index + 1}</h4>
                        {formData.primaryCrops.length > 1 && (
                          <button 
                            type="button"
                            className="text-red-500 text-sm"
                            onClick={() => removeArrayItem('primaryCrops', index)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Crop Name*</label>
                          <input 
                            type="text" 
                            name={`primaryCrops_${index}_cropName`}
                            className={`w-full p-2 border ${formErrors[`primaryCrops_${index}_cropName`] ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            placeholder="e.g., Rice, Wheat, Corn"
                            value={crop.cropName}
                            onChange={(e) => handleArrayInputChange('primaryCrops', index, 'cropName', e.target.value)}
                            required
                          />
                          {formErrors[`primaryCrops_${index}_cropName`] && (
                            <p className="mt-1 text-sm text-red-600">{formErrors[`primaryCrops_${index}_cropName`]}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Variety Name</label>
                          <input 
                            type="text" 
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="e.g., Basmati, Durum, Sweet Corn"
                            value={crop.varietyName}
                            onChange={(e) => handleArrayInputChange('primaryCrops', index, 'varietyName', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Area Allocated*</label>
                          <div className="flex items-center">
                            <input 
                              type="number" 
                              name={`primaryCrops_${index}_areaAllocated`}
                              className={`w-full p-2 border ${formErrors[`primaryCrops_${index}_areaAllocated`] ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                              placeholder="Area"
                              value={crop.areaAllocated}
                              onChange={(e) => handleArrayInputChange('primaryCrops', index, 'areaAllocated', e.target.value)}
                              required
                            />
                            <span className="ml-2 text-gray-600">{formData.landSizeUnit}</span>
                          </div>
                          {formErrors[`primaryCrops_${index}_areaAllocated`] && (
                            <p className="mt-1 text-sm text-red-600">{formErrors[`primaryCrops_${index}_areaAllocated`]}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Harvest Frequency</label>
                          <select 
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={crop.harvestFrequency}
                            onChange={(e) => handleArrayInputChange('primaryCrops', index, 'harvestFrequency', e.target.value)}
                          >
                            <option value="annual">Annual</option>
                            <option value="biannual">Biannual</option>
                            <option value="seasonal">Seasonal</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="monthly">Monthly</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    type="button" 
                    className="text-green-600 font-medium flex items-center mt-2"
                    onClick={() => addArrayItem('primaryCrops', { cropName: '', varietyName: '', areaAllocated: '', harvestFrequency: 'annual' })}
                  >
                    <span className="mr-1">+</span> Add Another Crop
                  </button>
                  
                  <div className="mt-4">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        checked={formData.cropRotation}
                        onChange={(e) => handleInputChange('cropRotation', e.target.checked)}
                      />
                      <span className="ml-2 text-sm text-gray-700">Do you practice crop rotation?</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
            
            {/* Historical Data Section */}
            <div className="mb-6">
              <button 
                type="button"
                className="w-full flex items-center justify-between bg-green-50 p-4 rounded-lg mb-4"
                onClick={() => toggleSection('historical')}
              >
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <BarChart3 className="text-green-600" size={20} />
                  </div>
                  <span className="font-medium">Historical Data</span>
                </div>
                {expandedSection === 'historical' ? <ChevronDown /> : <ChevronRight />}
              </button>
              
              {expandedSection === 'historical' && (
                <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
                  <h3 className="font-medium text-gray-700 mb-4">Previous Yield Data</h3>
                  
                  {formData.previousYieldData.map((data, index) => (
                    <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium">Record {index + 1}</h4>
                        {formData.previousYieldData.length > 1 && (
                          <button 
                            type="button"
                            className="text-red-500 text-sm"
                            onClick={() => removeArrayItem('previousYieldData', index)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Crop Name*</label>
                          <input 
                            type="text" 
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={data.cropName}
                            onChange={(e) => handleArrayInputChange('previousYieldData', index, 'cropName', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Year*</label>
                          <input 
                            type="number" 
                            className="w-full p-2 border border-gray-300 rounded-md"
                            min="2010"
                            max="2025"
                            value={data.year}
                            onChange={(e) => handleArrayInputChange('previousYieldData', index, 'year', e.target.value)}
                            required
                          />
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Yield*</label>
                            <input 
                              type="number" 
                              className="w-full p-2 border border-gray-300 rounded-md"
                              value={data.yield}
                              onChange={(e) => handleArrayInputChange('previousYieldData', index, 'yield', e.target.value)}
                              required
                            />
                          </div>
                          <div className="w-24">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                            <select 
                              className="w-full p-2 border border-gray-300 rounded-md"
                              value={data.yieldUnit}
                              onChange={(e) => handleArrayInputChange('previousYieldData', index, 'yieldUnit', e.target.value)}
                            >
                              <option value="tons">Tons</option>
                              <option value="kg">Kilograms</option>
                              <option value="quintals">Quintals</option>
                              <option value="bushels">Bushels</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    type="button" 
                    className="text-green-600 font-medium flex items-center mt-2"
                    onClick={() => addArrayItem('previousYieldData', { cropName: '', year: '', yield: '', yieldUnit: 'tons' })}
                  >
                    <span className="mr-1">+</span> Add Another Record
                  </button>
                  
                  <div className="mt-6 grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Common Diseases</label>
                      <textarea 
                        className="w-full p-2 border border-gray-300 rounded-md"
                        rows="3"
                        placeholder="List any common diseases that have affected your crops in the past"
                        value={formData.commonDiseases}
                        onChange={(e) => handleInputChange('commonDiseases', e.target.value)}
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pest Issues</label>
                      <textarea 
                        className="w-full p-2 border border-gray-300 rounded-md"
                        rows="3"
                        placeholder="List any pest issues that have affected your crops in the past"
                        value={formData.pestIssues}
                        onChange={(e) => handleInputChange('pestIssues', e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                type="button"
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
                onClick={prevStep}
              >
                Previous
              </button>
              <button
                type="button"
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                onClick={nextStep}
              >
                Next
              </button>
            </div>
          </>
        );
        
      case 3:
        return (
          <>
            <h2 className="text-xl font-bold mb-6">Climate & Financial Data</h2>
            
            {/* Climate Conditions Section */}
            <div className="mb-6">
              <button 
                type="button"
                className="w-full flex items-center justify-between bg-green-50 p-4 rounded-lg mb-4"
                onClick={() => toggleSection('climate')}
              >
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <CloudRain className="text-green-600" size={20} />
                  </div>
                  <span className="font-medium">Climate Conditions</span>
                </div>
                {expandedSection === 'climate' ? <ChevronDown /> : <ChevronRight />}
              </button>
              
              {expandedSection === 'climate' && (
                <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Average Annual Rainfall (mm)</label>
                      <input 
                        type="number" 
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="e.g., 800"
                        value={formData.averageRainfall}
                        onChange={(e) => handleInputChange('averageRainfall', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Min Temperature (°C)</label>
                        <input 
                          type="number" 
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="e.g., 15"
                          value={formData.temperatureRange.min}
                          onChange={(e) => handleNestedInputChange('temperatureRange', 'min', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Temperature (°C)</label>
                        <input 
                          type="number" 
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="e.g., 35"
                          value={formData.temperatureRange.max}
                          onChange={(e) => handleNestedInputChange('temperatureRange', 'max', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Min Humidity (%)</label>
                        <input 
                          type="number" 
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="e.g., 30"
                          min="0"
                          max="100"
                          value={formData.humidityLevels.min}
                          onChange={(e) => handleNestedInputChange('humidityLevels', 'min', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Humidity (%)</label>
                        <input 
                          type="number" 
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="e.g., 80"
                          min="0"
                          max="100"
                          value={formData.humidityLevels.max}
                          onChange={(e) => handleNestedInputChange('humidityLevels', 'max', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Major Weather Issues</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {weatherIssueOptions.map((issue) => (
                        <label key={issue} className="flex items-center p-2 border border-gray-300 rounded-md">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            checked={formData.majorWeatherIssues.includes(issue)}
                            onChange={() => toggleArrayItem('majorWeatherIssues', issue)}
                          />
                          <span className="ml-2 text-sm">{issue}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Financial Information Section */}
            <div className="mb-6">
              <button 
                type="button"
                className="w-full flex items-center justify-between bg-green-50 p-4 rounded-lg mb-4"
                onClick={() => toggleSection('financial')}
              >
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <DollarSign className="text-green-600" size={20} />
                  </div>
                  <span className="font-medium">Financial Information</span>
                </div>
                {expandedSection === 'financial' ? <ChevronDown /> : <ChevronRight />}
              </button>
              
              {expandedSection === 'financial' && (
                <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
                  <p className="text-sm text-gray-600 mb-4">Please enter your financial information below. All fields are optional but will help us provide better recommendations.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Annual Investment (USD)</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="e.g., 5000"
                        value={formData.annualInvestment}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d]/g, '');
                          handleInputChange('annualInvestment', value);
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Irrigation Cost (USD)</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="e.g., 1200"
                        value={formData.irrigationCost}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d]/g, '');
                          handleInputChange('irrigationCost', value);
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fertilizer Cost (USD)</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="e.g., 800"
                        value={formData.fertilizerCost}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d]/g, '');
                          handleInputChange('fertilizerCost', value);
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pesticide Cost (USD)</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="e.g., 500"
                        value={formData.pesticideCost}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d]/g, '');
                          handleInputChange('pesticideCost', value);
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Labor Cost (USD)</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="e.g., 2000"
                        value={formData.laborCost}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d]/g, '');
                          handleInputChange('laborCost', value);
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expected ROI (%)</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="e.g., 15"
                        value={formData.expectedRoi}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d]/g, '');
                          if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 100)) {
                            handleInputChange('expectedRoi', value);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                type="button"
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
                onClick={prevStep}
              >
                Previous
              </button>
              <button
                type="button"
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                onClick={nextStep}
              >
                Next
              </button>
            </div>
          </>
        );
        
      case 4:
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            {isLoading ? (
              <div className="text-center p-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
                <p className="mt-2 text-gray-600">Submitting your data...</p>
              </div>
            ) : error ? (
              <div className="text-center p-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  <p>{error}</p>
                  <button 
                    onClick={() => setError(null)}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : formSubmitted ? (
              <div className="text-center p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
                  <Check className="text-green-600" size={32} />
                </div>
                <h3 className="mt-4 text-xl font-medium text-gray-900">Form Submitted Successfully!</h3>
                <p className="mt-2 text-gray-600">Thank you for providing your farm information.</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-6 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                >
                  Submit Another Form
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-6">Review & Submit</h2>
                <p className="mb-4">Please review your information before submitting:</p>
                
                {Object.keys(formErrors).length > 0 && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          There {Object.keys(formErrors).length === 1 ? 'is' : 'are'} {Object.keys(formErrors).length} error{Object.keys(formErrors).length === 1 ? '' : 's'} in your form
                        </h3>
                        <div className="mt-2 text-sm text-red-700">
                          <ul className="list-disc pl-5 space-y-1">
                            {Object.entries(formErrors).map(([field, error]) => (
                              <li key={field}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h3 className="font-medium">General Information</h3>
                  <p>Farmer Name: {formData.farmerName || <span className="text-red-500">Missing</span>}</p>
                  <p>Farm Name: {formData.farmName || 'Not provided'}</p>
                  <p>Location: {formData.location || <span className="text-red-500">Missing</span>}</p>
                  <p>Contact Number: {formData.contactNumber || <span className="text-red-500">Missing</span>}</p>
                  <p>Email: {formData.email || 'Not provided'}</p>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h3 className="font-medium">Land Details</h3>
                  <p>Total Land Size: {formData.totalLandSize ? `${formData.totalLandSize} ${formData.landSizeUnit}` : <span className="text-red-500">Missing</span>}</p>
                  <p>Soil Type: {formData.soilType || <span className="text-red-500">Missing</span>}</p>
                  <p>Irrigation Source: {formData.irrigationSource || <span className="text-red-500">Missing</span>}</p>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h3 className="font-medium">Crop Information</h3>
                  {formData.primaryCrops.map((crop, index) => (
                    <div key={index} className="mb-2">
                      <p>Crop {index + 1}: {crop.cropName || <span className="text-red-500">Missing</span>}</p>
                      <p className="ml-4">Variety: {crop.varietyName || 'Not specified'}</p>
                      <p className="ml-4">Area: {crop.areaAllocated ? `${crop.areaAllocated} ${formData.landSizeUnit}` : <span className="text-red-500">Missing</span>}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
                    onClick={prevStep}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              </>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4].map((step) => (
                <div 
                  key={step}
                  className={`flex flex-col items-center ${currentStep >= step ? 'text-green-600' : 'text-gray-400'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= step ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {currentStep > step ? (
                      <Check className="text-green-600" size={16} />
                    ) : (
                      <span>{step}</span>
                    )}
                  </div>
                  <span className="text-xs mt-1">
                    {step === 1 && 'Basic Info'}
                    {step === 2 && 'Crop Data'}
                    {step === 3 && 'Climate/Finance'}
                    {step === 4 && 'Review'}
                  </span>
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {renderFormStep()}
        </form>
      </main>
    </div>
  );
}