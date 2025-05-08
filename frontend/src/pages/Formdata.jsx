import { useEffect, useState } from 'react';
import { ChevronRight, ChevronDown, Crop, CloudRain, Bug, Thermometer, DollarSign, BarChart3, Check, File } from 'lucide-react';
import { useSearchParams } from 'react-router-dom'; // Import for accessing URL parameters

export default function FarmerDataDisplay() {
  const [searchParams] = useSearchParams(); // For getting form data from URL
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch form data from API or localStorage
    const fetchData = async () => {
      try {
        // First try to get formId from URL params
        const formId = searchParams.get('formId');
        
        if (formId) {
          // If we have a formId, fetch data from API
          try {
            const response = await fetch(`/api/farmer-data/${formId}`);
            if (!response.ok) {
              throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setFormData(data);
          } catch (apiError) {
            console.error('API fetch error:', apiError);
            setError('Failed to load data from server. Please try again later.');
          }
        } else {
          // If no formId in URL, try to get from localStorage
          const storedData = localStorage.getItem('farmerFormData');
          
          if (storedData) {
            setFormData(JSON.parse(storedData));
          } else {
            setError('No form data found. Please complete the form first.');
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('An error occurred while loading data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection('none');
    } else {
      setExpandedSection(section);
    }
  };

  const toggleAllSections = () => {
    setExpandedSection(expandedSection === 'all' ? 'none' : 'all');
  };

  const isSectionExpanded = (section) => {
    return expandedSection === 'all' || expandedSection === section;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading farmer data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-5xl mb-4">!</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Data Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.href = "/farmer-form"}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Go to Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navbar */}
      <nav className="bg-green-600 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Crop className="h-8 w-8 text-white" />
              <span className="ml-2 text-xl font-bold text-white">AgriTech</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Farmer Data Summary</h1>
            <div className="flex space-x-3">
              <button 
                onClick={toggleAllSections}
                className="flex items-center text-sm text-green-600 hover:text-green-700"
              >
                {expandedSection === 'all' ? 'Collapse All' : 'Expand All'}
              </button>
              <button 
                onClick={() => {
                  // Add logic to generate and download PDF
                  alert('PDF download feature will be implemented here');
                }}
                className="flex items-center text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                <File className="h-4 w-4 mr-1" />
                Export PDF
              </button>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <div className="flex items-center mb-2">
              <Check className="h-5 w-5 text-green-600 mr-2" />
              <span className="font-medium text-green-800">Data Collection Complete</span>
            </div>
            <p className="text-green-700 text-sm">
              This summary contains all the information provided by {formData.farmerName} for {formData.farmName}.
            </p>
          </div>

          {/* General Information Section */}
          <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
            <button 
              type="button"
              className="w-full flex items-center justify-between bg-gray-50 p-4"
              onClick={() => toggleSection('general')}
            >
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <Crop className="text-green-600" size={20} />
                </div>
                <span className="font-medium">General Information</span>
              </div>
              {isSectionExpanded('general') ? <ChevronDown /> : <ChevronRight />}
            </button>
            
            {isSectionExpanded('general') && (
              <div className="p-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Farmer Name</h3>
                    <p className="mt-1">{formData.farmerName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Farm Name</h3>
                    <p className="mt-1">{formData.farmName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Location</h3>
                    <p className="mt-1">{formData.location}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Contact Number</h3>
                    <p className="mt-1">{formData.contactNumber}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                    <p className="mt-1">{formData.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Land Details Section */}
          <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
            <button 
              type="button"
              className="w-full flex items-center justify-between bg-gray-50 p-4"
              onClick={() => toggleSection('land')}
            >
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <BarChart3 className="text-green-600" size={20} />
                </div>
                <span className="font-medium">Land Details</span>
              </div>
              {isSectionExpanded('land') ? <ChevronDown /> : <ChevronRight />}
            </button>
            
            {isSectionExpanded('land') && (
              <div className="p-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Total Land Size</h3>
                    <p className="mt-1">{formData.totalLandSize} {formData.landSizeUnit}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Soil Type</h3>
                    <p className="mt-1">{formData.soilType.charAt(0).toUpperCase() + formData.soilType.slice(1)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Land Topography</h3>
                    <p className="mt-1">{formData.landTopography.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Irrigation Source</h3>
                    <p className="mt-1">{formData.irrigationSource.charAt(0).toUpperCase() + formData.irrigationSource.slice(1)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Irrigation System</h3>
                    <p className="mt-1">{formData.irrigationSystem.charAt(0).toUpperCase() + formData.irrigationSystem.slice(1)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Crop Information Section */}
          <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
            <button 
              type="button"
              className="w-full flex items-center justify-between bg-gray-50 p-4"
              onClick={() => toggleSection('crops')}
            >
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <Crop className="text-green-600" size={20} />
                </div>
                <span className="font-medium">Crop Information</span>
              </div>
              {isSectionExpanded('crops') ? <ChevronDown /> : <ChevronRight />}
            </button>
            
            {isSectionExpanded('crops') && (
              <div className="p-4 border-t border-gray-200">
                <h3 className="font-medium text-gray-700 mb-3">Primary Crops</h3>
                
                <div className="grid grid-cols-1 gap-4 mb-4">
                  {formData.primaryCrops.map((crop, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-medium mb-2">{crop.cropName}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Variety:</span> {crop.varietyName}
                        </div>
                        <div>
                          <span className="text-gray-500">Area:</span> {crop.areaAllocated} {formData.landSizeUnit}
                        </div>
                        <div>
                          <span className="text-gray-500">Harvest:</span> {crop.harvestFrequency.charAt(0).toUpperCase() + crop.harvestFrequency.slice(1)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-2">
                  <span className="text-sm font-medium text-gray-500">Crop Rotation:</span>
                  <span className="ml-2">{formData.cropRotation ? 'Yes' : 'No'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Historical Data Section */}
          <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
            <button 
              type="button"
              className="w-full flex items-center justify-between bg-gray-50 p-4"
              onClick={() => toggleSection('historical')}
            >
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <BarChart3 className="text-green-600" size={20} />
                </div>
                <span className="font-medium">Historical Data</span>
              </div>
              {isSectionExpanded('historical') ? <ChevronDown /> : <ChevronRight />}
            </button>
            
            {isSectionExpanded('historical') && (
              <div className="p-4 border-t border-gray-200">
                <h3 className="font-medium text-gray-700 mb-3">Previous Yield Data</h3>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 mb-4">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crop</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yield</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {formData.previousYieldData.map((data, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">{data.cropName}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{data.year}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{data.yield} {data.yieldUnit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Common Diseases</h3>
                    <p className="mt-1">{formData.commonDiseases}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Pest Issues</h3>
                    <p className="mt-1">{formData.pestIssues}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Climate Conditions Section */}
          <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
            <button 
              type="button"
              className="w-full flex items-center justify-between bg-gray-50 p-4"
              onClick={() => toggleSection('climate')}
            >
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <CloudRain className="text-green-600" size={20} />
                </div>
                <span className="font-medium">Climate Conditions</span>
              </div>
              {isSectionExpanded('climate') ? <ChevronDown /> : <ChevronRight />}
            </button>
            
            {isSectionExpanded('climate') && (
              <div className="p-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Average Annual Rainfall</h3>
                    <p className="mt-1">{formData.averageRainfall} mm</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Temperature Range</h3>
                    <p className="mt-1">{formData.temperatureRange.min}°C to {formData.temperatureRange.max}°C</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Humidity Levels</h3>
                    <p className="mt-1">{formData.humidityLevels.min}% to {formData.humidityLevels.max}%</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Major Weather Issues</h3>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {formData.majorWeatherIssues.map((issue, index) => (
                        <span key={index} className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                          {issue}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Financial Information Section */}
          <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
            <button 
              type="button"
              className="w-full flex items-center justify-between bg-gray-50 p-4"
              onClick={() => toggleSection('financial')}
            >
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <DollarSign className="text-green-600" size={20} />
                </div>
                <span className="font-medium">Financial Information</span>
              </div>
              {isSectionExpanded('financial') ? <ChevronDown /> : <ChevronRight />}
            </button>
            
            {isSectionExpanded('financial') && (
              <div className="p-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Annual Investment</h3>
                    <p className="mt-1">${parseInt(formData.annualInvestment).toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Irrigation Cost</h3>
                    <p className="mt-1">${parseInt(formData.irrigationCost).toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Fertilizer Cost</h3>
                    <p className="mt-1">${parseInt(formData.fertilizerCost).toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Pesticide Cost</h3>
                    <p className="mt-1">${parseInt(formData.pesticideCost).toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Labor Cost</h3>
                    <p className="mt-1">${parseInt(formData.laborCost).toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Expected ROI</h3>
                    <p className="mt-1">{formData.expectedRoi}%</p>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center text-blue-800 mb-2">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    <span className="font-medium">Financial Summary</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-800">
                    <div>
                      <span className="font-medium">Total Expenses:</span> ${(parseInt(formData.irrigationCost) + parseInt(formData.fertilizerCost) + parseInt(formData.pesticideCost) + parseInt(formData.laborCost)).toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Expenses to Investment Ratio:</span> {Math.round((parseInt(formData.irrigationCost) + parseInt(formData.fertilizerCost) + parseInt(formData.pesticideCost) + parseInt(formData.laborCost)) / parseInt(formData.annualInvestment) * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Technology Access */}
          <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
            <button 
              type="button"
              className="w-full flex items-center justify-between bg-gray-50 p-4"
              onClick={() => toggleSection('technology')}
            >
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <Bug className="text-green-600" size={20} />
                </div>
                <span className="font-medium">Technology & Requirements</span>
              </div>
              {isSectionExpanded('technology') ? <ChevronDown /> : <ChevronRight />}
            </button>
            
            {isSectionExpanded('technology') && (
              <div className="p-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Internet Access</h3>
                    <p className="mt-1">{formData.internetAccess ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Smartphone Access</h3>
                    <p className="mt-1">{formData.smartphoneAccess ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500">Farming Equipment</h3>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {formData.farmingEquipment.map((equipment, index) => (
                        <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          {equipment}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500">Existing Technology Solutions</h3>
                    <p className="mt-1">{formData.existingTechSolutions}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Monitoring Priorities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm text-gray-500">Moisture Monitoring</h4>
                      <div className="mt-1 flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: formData.moistureMonitoringPriority === 'high' ? '100%' : formData.moistureMonitoringPriority === 'medium' ? '66%' : '33%' }}
                          ></div>
                        </div>
                        <span className="text-xs">{formData.moistureMonitoringPriority.charAt(0).toUpperCase() + formData.moistureMonitoringPriority.slice(1)}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-500">Disease Detection</h4>
                      <div className="mt-1 flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full" 
                            style={{ width: formData.diseaseDetectionPriority === 'high' ? '100%' : formData.diseaseDetectionPriority === 'medium' ? '66%' : '33%' }}
                          ></div>
                        </div>
                        <span className="text-xs">{formData.diseaseDetectionPriority.charAt(0).toUpperCase() + formData.diseaseDetectionPriority.slice(1)}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-500">Pest Monitoring</h4>
                      <div className="mt-1 flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full" 
                            style={{ width: formData.pestMonitoringPriority === 'high' ? '100%' : formData.pestMonitoringPriority === 'medium' ? '66%' : '33%' }}
                          ></div>
                        </div>
                        <span className="text-xs">{formData.pestMonitoringPriority.charAt(0).toUpperCase() + formData.pestMonitoringPriority.slice(1)}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-500">Nutrient Deficiency</h4>
                      <div className="mt-1 flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: formData.nutrientDeficiencyPriority === 'high' ? '100%' : formData.nutrientDeficiencyPriority === 'medium' ? '66%' : '33%' }}
                          ></div>
                        </div>
                        <span className="text-xs">{formData.nutrientDeficiencyPriority.charAt(0).toUpperCase() + formData.nutrientDeficiencyPriority.slice(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500">Other Requirements</h3>
                  <p className="mt-1">{formData.otherRequirements}</p>
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
              onClick={() => window.location.href = "/farmer-form"} // Updated to farmer-form
            >
              Back to Form
            </button>
            <button
              type="button"
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
              onClick={() => {
                // Add PDF download functionality
                alert('PDF export will be implemented here');
              }}
            >
              Download Report
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}