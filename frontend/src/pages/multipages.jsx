// // File: src/App.jsx
// import { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import Dashboard from './pages/Dashboard';
// import HistoryPage from './pages/HistoryPage';
// import SettingsPage from './pages/SettingsPage';
// import Statistics from './pages/Statistics';
// import Navbar from './components/Navbar';
// import './App.css';

// function App() {
//   return (
//     <Router>
//       <div className="min-h-screen bg-gray-100">
//         <Navbar />
//         <div className="container mx-auto px-4 py-8">
//           <Routes>
//             <Route path="/" element={<Dashboard />} />
//             <Route path="/history" element={<HistoryPage />} />
//             <Route path="/settings" element={<SettingsPage />} />
//             <Route path="/statistics" element={<Statistics />} />
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;

// // File: src/components/Navbar.jsx
// // import { Link } from 'react-router-dom';

// // function Navbar() {
// //   return (
// //     <nav className="bg-green-600 text-white shadow-lg">
// //       <div className="container mx-auto px-4">
// //         <div className="flex justify-between h-16">
// //           <div className="flex items-center">
// //             <span className="text-xl font-bold">Betelnut Disease Monitor</span>
// //           </div>
// //           <div className="flex items-center space-x-4">
// //             <Link to="/" className="px-3 py-2 rounded hover:bg-green-700">Dashboard</Link>
// //             <Link to="/history" className="px-3 py-2 rounded hover:bg-green-700">History</Link>
// //             <Link to="/statistics" className="px-3 py-2 rounded hover:bg-green-700">Statistics</Link>
// //             <Link to="/settings" className="px-3 py-2 rounded hover:bg-green-700">Settings</Link>
// //           </div>
// //         </div>
// //       </div>
// //     </nav>
// //   );
// // }

// // export default Navbar;

// // File: src/pages/Dashboard.jsx
// // import { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import DiseaseCard from '../components/DiseaseCard';
// // import VideoFeed from '../components/VideoFeed';
// // import StatusInfo from '../components/StatusInfo';
// // import SolutionsList from '../components/SolutionsList';

// // const API_BASE_URL = 'http://localhost:5000'; // Change to your Flask server address

// // function Dashboard() {
// //   const [diseaseData, setDiseaseData] = useState({ disease: 'Loading...', confidence: 0 });
// //   const [statusInfo, setStatusInfo] = useState({});
// //   const [solutions, setSolutions] = useState([]);

// //   useEffect(() => {
// //     const fetchDiseaseData = async () => {
// //       try {
// //         const response = await axios.get(`${API_BASE_URL}/disease-data`);
// //         setDiseaseData(response.data);
        
// //         // Fetch solutions for the detected disease
// //         const solutionsRes = await axios.get(`${API_BASE_URL}/api/solutions/${response.data.disease}`);
// //         setSolutions(solutionsRes.data.solutions || []);
// //       } catch (error) {
// //         console.error('Error fetching disease data:', error);
// //       }
// //     };

// //     const fetchStatusInfo = async () => {
// //       try {
// //         const response = await axios.get(`${API_BASE_URL}/api/status-info`);
// //         setStatusInfo(response.data);
// //       } catch (error) {
// //         console.error('Error fetching status info:', error);
// //       }
// //     };

// //     // Initial fetch
// //     fetchDiseaseData();
// //     fetchStatusInfo();

// //     // Set up intervals for periodic fetching
// //     const diseaseInterval = setInterval(fetchDiseaseData, 1000);
// //     const statusInterval = setInterval(fetchStatusInfo, 2000);

// //     return () => {
// //       clearInterval(diseaseInterval);
// //       clearInterval(statusInterval);
// //     };
// //   }, []);

// //   return (
// //     <div className="space-y-6">
// //       <h1 className="text-3xl font-bold text-green-800">Betelnut Leaf Monitoring Dashboard</h1>
      
// //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// //         <div className="lg:col-span-2">
// //           <VideoFeed />
// //         </div>
        
// //         <div className="space-y-6">
// //           <DiseaseCard disease={diseaseData.disease} confidence={diseaseData.confidence} />
// //           <StatusInfo statusInfo={statusInfo} />
// //         </div>
// //       </div>
      
