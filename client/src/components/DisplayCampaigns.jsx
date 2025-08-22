import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";
import FundCard from './FundCard';
import SampleCampaigns from './SampleCampaigns';

const DisplayCampaigns = ({ title, isLoading, campaigns }) => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('recent');
  const [filterBy, setFilterBy] = useState('all');

  const handleNavigate = (campaign) => {
    // Use a more reliable ID system
    const campaignId = campaign.pId ?? campaign.id ?? Date.now();
    navigate(`/campaign-details/${campaignId}`, { state: campaign });
  }

  const handleSort = (value) => {
    setSortBy(value);
    // Sorting logic can be implemented here
    console.log('Sorting by:', value);
  };

  const handleFilter = (value) => {
    setFilterBy(value);
    // Filtering logic can be implemented here
    console.log('Filtering by:', value);
  };
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="text-slate-400 mt-1">
            {campaigns?.length || 0} campaigns found
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select 
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
            className="pro-input px-3 py-2 text-sm"
          >
            <option value="recent">Most Recent</option>
            <option value="funded">Most Funded</option>
            <option value="ending">Ending Soon</option>
          </select>
          
          <select 
            value={filterBy}
            onChange={(e) => handleFilter(e.target.value)}
            className="pro-input px-3 py-2 text-sm"
          >
            <option value="all">All Categories</option>
            <option value="technology">Technology</option>
            <option value="education">Education</option>
            <option value="healthcare">Healthcare</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="spinner w-8 h-8"></div>
          <span className="ml-3 text-slate-400">Loading campaigns...</span>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-6">💼</div>
          <h3 className="text-2xl font-bold text-white mb-4">No Campaigns Available</h3>
          <p className="text-slate-400 mb-8">There are currently no active campaigns. Check back later or contact an admin to create new campaigns.</p>
          <div className="bg-slate-800 rounded-lg p-6 max-w-md mx-auto">
            <h4 className="text-white font-semibold mb-2">Want to create a campaign?</h4>
            <p className="text-slate-400 text-sm mb-4">Only administrators can create campaigns</p>
            <a 
              href="/admin-login" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Admin Login
            </a>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {campaigns.map((campaign) => (
            <FundCard 
              key={uuidv4()}
              {...campaign}
              id={campaign.id || campaign.pId}
              handleClick={() => handleNavigate(campaign)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default DisplayCampaigns