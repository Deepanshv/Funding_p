import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom';
import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context'
import { searchCampaigns } from '../utils'

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');

  const { address, contract, getCampaigns } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      let allCampaigns = [];
      
      // Get user created campaigns from localStorage
      const userCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
      
      // Get blockchain campaigns if contract is available
      if (contract && address) {
        const data = await getCampaigns();
        allCampaigns = data || [];
      }
      
      // Combine all campaigns
      const combinedCampaigns = [...userCampaigns, ...allCampaigns];
      
      // Apply search filter
      const filteredCampaigns = searchCampaigns(combinedCampaigns, searchQuery);
      
      setCampaigns(filteredCampaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setCampaigns([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchCampaigns();
  }, [contract, address, searchQuery]);

  // Listen for refresh parameter to reload campaigns
  useEffect(() => {
    const refreshParam = searchParams.get('refresh');
    if (refreshParam) {
      // Remove refresh param and reload
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('refresh');
      window.history.replaceState({}, '', `${window.location.pathname}${newParams.toString() ? '?' + newParams.toString() : ''}`);
      fetchCampaigns();
    }
  }, [searchParams]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== searchParams.get('search')) {
        fetchCampaigns();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <div>
      {searchQuery && (
        <div className="mb-6 p-4 bg-slate-800 rounded-lg">
          <p className="text-white">
            Search results for: <span className="font-bold text-blue-400">"{searchQuery}"</span>
          </p>
          <p className="text-slate-400 text-sm mt-1">{campaigns.length} campaigns found</p>
        </div>
      )}
      <DisplayCampaigns 
        title={searchQuery ? `Search Results` : "Active Campaigns"}
        isLoading={isLoading}
        campaigns={campaigns}
      />
    </div>
  )
}

export default Home