import React, { useState, useRef, useEffect } from 'react';
import { TypewriterEffectSmooth } from '../components/ui/Types';
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigateTo = useNavigate();
  
  const [focusedField, setFocusedField] = useState(null);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [assistantActive, setAssistantActive] = useState(false);
  
  // Helper texts for assistant messages
  const helperTexts = {
    welcome: "Welcome! I'm here to help you create your account.",
    name: "Please enter your full name as it appears on official documents.",
    username: "Choose a unique username for your account.",
    email: "Great! Now enter a valid email address for verification.",
    password: "Create a strong password with at least 6 characters including numbers and special characters.",
    confirmPassword: "Please confirm your password to ensure it matches.",
    complete: "You're all set! Just click 'Sign up' to create your account."
  };
  
  // Scroll to bottom of messages when new ones are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  useEffect(() => {
    // Add initial welcome message
    setMessages([
      { text: helperTexts.welcome, type: 'assistant' }
    ]);
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setMessages(prev => [...prev, { 
        text: "Passwords don't match. Please try again.", 
        type: 'assistant' 
      }]);
      return;
    }

    if (formData.password.length < 6) {
      setMessages(prev => [...prev, { 
        text: "Password must be at least 6 characters long.", 
        type: 'assistant' 
      }]);
      return;
    }
    
    try {
      // Create submission data object (excluding confirmPassword)
      const submissionData = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password
      };
      
      // Replace with your actual API endpoint
      const response = await fetch('http://localhost:5000/api/v1/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });
  
      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, { 
          text: "Your account has been created successfully!", 
          type: 'assistant' 
        }]);
        navigateTo('/main'); // Redirect after successful registration
      } else {
        setMessages(prev => [...prev, { 
          text: data.message || "There was an issue creating your account. Please try again.", 
          type: 'assistant' 
        }]);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setMessages(prev => [...prev, { 
        text: "An error occurred while creating your account. Please try again later.", 
        type: 'assistant' 
      }]);
    }
  };
  
  const handleFieldFocus = (field) => {
    setFocusedField(field);
    if (field === 'name') {
      setAssistantActive(true);
    }
    // Add field-specific message to chat
    setMessages(prev => [...prev, { 
      text: helperTexts[field], 
      type: 'assistant' 
    }]);
  };
  
  const getTypewriterWords = (text) => {
    return [{ text, className: "text-green-500" }];
  };
  
  return (
    <div className="w-screen min-h-screen flex relative">
      {/* Background image covering the entire screen */}
      <div 
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: "url('/21.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="absolute inset-0 bg-black/20" /> {/* Overlay for better text visibility */}
      </div>
      
      {/* Left side - Content or Assistant */}
      <div className="w-1/2 relative z-10 flex flex-col">   
        {!assistantActive ? (
          // Initial content (Let's Get Started)
          <div className="p-16 h-full flex flex-col justify-center">
            <h1 className="text-7xl font-bold text-white mb-6">Let's Get Started</h1>
            <p className="text-gray-200 text-lg max-w-lg">
            We believe agriculture is more than just farming—it's the heartbeat of humanity. Our mission is to combine traditional wisdom with modern technology to revolutionize how food is grown, harvested, and distributed.
            </p>
          </div>
        ) : (
          // Assistant message area - shows when user interacts with form
          <div className="p-6 flex-1 flex flex-col justify-end">
            <div className="max-w-md mx-auto pb-70">
              {messages.map((message, index) => (
                <div key={index} className={`mb-2 ${message.type === 'assistant' ? 'ml-0' : 'ml-auto'}`}>
                  <div className={`p-3 rounded-lg ${message.type === 'assistant' ? 'bg-gray-800/80 text-white' : 'bg-green-600/80 text-white'}`}>
                    {index === messages.length - 1 ? (
                      <TypewriterEffectSmooth
                        words={getTypewriterWords(message.text)}
                        className="text-sm"
                      />
                    ) : (
                      <p className="text-sm">{message.text}</p>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>
      
      {/* Right side - Sign up form with transparency */}
      <div className="w-1/2 flex flex-col z-10">
        <div className="flex-1 overflow-y-auto p-12 mt-15">
          <div className="max-w-md mx-auto backdrop-blur-sm bg-black/40 p-8 rounded-lg ">
            <h2 className="text-3xl font-bold mb-8 text-white">Sign up</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  className="w-full px-0 py-3 bg-transparent border-t-0 border-l-0 border-r-0 border-b-2 border-gray-400 focus:border-green-500 focus:ring-0 focus:outline-none transition text-white placeholder-gray-300"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => handleFieldFocus('name')}
                  required
                />
              </div>
              
              <div>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="w-full px-0 py-3 bg-transparent border-t-0 border-l-0 border-r-0 border-b-2 border-gray-400 focus:border-green-500 focus:ring-0 focus:outline-none transition text-white placeholder-gray-300"
                  value={formData.username}
                  onChange={handleChange}
                  onFocus={() => handleFieldFocus('username')}
                  required
                />
              </div>
              
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  className="w-full px-0 py-3 bg-transparent border-t-0 border-l-0 border-r-0 border-b-2 border-gray-400 focus:border-green-500 focus:ring-0 focus:outline-none transition text-white placeholder-gray-300"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => handleFieldFocus('email')}
                  required
                />
              </div>
              
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Create Password"
                  className="w-full px-0 py-3 bg-transparent border-t-0 border-l-0 border-r-0 border-b-2 border-gray-400 focus:border-green-500 focus:ring-0 focus:outline-none transition text-white placeholder-gray-300"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => handleFieldFocus('password')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center text-gray-400 hover:text-gray-200 transition"
                  style={{ background: 'none', boxShadow: 'none' }}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </button>
              </div>
              
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Repeat password"
                  className="w-full px-0 py-3 bg-transparent border-t-0 border-l-0 border-r-0 border-b-2 border-gray-400 focus:border-green-500 focus:ring-0 focus:outline-none transition text-white placeholder-gray-300"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => handleFieldFocus('confirmPassword')}
                  required
                />
              </div>
              
              <div className="flex justify-between items-center pt-4">
                <p className="text-gray-300 text-sm">
                  Already a Member?
                </p>
                <a href="/signin" className="text-green-500 hover:text-green-400 text-sm">
                  Sign in here
                </a>
              </div>
              
              <button 
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-medium transition"
                onFocus={() => handleFieldFocus('complete')}
              >
                Sign up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;