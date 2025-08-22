import React, { useState, useEffect } from 'react'
import { DisplayCampaigns } from '../components';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const allCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    
    const favoriteCampaigns = allCampaigns.filter(campaign => 
      savedFavorites.includes(campaign.id)
    );
    
    setFavorites(favoriteCampaigns);
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">❤️ My Favorites</h1>
        <p className="text-slate-400">Campaigns you've bookmarked for later</p>
      </div>
      
      <DisplayCampaigns 
        title="Favorite Campaigns"
        isLoading={isLoading}
        campaigns={favorites}
      />
    </div>
  )
}

export default Favorites