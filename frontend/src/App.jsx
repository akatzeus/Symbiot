import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AgricultureMarqueeBg } from "./pages/Main";
import SignInPage from "./pages/signin";
import SignUp from "./pages/signup";
import DiseasePrediction from "./pages/test";
import AgricultureDashboard from "./pages/farmerDashboard";
import FarmerDataCollectionForm from "./pages/onboarding";
import Dashboard from './pages/Dashboard';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import Statistics from './pages/Statistics';
import FarmerDataDisplay from "./pages/Formdata";




function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AgricultureMarqueeBg/>}  />
        <Route path="/signin" element={<SignInPage/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/test"  element={<DiseasePrediction/>}/>
        <Route path="/agri-dash" element={<AgricultureDashboard/>}/>
        <Route path="/main" element={<FarmerDataCollectionForm/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/settings" element={<SettingsPage/>}/>
        <Route path="/stats" element={<Statistics/>}/>
        <Route path="/history" element={<HistoryPage/>}/>
        <Route path="/form-data" element={<FarmerDataDisplay/>}/>
      </Routes>
      </Router>
  );
};

export default App
