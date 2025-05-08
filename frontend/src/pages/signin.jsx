import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignInPage = () => {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Phone number validation (basic check)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      setError("Please enter a valid 10-digit phone number");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include" // Important to include cookies
      });

      const data = await response.json();
      
      if (response.ok) {
        // Successful login
        navigate("/main"); // Navigate to main page after login
      } else {
        // Failed login
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle forgot password (can be expanded to send OTP for password reset)
  const handleForgotPassword = async () => {
    if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber)) {
      setError("Please enter a valid phone number to reset your password");
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/v1/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: formData.phoneNumber }),
      });

      const data = await response.json();
      
      if (response.ok) {
        navigate(`/reset-password?phone=${formData.phoneNumber}`);
      } else {
        setError(data.message || "Could not process password reset request.");
      }
    } catch (err) {
      console.error("Password reset error:", err);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-full flex flex-col overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url("/24.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />
      
      {/* Overlay to darken the background slightly */}
      <div className="absolute inset-0 bg-black/20 z-10"></div>
      
      {/* Content Container */}
      <div className="relative z-20 w-full h-full flex flex-col justify-between p-8 text-white">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-light">KrisiPath</h1>
          <div className="flex gap-6">
            <button 
              className="hover:opacity-80 transition"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </button>
          </div>
        </div>
        
        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto w-full flex flex-col gap-6">
          {error && (
            <div className="bg-red-500/70 text-white p-3 rounded text-center">
              {error}
            </div>
          )}
          
          <div className="relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/70" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </div>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              pattern="[0-9]{10}"
              className="w-full bg-transparent border-b border-white/40 py-2 pl-8 pr-4 outline-none focus:border-white/70 transition text-white placeholder:text-white/60"
              required
            />
          </div>
          
          <div className="relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/70" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-transparent border-b border-white/40 py-2 pl-8 pr-4 outline-none focus:border-white/70 transition text-white placeholder:text-white/60"
              required
            />
          </div>
          
          <div className="flex justify-end">
            <button 
              type="button"
              onClick={handleForgotPassword}
              className="text-white/70 hover:text-white text-sm"
            >
              Forgot Password?
            </button>
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className={`${
              loading ? 'bg-gray-600/70' : 'bg-gray-800/70 hover:bg-gray-800/90'
            } text-white py-3 px-6 rounded-full flex items-center justify-center gap-2 transition-all mt-4`}
          >
            {loading ? "Signing in..." : "Sign In"}
            {!loading && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </form>
        
        {/* Footer */}
        <div className="text-center text-sm text-white/70">
          <p>Created by a team of agri-enthusiasts.</p>
          <p>Inspired by the resilience of rural communities.</p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;