import React, { useState } from 'react';
import { daysLeft, calculateBarPercentage } from '../utils';
import { HeartIcon, LocationIcon } from './Icons';

const FundCard = ({ owner, title, description, target, deadline, amountCollected, image, handleClick, id, location, address }) => {
  const remainingDays = daysLeft(deadline);
  const percentage = calculateBarPercentage(target, amountCollected);
  const [imgError, setImgError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.includes(id);
  });
  const [donationAmount, setDonationAmount] = useState('');
  const [showQR, setShowQR] = useState(false);
  
  const fallbackImage = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800';

  const toggleFavorite = (e) => {
    e.stopPropagation();
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      const newFavorites = favorites.filter(fav => fav !== id);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setIsFavorite(false);
    } else {
      favorites.push(id);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  const handleDonate = (e) => {
    e.stopPropagation();
    if (donationAmount && parseFloat(donationAmount) > 0) {
      setShowQR(true);
    }
  };

  const closeQR = (e) => {
    e.stopPropagation();
    setShowQR(false);
    setDonationAmount('');
  };

  const handleDonationDone = (e) => {
    e.stopPropagation();
    
    // Update campaign amount in localStorage
    const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    const updatedCampaigns = campaigns.map(campaign => {
      if (campaign.id === id) {
        const currentAmount = parseInt(campaign.amountCollected) || 0;
        const donationAmountInt = parseInt(donationAmount) || 0;
        return {
          ...campaign,
          amountCollected: (currentAmount + donationAmountInt).toString()
        };
      }
      return campaign;
    });
    
    localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));
    
    // Close QR and refresh page to show updated amounts
    setShowQR(false);
    setDonationAmount('');
    window.location.reload();
  };

  return (
    <div 
      className="pro-card p-5 cursor-pointer animate-fadeIn"
      onClick={handleClick}
    >
      <div className="relative mb-5">
        <img 
          src={imgError ? fallbackImage : image} 
          alt={title}
          className="w-full h-48 object-cover rounded-lg"
          onError={() => setImgError(true)}
          onLoad={() => setImgError(false)}
        />
        <div className="absolute top-3 right-3 flex space-x-2">
          <button 
            onClick={toggleFavorite}
            className={`p-2 rounded-full transition-colors ${
              isFavorite ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <HeartIcon className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Active
          </span>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
            {title}
          </h3>
          <p className="text-slate-400 text-sm line-clamp-3">
            {description}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Progress</span>
            <span className="text-white font-medium">{percentage}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="progress-bar h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wide">Raised</p>
            <p className="text-white font-semibold">₹{amountCollected}</p>
            <p className="text-slate-500 text-xs">of ₹{target}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wide">Time Left</p>
            <p className="text-white font-semibold">{remainingDays} days</p>
          </div>
        </div>

        <div className="pt-5 border-t border-slate-700 space-y-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-xs font-medium text-white">
                {owner?.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-400 text-xs">Creator</p>
              <p 
                className="text-white text-sm font-mono truncate cursor-pointer hover:text-blue-400" 
                title={owner}
              >
                {owner?.slice(0, 6)}...{owner?.slice(-4)}
              </p>
            </div>
          </div>
          
          {(address || (location && location.city)) && (
            <div className="flex items-center text-slate-400 text-sm">
              <LocationIcon className="w-4 h-4 mr-2" />
              <span>{address || `${location.city}${location.country ? `, ${location.country}` : ''}`}</span>
            </div>
          )}
          
          {/* Donation Section */}
          <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
            <input
              type="number"
              placeholder="Amount (₹)"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-green-500"
              min="1"
            />
            <button
              onClick={handleDonate}
              disabled={!donationAmount || parseFloat(donationAmount) <= 0}
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
            >
              💰 Donate
            </button>
          </div>
        </div>
        
        {/* QR Code Modal */}
        {showQR && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeQR}
          >
            <div 
              className="bg-slate-800 p-6 rounded-xl max-w-sm w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-4">Donate ₹{donationAmount}</h3>
                <div className="bg-white p-4 rounded-lg mb-4">
                  <img 
                    src={`https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=upi://pay?pa=campaign${id}@paytm%26pn=${encodeURIComponent(title)}%26am=${donationAmount}%26cu=INR`}
                    alt="QR Code"
                    className="w-48 h-48 mx-auto"
                  />
                </div>
                <p className="text-slate-400 text-sm mb-4">Scan with any UPI app to donate</p>
                <div className="flex gap-2">
                  <button
                    onClick={closeQR}
                    className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDonationDone}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    Donation Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FundCard;