// //       {solutions.length > 0 && (
// //         <div className="mt-6 bg-white rounded-lg shadow p-6">
// //           <h2 className="text-xl font-semibold text-green-700 mb-4">Recommended Solutions</h2>
// //           <SolutionsList solutions={solutions} />
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default Dashboard;

// // File: src/components/VideoFeed.jsx
// function VideoFeed() {
//   const videoUrl = 'http://localhost:5000/video_feed'; // Your Flask video endpoint
  
//   return (
//     <div className="bg-white rounded-lg shadow overflow-hidden">
//       <div className="p-4 bg-green-50 border-b border-green-100">
//         <h3 className="text-lg font-medium text-green-800">Live Camera Feed</h3>
//       </div>
//       <div className="p-4">
//         <img 
//           src={videoUrl} 
//           alt="Live video feed" 
//           className="w-full h-auto rounded"
//           style={{ minHeight: "300px" }}
//         />
//       </div>
//     </div>
//   );
// }

// export default VideoFeed;

// // File: src/components/DiseaseCard.jsx
// // function DiseaseCard({ disease, confidence }) {
// //   // Determine color based on disease
// //   let bgColor = "bg-gray-50";
// //   let textColor = "text-gray-800";
// //   let statusColor = "text-gray-600";
  
// //   if (disease === "Healthy Leaf") {
// //     bgColor = "bg-green-50";
// //     textColor = "text-green-800";
// //     statusColor = "text-green-600";
// //   } else if (disease === "Dried Leaf") {
// //     bgColor = "bg-yellow-50";
// //     textColor = "text-yellow-800";
// //     statusColor = "text-yellow-600";
// //   } else if (disease.includes("Disease")) {
// //     bgColor = "bg-red-50";
// //     textColor = "text-red-800";
// //     statusColor = "text-red-600";
// //   }
  
// //   return (
// //     <div className={`rounded-lg shadow ${bgColor} p-6`}>
// //       <h3 className={`text-lg font-medium ${textColor}`}>Current Detection</h3>
// //       <div className="mt-4">
// //         <p className={`text-2xl font-bold ${statusColor}`}>{disease}</p>
// //         <p className="mt-2 text-gray-600">
// //           Confidence: {(confidence * 100).toFixed(2)}%
// //         </p>
// //       </div>
// //     </div>
// //   );
// // }

// // export default DiseaseCard;

// // File: src/components/StatusInfo.jsx
// function StatusInfo({ statusInfo }) {
//   return (
//     <div className="bg-blue-50 rounded-lg shadow p-6">
//       <h3 className="text-lg font-medium text-blue-800">System Status</h3>
//       <div className="mt-4 space-y-2">
//         <p className="text-gray-700">
//           <span className="font-medium">Last Stored:</span> {statusInfo.lastStored || "None"}
//         </p>
//         <p className="text-gray-700">
//           <span className="font-medium">Storage Delay:</span> {statusInfo.storageDelay} seconds
//         </p>
//         <p className="text-gray-700">
//           <span className="font-medium">Frame Stability:</span> {statusInfo.frameStability}
//         </p>
//       </div>
//     </div>
//   );
// }

// export default StatusInfo;

// // File: src/components/SolutionsList.jsx
// function SolutionsList({ solutions }) {
//   return (
//     <ul className="list-disc pl-5 space-y-2">
//       {solutions.map((solution, index) => (
//         <li key={index} className="text-gray-700">{solution}</li>
//       ))}
//     </ul>
//   );
// }

// export default SolutionsList;

// // File: src/pages/HistoryPage.jsx
// import { useState, useEffect } from 'react';
// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5000';

// function HistoryPage() {
//   const [detections, setDetections] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedDisease, setSelectedDisease] = useState(null);
//   const [solutions, setSolutions] = useState([]);

//   useEffect(() => {
//     fetchDetections();
    
//     // Set up interval to refresh data every 30 seconds
//     const interval = setInterval(fetchDetections, 30000);
    
//     return () => clearInterval(interval);
//   }, []);

