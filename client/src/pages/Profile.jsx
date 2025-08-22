import React, { useState, useEffect } from 'react'
import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context'

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const { address, contract, getUserCampaigns } = useStateContext();

  const fetchCampaigns = async () => {
    if (!contract || !address) return;
    
    setIsLoading(true);
    try {
      const data = await getUserCampaigns();
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching user campaigns:', error);
      setCampaigns([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchCampaigns();
  }, [contract, address]);

  if (!address) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
        <p className="text-slate-400">Please connect your wallet to view your campaigns</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="pro-card p-6">
        <h2 className="text-xl font-bold text-white mb-2">Profile</h2>
        <p className="text-slate-400 font-mono text-sm">{address}</p>
      </div>
      
      <DisplayCampaigns 
        title="My Campaigns"
        isLoading={isLoading}
        campaigns={campaigns}
      />
    </div>
  )
}

export default Profile