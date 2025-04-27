"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ThreeDMarquee } from "../components/3d";

export function AgricultureMarqueeBg() {
  const navigate = useNavigate(); 
  
  // ===== REPLACE THESE IMAGE PATHS WITH YOUR OWN =====
  // For best results, use 21-24 images in 16:9 aspect ratio
  const images = [
    "/1.jpg", // Image 1 - Replace with your own path
    "/2.jpg",
    "/3.jpg",
    "/4.jpg",
    "/5.jpg",
    "/6.png", // Image 3 - Replace with your own path
    "/7.png", // Image 4 - Replace with your own path
    "/8.jpg",
    "/9.jpg",
    "/10.jpeg",
    "/11.jpeg",
    "/12.jpeg",
    "/13.jpeg",
    "/14.jpeg",
    "/15.jpeg",
    "/16.jpeg",
    "/17.jpeg",
    "/18.jpeg",
    "/19.jpeg",
    "/20.jpeg",
    "/1.jpg", // Image 1 - Replace with your own path
    "/2.jpg",
    "/3.jpg",
    "/4.jpg",
    "/5.jpg",
    "/6.png", // Image 3 - Replace with your own path
    "/7.png", // Image 4 - Replace with your own path
    "/8.jpg",
    "/9.jpg",
    "/10.jpeg",
    "/11.jpeg",
    "/12.jpeg",
    "/13.jpeg",
    "/14.jpeg",
    "/15.jpeg",
    "/16.jpeg",
    "/17.jpeg",
    "/18.jpeg",
    "/19.jpeg",
    "/20.jpeg",
    
  ];
  // ===================================================

  // Instructions for adding your own images:
  // 1. Place your image files in your project's public directory or other accessible location
  // 2. Replace the paths above with the correct paths to your images
  // 3. Make sure your images are optimized for web (recommended size: 1200x675 pixels)
  // 4. For best results, use 21-24 images with consistent aspect ratios

  return (
    <div className="relative w-screen h-screen flex flex-col items-center justify-center overflow-hidden bg-green-950">
      <div className="relative z-20 flex flex-col items-center justify-center w-full max-w-7xl px-4 py-16">
        <h2 className="mx-auto max-w-4xl text-center text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
          Transform Your Farming with{" "}
          <span className="relative inline-block rounded-xl bg-green-500/40 px-4 py-1 text-white underline decoration-lime-400 decoration-4 underline-offset-8 backdrop-blur-sm">
            AgriTech
          </span>
        </h2>
        <p className="mx-auto max-w-2xl py-8 text-center text-base text-neutral-200 lg:text-lg">
          Revolutionize your agricultural practices with data-driven insights and smart farming technology.
          Increase yields, reduce costs, and promote sustainability with our innovative agricultural solutions.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            className="rounded-md bg-green-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-green-950 focus:outline-none"
            onClick={() => navigate('/signin')} 
          >
            Get Started
          </button>
          <button className="rounded-md border border-white/20 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-green-950 focus:outline-none">
            Learn More
          </button>
        </div>
      </div>
      <div className="absolute inset-0 z-10 h-full w-full bg-green-950/70" />
      <ThreeDMarquee className="pointer-events-none absolute inset-0 h-full w-full" images={images} />
    </div>
  );
}