//   const fetchDetections = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${API_BASE_URL}/api/stored-detections`);
//       setDetections(response.data);
//       setError(null);
//     } catch (err) {
//       setError('Failed to fetch detection history');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showSolutions = async (disease) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/solutions/${disease}`);
//       setSolutions(response.data.solutions || []);
//       setSelectedDisease(disease);
//     } catch (err) {
//       console.error('Error fetching solutions:', err);
//     }
//   };

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-green-800">Disease Detection History</h1>
//         <button 
//           onClick={fetchDetections}
//           className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//         >
//           Refresh
//         </button>
//       </div>
      
//       {error && (
//         <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
//           {error}
//         </div>
//       )}
      
//       {loading && detections.length === 0 ? (
//         <div className="text-center py-10">
//           <p className="text-gray-600">Loading detection history...</p>
//         </div>
//       ) : detections.length === 0 ? (
//         <div className="text-center py-10 bg-gray-50 rounded-lg">
//           <p className="text-gray-600">No disease detections have been stored yet.</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {detections.map(detection => (
//             <div 
//               key={detection._id} 
//               className={`bg-white rounded-lg shadow overflow-hidden ${
//                 detection.disease.includes('Disease') ? 'border-l-4 border-red-500' : 
//                 detection.disease === 'Dried Leaf' ? 'border-l-4 border-yellow-500' : 
//                 'border-l-4 border-green-500'
//               }`}
//             >
//               <div className="p-4">
//                 <h3 className="font-bold text-lg text-gray-800">{detection.disease}</h3>
//                 <p className="text-gray-600">
//                   Confidence: {(detection.confidence * 100).toFixed(2)}%
//                 </p>
//                 <p className="text-gray-500 text-sm">
//                   {new Date(detection.timestamp).toLocaleString()}
//                 </p>
//               </div>
              
//               <div className="border-t border-gray-100">
//                 <img 
//                   src={`${API_BASE_URL}/api/detection/${detection._id}/image`} 
//                   alt={detection.disease}
//                   className="w-full h-48 object-cover"
//                 />
//               </div>
              
//               <div className="p-4 bg-gray-50">
//                 <button
//                   onClick={() => showSolutions(detection.disease)}
//                   className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//                 >
//                   View Solutions
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
      
//       {/* Solutions Modal */}
//       {selectedDisease && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg max-w-md w-full p-6">
//             <h3 className="text-xl font-bold text-green-800 mb-4">
//               Solutions for {selectedDisease}
//             </h3>
            
//             <ul className="list-disc pl-5 mb-6 space-y-2">
//               {solutions.map((solution, index) => (
//                 <li key={index} className="text-gray-700">{solution}</li>
//               ))}
//             </ul>
            
//             <button
//               onClick={() => setSelectedDisease(null)}
//               className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default HistoryPage;

// // File: src/pages/SettingsPage.jsx
// // import { useState, useEffect } from 'react';
// // import axios from 'axios';

// // const API_BASE_URL = 'http://localhost:5000';

// // function SettingsPage() {
// //   const [settings, setSettings] = useState({
// //     storageDelay: 10,
// //     minStableFrames: 5
// //   });
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [success, setSuccess] = useState(false);
// //   const [cleanupDays, setCleanupDays] = useState(30);

// //   useEffect(() => {
// //     fetchSettings();
// //   }, []);

// //   const fetchSettings = async () => {
// //     try {
// //       setLoading(true);
// //       const response = await axios.get(`${API_BASE_URL}/api/settings`);
// //       setSettings(response.data);
// //       setError(null);
// //     } catch (err) {
// //       setError('Failed to load settings');
// //       console.error(err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setSettings({
// //       ...settings,
// //       [name]: parseInt(value)
// //     });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       setLoading(true);
// //       await axios.post(`${API_BASE_URL}/api/settings`, settings);
// //       setSuccess(true);
// //       setTimeout(() => setSuccess(false), 3000);
// //     } catch (err) {
// //       setError('Failed to save settings');
// //       console.error(err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleCleanup = async () => {
// //     try {
// //       setLoading(true);
// //       const response = await axios.post(`${API_BASE_URL}/api/clean-old-data`, {
// //         days: cleanupDays
// //       });
// //       alert(`Successfully deleted ${response.data.deleted_count} old records`);
// //     } catch (err) {
// //       setError('Failed to clean up old data');
// //       console.error(err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div>
// //       <h1 className="text-3xl font-bold text-green-800 mb-6">Settings</h1>
      
