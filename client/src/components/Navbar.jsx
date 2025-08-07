import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useClerk, useUser, UserButton } from '@clerk/clerk-react';

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk();

  return (
    <nav className="fixed h-21 top-0 left-0 right-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-gray-200/60 shadow-lg">
      <div className="flex justify-between items-center py-3 px-6 sm:py-3.5 sm:px-12 lg:px-20 xl:px-32 max-w-8xl mx-auto">
        {/* Logo Section */}
        <div className="flex items-center">
          <img
            src="NovaAI-removebg-preview.png"
            alt="NovaAI Logo"
            className="h-16 sm:h-18 lg:h-20 w-auto cursor-pointer object-contain transition-transform duration-300 hover:scale-110 drop-shadow-sm"
            onClick={() => navigate("/")}
            loading="lazy"
            onError={(e) => {
              e.target.src = '/fallback-logo.png'; // Fallback logo
            }}
          />
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              {/* User greeting for larger screens */}
              <span className="hidden md:block text-base font-medium text-gray-700 bg-gray-100 px-4 py-2 rounded-full">
                Hi, {user.firstName || 'User'}! 👋
              </span>
              
              {/* Clerk UserButton with custom styling */}
              <div className="relative">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-12 h-12 ring-3 ring-blue-200 hover:ring-blue-300 transition-all duration-300 shadow-lg",
                      userButtonPopoverCard: "shadow-2xl border border-gray-200 backdrop-blur-xl bg-white/95",
                    }
                  }}
                  showName={false}
                  userProfileMode="navigation"
                  userProfileUrl="/user-profile"
                />
              </div>
            </div>
          ) : (
            <button
              onClick={openSignIn}
              className="
                group relative flex items-center gap-2.5 rounded-xl text-base font-semibold cursor-pointer
                bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 
                hover:from-blue-700 hover:via-purple-700 hover:to-pink-700
                text-white px-6 py-3 sm:px-8 sm:py-3
                shadow-xl hover:shadow-2xl
                transform transition-all duration-300 ease-out
                hover:scale-105 active:scale-95
                focus:outline-none focus:ring-4 focus:ring-purple-300
                border border-white/20 hover:border-white/30
                backdrop-blur-sm
                before:absolute before:inset-0 before:rounded-xl before:bg-white/10 before:opacity-0
                hover:before:opacity-100 before:transition-opacity before:duration-300
              "
              aria-label="Sign in to get started"
            >
              <span className="relative z-10">Get Started</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              
              {/* Enhanced glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-300 -z-10 scale-110"></div>
              
              {/* Animated background shimmer */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
            </button>
          )}
        </div>
      </div>

      {/* Optional: Progress bar or loading indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></div>
    </nav>
  );
};

export default Navbar;