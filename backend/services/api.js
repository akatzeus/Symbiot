// services/api.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const submitFarmerData = async (formData) => {
  try {
    const response = await fetch(`${API_URL}/farmers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if using protected routes
        // 'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit data');
    }
    
    return data;
  } catch (error) {
    console.error('Error submitting farmer data:', error);
    throw error;
  }
};