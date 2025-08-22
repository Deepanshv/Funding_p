import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { Sidebar, Navbar } from './components';
import { CampaignDetails, CreateCampaign, Home, AdminLogin, AdminPanel, Favorites, Analytics } from './pages';

const App = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="flex">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        
        <div className="flex-1 lg:ml-64 flex flex-col h-screen">
          <div className="fixed top-0 right-0 left-0 lg:left-64 z-20">
            <Navbar />
          </div>
          <main className="flex-1 overflow-y-auto pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create-campaign" element={<CreateCampaign />} />
              <Route path="/campaign-details/:id" element={<CampaignDetails />} />
              <Route path="/campaign-details" element={<CampaignDetails />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  )
}


export default App