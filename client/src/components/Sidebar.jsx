import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { navlinks } from '../constants';
import { DashboardIcon, HeartIcon, ChartIcon, UserIcon } from './Icons';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 min-h-screen fixed left-0 top-0 z-10">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Navigation</h2>
        
        <nav className="space-y-2">
          {navlinks.map((link) => (
            <button
              key={link.name}
              onClick={() => navigate(link.link)}
              disabled={link.disabled}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                isActive(link.link)
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              } ${link.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {link.iconType === 'dashboard' && <DashboardIcon className="w-5 h-5" />}
              {link.iconType === 'heart' && <HeartIcon className="w-5 h-5" />}
              {link.iconType === 'chart' && <ChartIcon className="w-5 h-5" />}
              {link.iconType === 'user' && <UserIcon className="w-5 h-5" />}
              <span className="capitalize font-medium">{link.name}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;