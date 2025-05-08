import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

import Navbar from '../components/Navbar';

export default function Statistics() {
  const [rpiAddress, setRpiAddress] = useState("192.168.11.124:5000");
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchDetections();
  }, []);

  const fetchDetections = async () => {
    try {
      setLoading(true);
      // Using fetch instead of axios
      const response = await fetch(`http://${rpiAddress}/api/stored-detections`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setDetections(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch detection data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Process data for disease distribution chart
  const processDiseaseDistribution = () => {
    const diseases = {};
    
    detections.forEach(detection => {
      if (!diseases[detection.disease]) {
        diseases[detection.disease] = 0;
      }
      diseases[detection.disease]++;
    });
    
    return Object.keys(diseases).map(disease => ({
      name: disease,
      value: diseases[disease]
    }));
  };

  // Process data for detections over time
  const processDetectionsOverTime = () => {
    // Group by day
    const dayMap = {};
    
    detections.forEach(detection => {
      const date = new Date(detection.timestamp);
      const day = date.toLocaleDateString();
      
      if (!dayMap[day]) {
        dayMap[day] = {};
      }
      
      if (!dayMap[day][detection.disease]) {
        dayMap[day][detection.disease] = 0;
      }
      
      dayMap[day][detection.disease]++;
    });
    
    // Get all unique diseases
    const allDiseases = new Set();
    detections.forEach(detection => {
      allDiseases.add(detection.disease);
    });
    
    // Sort days
    const sortedDays = Object.keys(dayMap).sort((a, b) => {
      return new Date(a) - new Date(b);
    });
    
    // Convert to format needed by Recharts
    return sortedDays.map(day => {
      const dataPoint = { name: day };
      
      [...allDiseases].forEach(disease => {
        dataPoint[disease] = dayMap[day][disease] || 0;
      });
      
      return dataPoint;
    });
  };

  // Colors for charts
  const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];

  if (loading) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">Loading statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  if (detections.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg">
        <h1 className="text-3xl font-bold text-green-800 mb-6">Statistics</h1>
        <p className="text-gray-600">No detection data available for statistics.</p>
      </div>
    );
  }

  // Get all unique diseases for bar chart
  const uniqueDiseases = [...new Set(detections.map(d => d.disease))];

  return (
    <div>
      {/* <h1 className="text-3xl font-bold text-green-800 mb-6">Statistics
     
      </h1> */}
         <Navbar />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-green-700 mb-4">Disease Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={processDiseaseDistribution()}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              >
                {processDiseaseDistribution().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} detections`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-green-700 mb-4">Recent Detections Summary</h2>
          <div className="mb-4">
            <p className="text-lg font-medium">Total Detections: <span className="font-bold">{detections.length}</span></p>
            <p className="text-gray-600">Latest Detection: {new Date(detections[0]?.timestamp).toLocaleString()}</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Disease Breakdown:</h3>
            {Object.entries(detections.reduce((acc, det) => {
              acc[det.disease] = (acc[det.disease] || 0) + 1;
              return acc;
            }, {})).map(([disease, count]) => (
              <div key={disease} className="flex justify-between mb-1">
                <span className="text-gray-700">{disease}:</span>
                <span className="font-medium">{count} ({((count / detections.length) * 100).toFixed(1)}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-green-700 mb-4">Detections Over Time</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={processDetectionsOverTime()}
            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end"
              height={70}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            {uniqueDiseases.map((disease, index) => (
              <Bar 
                key={disease} 
                dataKey={disease} 
                fill={COLORS[index % COLORS.length]} 
                name={disease}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}