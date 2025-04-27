// import axios from "axios";

// const RPI_IP = 'http://192.168.197.124:5000';

// async function testConnection() {
//   try {
//     console.log('Attempting to connect to Raspberry Pi...');
//     const response = await axios.get(`${RPI_IP}/get-disease`);
//     console.log('Connection successful!');
//     console.log('Response data:', response.data);
//   } catch (error) {
//     console.error('Connection failed!');
//     if (error.response) {
//       // The request was made and the server responded with a status code
//       console.error('Response status:', error.response.status);
//       console.error('Response data:', error.response.data);
//     } else if (error.request) {
//       // The request was made but no response was received
//       console.error('No response received. Check if the Raspberry Pi server is running.');
//     } else {
//       // Something happened in setting up the request
//       console.error('Error setting up request:', error.message);
//     }
//   }
// }

// testConnection();