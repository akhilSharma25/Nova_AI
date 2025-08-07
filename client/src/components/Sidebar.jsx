import { Protect, useClerk, useUser } from "@clerk/clerk-react";
import {
  Eraser,
  FileText,
  Hash,
  House,
  Image,
  LogOut,
  Scissors,
  SquarePen,
  Users,
} from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/ai", label: "Dashboard", Icon: House },
  { to: "/ai/write-article", label: "Write Article", Icon: SquarePen },
  { to: "/ai/blog-titles", label: "Blog Titles", Icon: Hash },
  { to: "/ai/generate-images", label: "Generate Images", Icon: Image },
  { to: "/ai/remove-background", label: "Remove Background", Icon: Eraser },
  { to: "/ai/remove-object", label: "Remove Object", Icon: Scissors },
  { to: "/ai/review-resume", label: "Review Resume", Icon: FileText },
  { to: "/ai/community", label: "Community", Icon: Users },
];

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <>
      {/* Background overlay for mobile screens */}
      {sidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebar(false)}
        />
      )}
      
      <div
        className={`
          fixed top-0 left-0 bottom-0 z-50 w-64 bg-white/95 backdrop-blur-md 
          border-r border-gray-200/80 flex flex-col justify-between
          transition-all duration-300 ease-in-out transform
          ${sidebar ? "translate-x-0 shadow-2xl" : "-translate-x-full shadow-none"}
          lg:translate-x-0 lg:static lg:bg-white lg:shadow-none lg:backdrop-blur-none
        `}
      >
        {/* Main Content Area */}
        <div className="overflow-y-auto h-full px-4 py-6">
          {/* User Profile Section */}
          <div className="flex flex-col items-center mb-8 p-4 rounded-xl bg-gray-50/50">
            <div className="relative">
              <img
                src={user?.imageUrl}
                alt={`${user?.fullName || 'User'} avatar`}
                className="w-16 h-16 rounded-full ring-2 ring-blue-100 object-cover"
                loading="lazy"
                onError={(e) => {
                  e.target.src = '/default-avatar.png'; // Fallback image
                }}
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <h2 className="mt-3 text-center text-sm font-semibold text-gray-900 truncate max-w-full">
              {user?.fullName || 'Loading...'}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              <Protect plan="premium" fallback="Free Plan">
                Premium Plan
              </Protect>
            </p>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2" role="navigation" aria-label="Main navigation">
            {navItems.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/ai"}
                onClick={() => setSidebar(false)}
                className={({ isActive }) =>
                  `
                    group flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium 
                    transition-all duration-200 ease-in-out relative overflow-hidden
                    ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-[1.02]"
                        : "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900 active:scale-[0.98]"
                    }
                  `
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>
                    )}
                    
                    <Icon
                      className={`
                        w-5 h-5 transition-colors duration-200
                        ${isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700"}
                      `}
                    />
                    <span className="truncate">{label}</span>
                    
                    {/* Hover effect */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg -z-10"></div>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer Section */}
        <div className="border-t border-gray-200/80 bg-gray-50/30 backdrop-blur-sm">
          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <img 
                src={user?.imageUrl} 
                alt={`${user?.fullName || 'User'} avatar`}
                className="w-10 h-10 rounded-full ring-2 ring-gray-200 object-cover flex-shrink-0"
                loading="lazy"
                onError={(e) => {
                  e.target.src = '/default-avatar.png';
                }}
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                  {user?.fullName || 'Loading...'}
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  <Protect plan="premium" fallback="Free Plan">
                    Premium User
                  </Protect>
                </p>
              </div>
            </div>
            
            <button
              onClick={signOut}
              className="
                p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 
                rounded-lg transition-all duration-200 flex-shrink-0
                focus:outline-none focus:ring-2 focus:ring-red-200
              "
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;