// //       {error && (
// //         <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
// //           {error}
// //         </div>
// //       )}
      
// //       {success && (
// //         <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
// //           Settings saved successfully!
// //         </div>
// //       )}
      
// //       <div className="bg-white rounded-lg shadow p-6 mb-6">
// //         <h2 className="text-xl font-semibold text-green-700 mb-4">Detection Settings</h2>
        
// //         <form onSubmit={handleSubmit}>
// //           <div className="mb-4">
// //             <label className="block text-gray-700 font-medium mb-2">
// //               Storage Delay (seconds)
// //             </label>
// //             <input
// //               type="number"
// //               name="storageDelay"
// //               value={settings.storageDelay}
// //               onChange={handleChange}
// //               min="1"
// //               max="60"
// //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
// //             />
// //             <p className="text-sm text-gray-500 mt-1">
// //               Minimum time between storing detections of the same disease
// //             </p>
// //           </div>
          
// //           <div className="mb-6">
// //             <label className="block text-gray-700 font-medium mb-2">
// //               Minimum Stable Frames
// //             </label>
// //             <input
// //               type="number"
// //               name="minStableFrames"
// //               value={settings.minStableFrames}
// //               onChange={handleChange}
// //               min="1"
// //               max="20"
// //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
// //             />
// //             <p className="text-sm text-gray-500 mt-1">
// //               Number of consecutive frames needed to confirm detection
// //             </p>
// //           </div>
          
// //           <button
// //             type="submit"
// //             disabled={loading}
// //             className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
// //           >
// //             {loading ? 'Saving...' : 'Save Settings'}
// //           </button>
// //         </form>
// //       </div>
      
// //       <div className="bg-white rounded-lg shadow p-6">
// //         <h2 className="text-xl font-semibold text-green-700 mb-4">Data Management</h2>
        
// //         <div className="mb-4">
// //           <label className="block text-gray-700 font-medium mb-2">
// //             Delete Data Older Than (days)
// //           </label>
// //           <input
// //             type="number"
// //             value={cleanupDays}
// //             onChange={(e) => setCleanupDays(parseInt(e.target.value))}
// //             min="1"
// //             max="365"
// //             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
// //           />
// //         </div>
        
// //         <button
// //           onClick={handleCleanup}
// //           disabled={loading}
// //           className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
// //         >
// //           {loading ? 'Processing...' : 'Clean Old Data'}
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// // export default SettingsPage;

