import { UserButton, useUser } from '@clerk/clerk-react';
import { ArrowRight, Menu, X } from 'lucide-react';
import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets';
import Sidebar from '../components/Sidebar';

const Layout = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [sidebar, setSidebar] = useState(false)

  return (
    <div className='flex flex-col items-start justify-start h-screen bg-gray-50/30'>
      <nav className='w-full px-6 sm:px-8 min-h-16 flex items-center justify-between border-b border-gray-200/60 bg-white/80 backdrop-blur-sm shadow-sm'>
        
        {/* Beautiful NovaAI Text Logo */}
        <div 
          className='cursor-pointer group flex items-center gap-1 select-none'
          onClick={() => navigate("/")}
        >
          <span className='text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300'>
            Nova
          </span>
          <span className='text-2xl sm:text-3xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-300'>
            AI
          </span>
          
          {/* Subtle glow effect */}
          <div className='absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10'></div>
          
          {/* Optional: Small AI indicator dot */}
          <div className='w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full ml-1 animate-pulse opacity-60'></div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className='flex items-center gap-4'>
          {/* User Button (hidden on mobile when sidebar menu is shown) */}
          <div className='hidden sm:block'>
            {user && <UserButton />}
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebar(!sidebar)}
            className='sm:hidden p-2 rounded-lg hover:bg-gray-100/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200'
            aria-label={sidebar ? 'Close menu' : 'Open menu'}
          >
            {sidebar ? 
              <X className='w-6 h-6 text-gray-700 hover:text-gray-900 transition-colors duration-200' /> : 
              <Menu className='w-6 h-6 text-gray-700 hover:text-gray-900 transition-colors duration-200' />
            }
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className='flex-1 flex w-full h-[calc(100vh-64px)] relative'>
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
        
        {/* Main Content */}
        <main className='flex-1 bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0] overflow-auto'>
          <div className='h-full w-full'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout