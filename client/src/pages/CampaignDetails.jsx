import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useStateContext } from '../context';
import { CountBox, CustomButton, Loader } from '../components';
import { calculateBarPercentage, daysLeft } from '../utils';
import { MoneyIcon } from '../components/Icons';

const CampaignDetails = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { donate, getDonations, contract, address } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [campaignData, setCampaignData] = useState(null);

  // Load campaign data
  useEffect(() => {
    const loadCampaignData = () => {
      if (state) {
        setCampaignData(state);
        return;
      }
      
      const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
      const campaign = campaigns.find(c => {
        const campaignId = c.id;
        const urlId = id;
        return campaignId.toString() === urlId || campaignId === parseInt(urlId) || campaignId === urlId;
      });
      
      setCampaignData(campaign || null);
    };
    
    loadCampaignData();
  }, [id, state]);


  
  if (campaignData === null) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-white mb-4">Campaign Not Found</h2>
        <p className="text-slate-400 mb-6">This campaign doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          ← Back to Home
        </button>
      </div>
    );
  }

  const remainingDays = daysLeft(campaignData.deadline);
  const percentage = calculateBarPercentage(campaignData.target, campaignData.amountCollected);

  const handleDonate = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    setShowQR(true);
  };

  const closeQR = () => {
    setShowQR(false);
    setAmount('');
  };

  const handleDonationDone = () => {
    // Update campaign amount in localStorage
    const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    const updatedCampaigns = campaigns.map(campaign => {
      if (campaign.id.toString() === id || campaign.id === parseInt(id)) {
        const currentAmount = parseInt(campaign.amountCollected) || 0;
        const donationAmountInt = parseInt(amount) || 0;
        const updatedCampaign = {
          ...campaign,
          amountCollected: (currentAmount + donationAmountInt).toString()
        };
        // Update local state immediately
        setCampaignData(updatedCampaign);
        return updatedCampaign;
      }
      return campaign;
    });
    
    localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));
    
    // Close QR and clear amount
    setShowQR(false);
    setAmount('');
  };

  return (
    <div className="space-y-10">
      {isLoading && <Loader />}

      {/* Campaign Header */}
      <div>
        <button 
          onClick={() => navigate(-1)}
          className="text-slate-400 hover:text-white mb-4"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-white mb-2">{campaignData.title}</h1>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Campaign Image and Progress */}
        <div className="lg:col-span-2 space-y-8">
          <div className="pro-card p-0 overflow-hidden">
            <img 
              src={campaignData.image} 
              alt={campaignData.title}
              className="w-full h-80 object-cover"
            />
            <div className="p-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Progress</span>
                <span className="text-white font-medium">{percentage}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div 
                  className="progress-bar h-3 rounded-full"
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Campaign Stats */}
          <div className="grid grid-cols-3 gap-4">
            <CountBox title="Days Left" value={remainingDays} />
            <CountBox title="Raised" value={`₹${campaignData.amountCollected}`} />
            <CountBox title="Donations" value={campaignData.amountCollected > 0 ? '1+' : '0'} />
          </div>

          {/* Campaign Story */}
          <div className="pro-card p-6">
            <h3 className="text-xl font-bold text-white mb-4">Campaign Story</h3>
            <p className="text-slate-300 leading-relaxed">{campaignData.description}</p>
          </div>


        </div>

        {/* Funding Panel */}
        <div className="space-y-8">
          {/* Donation Form */}
          <div className="pro-card p-6">
            <h3 className="text-lg font-bold text-white mb-4">💰 Donate to Campaign</h3>
            <div className="space-y-3">
              <input
                type="number"
                placeholder="Amount (₹)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                min="1"
              />
              <button
                onClick={handleDonate}
                disabled={!amount || parseFloat(amount) <= 0}
                className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                💰 Donate Now
              </button>
            </div>
          </div>
          {/* Creator Info */}
          <div className="pro-card p-6">
            <h3 className="text-lg font-bold text-white mb-4">Creator</h3>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {campaignData.owner?.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p 
                  className="text-white font-mono text-sm truncate cursor-pointer hover:text-blue-400" 
                  title={campaignData.owner}
                >
                  {campaignData.owner?.slice(0, 6)}...{campaignData.owner?.slice(-4)}
                </p>
                <p className="text-slate-400 text-xs">Campaign Creator</p>
              </div>
            </div>
          </div>


        </div>
      </div>
      
      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-xl max-w-sm w-full mx-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-4">Donate ₹{amount}</h3>
              <div className="bg-white p-4 rounded-lg mb-4">
                <img 
                  src={`https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=upi://pay?pa=campaign${id}@paytm%26pn=${encodeURIComponent(campaignData.title)}%26am=${amount}%26cu=INR`}
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
  )
}

export default CampaignDetails