// // File: src/pages/Statistics.jsx
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { 
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement
// } from 'chart.js';
// import { Bar, Pie } from 'react-chartjs-2';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement
// );

// const API_BASE_URL = 'http://localhost:5000';

// function Statistics() {
//   const [detections, setDetections] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   useEffect(() => {
//     fetchDetections();
//   }, []);

//   const fetchDetections = async () => {
//     try {
//       setLoading(true);
//       // We'll assume we can get all detections for stats purposes
//       // In a real app, you might need a dedicated endpoint for this
//       const response = await axios.get(`${API_BASE_URL}/api/stored-detections`);
//       setDetections(response.data);
//       setError(null);
//     } catch (err) {
//       setError('Failed to fetch detection data');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Process data for disease distribution chart
//   const processDiseaseDistribution = () => {
//     const diseases = {};
    
//     detections.forEach(detection => {
//       if (!diseases[detection.disease]) {
//         diseases[detection.disease] = 0;
//       }
//       diseases[detection.disease]++;
//     });
    
//     return {
//       labels: Object.keys(diseases),
//       datasets: [
//         {
//           label: 'Disease Distribution',
//           data: Object.values(diseases),
//           backgroundColor: [
//             'rgba(255, 99, 132, 0.6)',
//             'rgba(54, 162, 235, 0.6)',
//             'rgba(255, 206, 86, 0.6)',
//             'rgba(75, 192, 192, 0.6)',
//           ],
//           borderColor: [
//             'rgba(255, 99, 132, 1)',
//             'rgba(54, 162, 235, 1)',
//             'rgba(255, 206, 86, 1)',
//             'rgba(75, 192, 192, 1)',
//           ],
//           borderWidth: 1,
//         },
//       ],
//     };
//   };

//   // Process data for detections over time
//   const processDetectionsOverTime = () => {
//     // Group by day
//     const dayMap = {};
    
//     detections.forEach(detection => {
//       const date = new Date(detection.timestamp);
//       const day = date.toLocaleDateString();
      
//       if (!dayMap[day]) {
//         dayMap[day] = {};
//       }
      
//       if (!dayMap[day][detection.disease]) {
//         dayMap[day][detection.disease] = 0;
//       }
      
//       dayMap[day][detection.disease]++;
//     });
    
//     // Get all unique diseases
//     const allDiseases = new Set();
//     detections.forEach(detection => {
//       allDiseases.add(detection.disease);
//     });
    
//     // Sort days
//     const sortedDays = Object.keys(dayMap).sort((a, b) => {
//       return new Date(a) - new Date(b);
//     });
    
//     // Create datasets for each disease
//     const datasets = [];
//     const colors = [
//       'rgba(255, 99, 132, 0.6)',
//       'rgba(54, 162, 235, 0.6)',
//       'rgba(255, 206, 86, 0.6)',
//       'rgba(75, 192, 192, 0.6)',
//     ];
    
//     [...allDiseases].forEach((disease, index) => {
//       const data = sortedDays.map(day => dayMap[day][disease] || 0);
      
//       datasets.push({
//         label: disease,
//         data,
//         backgroundColor: colors[index % colors.length],
//         borderColor: colors[index % colors.length].replace('0.6', '1'),
//         borderWidth: 1,
//       });
//     });
    
//     return {
//       labels: sortedDays,
//       datasets,
//     };
//   };

//   if (loading) {
//     return (
//       <div className="text-center py-10">
//         <p className="text-gray-600">Loading statistics...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-100 text-red-700 p-4 rounded-lg">
//         {error}
//       </div>
//     );
//   }

//   if (detections.length === 0) {
//     return (
//       <div className="text-center py-10 bg-gray-50 rounded-lg">
//         <h1 className="text-3xl font-bold text-green-800 mb-6">Statistics</h1>
//         <p className="text-gray-600">No detection data available for statistics.</p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h1 className="text-3xl font-bold text-green-800 mb-6">Statistics</h1>
      
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold text-green-700 mb-4">Disease Distribution</h2>
//           <Pie data={processDiseaseDistribution()} />
//         </div>
        
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold text-green-700 mb-4">Recent Detections Summary</h2>
//           <div className="mb-4">
//             <p className="text-lg font-medium">Total Detections: <span className="font-bold">{detections.length}</span></p>
//             <p className="text-gray-600">Latest Detection: {new Date(detections[0]?.timestamp).toLocaleString()}</p>
//           </div>
//           <div>
//             <h3 className="font-medium mb-2">Disease Breakdown:</h3>
//             {Object.entries(detections.reduce((acc, det) => {
//               acc[det.disease] = (acc[det.disease] || 0) + 1;
//               return acc;
//             }, {})).map(([disease, count]) => (
//               <div key={disease} className="flex justify-between mb-1">
//                 <span className="text-gray-700">{disease}:</span>
//                 <span className="font-medium">{count} ({((count / detections.length) * 100).toFixed(1)}%)</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
      
//       <div className="mt-6 bg-white rounded-lg shadow p-6">
//         <h2 className="text-xl font-semibold text-green-700 mb-4">Detections Over Time</h2>
//         <Bar 
//           data={processDetectionsOverTime()} 
//           options={{
//             responsive: true,
//             plugins: {
//               legend: {
//                 position: 'top',
//               },
//               title: {
//                 display: true,
//                 text: 'Disease Detections By Day'
//               },
//             },
//           }}
//         />
//       </div>
//     </div>
//   );
// }

// export default Statistics;