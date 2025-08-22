import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { SettingsIcon, RocketIcon, PlusIcon, CloseIcon, LogoutIcon, ChartIcon, DocumentIcon, LocationIcon, SearchIcon, EditIcon, DeleteIcon, MoneyIcon } from '../components/Icons';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    description: '',
    target: '',
    deadline: '',
    image: '',
    address: '',
    location: null
  });

  // Zip code to location mapping
  const getLocationFromZip = (zipCode) => {
    const zipMap = {
      '10001': { city: 'New York', country: 'USA', lat: 40.7505, lng: -73.9934 },
      '90210': { city: 'Beverly Hills', country: 'USA', lat: 34.0901, lng: -118.4065 },
      'SW1A 1AA': { city: 'London', country: 'UK', lat: 51.5014, lng: -0.1419 },
      '75001': { city: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
      '100-0001': { city: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
      '10115': { city: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050 },
      '2000': { city: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 },
      'M5V 3A8': { city: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832 }
    };
    return zipMap[zipCode] || { city: 'Unknown', country: 'Global', lat: 0, lng: 0 };
  };

  useEffect(() => {
    // Check if user is admin
    if (!localStorage.getItem('isAdmin')) {
      navigate('/admin-login');
      return;
    }
    
    // Load campaigns
    const savedCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    setCampaigns(savedCampaigns);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  const handleCreateCampaign = () => {
    if (!newCampaign.title.trim()) {
      alert('Please enter a campaign title');
      return;
    }

    if (editingCampaign) {
      // Update existing campaign
      const updatedCampaigns = campaigns.map(c => 
        c.id === editingCampaign.id 
          ? {
              ...c,
              title: newCampaign.title.trim(),
              description: newCampaign.description.trim() || 'No description provided',
              target: newCampaign.target || '50000',
              deadline: newCampaign.deadline ? new Date(newCampaign.deadline).getTime() : c.deadline,
              image: newCampaign.image.trim() || c.image,
              address: newCampaign.address.trim(),
              location: newCampaign.location || c.location
            }
          : c
      );
      setCampaigns(updatedCampaigns);
      localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));
      alert('✅ Campaign updated successfully!');
    } else {
      // Create new campaign
      const campaign = {
        id: Date.now(),
        title: newCampaign.title.trim(),
        description: newCampaign.description.trim() || 'No description provided',
        target: newCampaign.target || '50000',
        deadline: newCampaign.deadline ? new Date(newCampaign.deadline).getTime() : Date.now() + (30 * 24 * 60 * 60 * 1000),
        amountCollected: '0',
        image: newCampaign.image.trim() || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
        address: newCampaign.address.trim(),
        location: newCampaign.location || { city: 'Global', country: '', lat: 0, lng: 0 },
        owner: 'Admin'
      };
      const updatedCampaigns = [...campaigns, campaign];
      setCampaigns(updatedCampaigns);
      localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));
      alert('✅ Campaign created successfully!');
    }
    
    // Reset form
    setNewCampaign({ title: '', description: '', target: '', deadline: '', image: '', address: '', location: null });
    setEditingCampaign(null);
    setShowCreateForm(false);
  };

  const handleDeleteCampaign = (id) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      const updatedCampaigns = campaigns.filter(c => c.id !== id);
      setCampaigns(updatedCampaigns);
      localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));
      alert('Campaign deleted successfully!');
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Professional Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-8 mb-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
              <SettingsIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Admin Dashboard</h1>
              <p className="text-slate-300">Campaign Management & Analytics</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-slate-400">
                <span>📈 {campaigns.length} Total Campaigns</span>
                <span>•</span>
                <span>🔄 Last updated: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button 
              onClick={() => {
                setShowCreateForm(!showCreateForm);
                if (showCreateForm) {
                  setEditingCampaign(null);
                  setNewCampaign({ title: '', description: '', target: '', deadline: '', image: '', address: '', location: null });
                }
              }}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg"
            >
              {showCreateForm ? <CloseIcon className="w-5 h-5" /> : <PlusIcon className="w-5 h-5" />}
              <span>{showCreateForm ? 'Cancel' : (editingCampaign ? 'Cancel Edit' : 'Create Campaign')}</span>
            </button>
            <button 
              onClick={() => {
                if (confirm('⚠️ This will delete ALL campaign data. Are you sure?')) {
                  localStorage.clear();
                  localStorage.removeItem('campaigns');
                  localStorage.removeItem('favorites');
                  setCampaigns([]);
                  window.location.reload();
                }
              }}
              className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg"
            >
              <span>🗑️</span>
              <span>Clear All Data</span>
            </button>
            <button 
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg"
            >
              <LogoutIcon className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Create Campaign Form */}
      {showCreateForm && (
        <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-xl p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <RocketIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Create New Campaign</h2>
                <p className="text-blue-100 text-sm">Fill in the details to launch your campaign</p>
              </div>
            </div>
          </div>
          <div className="p-8">
          <div className="space-y-8">
            {/* Campaign Basics Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-600">
                <DocumentIcon className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Campaign Information</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">
                    Campaign Title *
                  </label>
                  <input 
                    type="text"
                    placeholder="Enter a compelling campaign title"
                    value={newCampaign.title}
                    onChange={(e) => setNewCampaign({...newCampaign, title: e.target.value})}
                    className="pro-input px-4 py-3 w-full bg-slate-700 border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300 flex items-center space-x-2">
                    <span className="text-green-400 font-semibold">INR</span>
                    <span>Funding Target *</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="number"
                      step="1000"
                      min="1000"
                      placeholder="50000"
                      value={newCampaign.target}
                      onChange={(e) => setNewCampaign({...newCampaign, target: e.target.value})}
                      className="pro-input px-4 py-3 w-full bg-slate-700 border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      required
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <span className="text-slate-400 text-sm">INR</span>
                    </div>
                  </div>
                </div>
              </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input 
                  type="text"
                  placeholder="Enter address or zip code"
                  value={newCampaign.address || ''}
                  onChange={(e) => setNewCampaign({...newCampaign, address: e.target.value})}
                  className="pro-input px-4 py-3"
                />
                <button
                  type="button"
                  onClick={() => {
                    const address = newCampaign.address.trim();
                    if (!address) {
                      alert('Please enter an address or zip code first');
                      return;
                    }
                    
                    // Indian cities zip code to location mapping
                    const zipMap = {
                      '110001': { city: 'New Delhi', country: 'India', lat: 28.6139, lng: 77.2090, fullAddress: 'New Delhi, Delhi 110001, India' },
                      '400001': { city: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777, fullAddress: 'Mumbai, Maharashtra 400001, India' },
                      '560001': { city: 'Bangalore', country: 'India', lat: 12.9716, lng: 77.5946, fullAddress: 'Bangalore, Karnataka 560001, India' },
                      '600001': { city: 'Chennai', country: 'India', lat: 13.0827, lng: 80.2707, fullAddress: 'Chennai, Tamil Nadu 600001, India' },
                      '700001': { city: 'Kolkata', country: 'India', lat: 22.5726, lng: 88.3639, fullAddress: 'Kolkata, West Bengal 700001, India' },
                      '500001': { city: 'Hyderabad', country: 'India', lat: 17.3850, lng: 78.4867, fullAddress: 'Hyderabad, Telangana 500001, India' },
                      '411001': { city: 'Pune', country: 'India', lat: 18.5204, lng: 73.8567, fullAddress: 'Pune, Maharashtra 411001, India' },
                      '380001': { city: 'Ahmedabad', country: 'India', lat: 23.0225, lng: 72.5714, fullAddress: 'Ahmedabad, Gujarat 380001, India' }
                    };
                    
                    const location = zipMap[address] || zipMap[Object.keys(zipMap).find(zip => 
                      address.toLowerCase().includes(zipMap[zip].city.toLowerCase())
                    )];
                    
                    if (location) {
                      setNewCampaign(prev => ({
                        ...prev,
                        address: location.fullAddress,
                        location: location
                      }));
                    } else {
                      alert('Location not found. Try: 110001, 400001, 560001, 600001, 700001, 500001, 411001, 380001');
                    }
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg"
                >
                  🔍 Search Location
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition((position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        
                        // Find closest Indian city from GPS coordinates
                        const indianCities = [
                          { city: 'New Delhi', country: 'India', lat: 28.6139, lng: 77.2090, fullAddress: 'New Delhi, Delhi, India' },
                          { city: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777, fullAddress: 'Mumbai, Maharashtra, India' },
                          { city: 'Bangalore', country: 'India', lat: 12.9716, lng: 77.5946, fullAddress: 'Bangalore, Karnataka, India' },
                          { city: 'Chennai', country: 'India', lat: 13.0827, lng: 80.2707, fullAddress: 'Chennai, Tamil Nadu, India' },
                          { city: 'Kolkata', country: 'India', lat: 22.5726, lng: 88.3639, fullAddress: 'Kolkata, West Bengal, India' },
                          { city: 'Hyderabad', country: 'India', lat: 17.3850, lng: 78.4867, fullAddress: 'Hyderabad, Telangana, India' }
                        ];
                        
                        let closest = indianCities[0];
                        let minDistance = Math.abs(lat - closest.lat) + Math.abs(lng - closest.lng);
                        
                        indianCities.forEach(city => {
                          const distance = Math.abs(lat - city.lat) + Math.abs(lng - city.lng);
                          if (distance < minDistance) {
                            minDistance = distance;
                            closest = city;
                          }
                        });
                        
                        setNewCampaign(prev => ({
                          ...prev,
                          address: `Near ${closest.fullAddress}`,
                          location: { ...closest, lat, lng }
                        }));
                      }, (error) => {
                        alert('Location access denied. Please use zip code search.');
                      });
                    } else {
                      alert('Geolocation not supported. Please use zip code search.');
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg"
                >
                  📍 My Location
                </button>
              </div>
              
              {newCampaign.location && (
                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3">
                  <div className="text-sm text-green-400 mb-2">
                    ✓ Location set: {newCampaign.location.city}, {newCampaign.location.country}
                  </div>
                  <div className="text-xs text-slate-400">
                    Address: {newCampaign.address}
                  </div>
                </div>
              )}
              
              {/* Simple Map Preview */}
              {newCampaign.location && (
                <div className="bg-slate-600 rounded-lg p-3">
                  <h5 className="text-white font-medium text-sm mb-2">🗺️ Location Preview</h5>
                  <div className="bg-slate-800 rounded p-4 text-center">
                    <div className="text-4xl mb-2">🌍</div>
                    <div className="text-white font-medium">{newCampaign.location.city}</div>
                    <div className="text-slate-400 text-sm">{newCampaign.location.country}</div>
                    <div className="text-xs text-slate-500 mt-2">
                      Lat: {newCampaign.location.lat.toFixed(4)}, Lng: {newCampaign.location.lng.toFixed(4)}
                    </div>
                  </div>
                </div>
              )}
            </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Campaign Description *
                </label>
                <textarea 
                  placeholder="Describe your campaign goals, how funds will be used, and what supporters can expect..."
                  value={newCampaign.description}
                  onChange={(e) => setNewCampaign({...newCampaign, description: e.target.value})}
                  className="pro-input px-4 py-3 w-full h-32 resize-none bg-slate-700 border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  maxLength={500}
                  required
                />
                <div className="text-xs text-slate-400 text-right">
                  {newCampaign.description?.length || 0}/500 characters
                </div>
              </div>
            </div>
            
            {/* Smart Location Section */}
            
            {/* Deadline and Image Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Campaign Deadline</label>
                <input 
                  type="date"
                  min={minDate}
                  value={newCampaign.deadline}
                  onChange={(e) => setNewCampaign({...newCampaign, deadline: e.target.value})}
                  className="pro-input px-4 py-3 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Campaign Image URL</label>
                <input 
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={newCampaign.image}
                  onChange={(e) => setNewCampaign({...newCampaign, image: e.target.value})}
                  className="pro-input px-4 py-3 w-full"
                />
              </div>
            </div>
            
            {/* Quick Zip Code Examples */}
            <div className="bg-slate-700 rounded-lg p-3">
              <h5 className="text-white font-medium text-sm mb-2">📍 Quick Location Examples</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                {[
                  { zip: '110001', city: 'New Delhi' },
                  { zip: '400001', city: 'Mumbai' },
                  { zip: '560001', city: 'Bangalore' },
                  { zip: '600001', city: 'Chennai' },
                  { zip: '700001', city: 'Kolkata' },
                  { zip: '500001', city: 'Hyderabad' },
                  { zip: '411001', city: 'Pune' },
                  { zip: '380001', city: 'Ahmedabad' }
                ].map((item) => (
                  <button
                    key={item.zip}
                    type="button"
                    onClick={() => setNewCampaign({...newCampaign, address: item.zip})}
                    className="bg-slate-600 hover:bg-slate-500 text-slate-300 px-2 py-1 rounded text-left transition-colors"
                  >
                    <div className="font-medium">{item.zip}</div>
                    <div className="text-slate-400">{item.city}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-600">
            <div className="text-sm text-slate-400">
              {newCampaign.location ? `✓ ${newCampaign.location.city}, ${newCampaign.location.country}` : '⚠️ Enter location using zip code or GPS'}
            </div>
            <button 
              onClick={handleCreateCampaign}
              disabled={!newCampaign.title.trim()}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-all"
            >
              🚀 Create Campaign
            </button>
          </div>
        </div>
        </div>
      )}

      {/* Campaigns Management Section */}
      <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-t-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Campaign Management</h2>
                <p className="text-purple-100 text-sm">{campaigns.length} total campaigns</p>
              </div>
            </div>
            <div className="bg-white/20 rounded-lg px-3 py-1">
              <span className="text-white text-sm font-medium">Active: {campaigns.length}</span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {campaigns.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-white mb-2">No Campaigns Yet</h3>
              <p className="text-slate-400 mb-6">Create your first campaign to get started</p>
              <button 
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-all"
              >
                🚀 Create First Campaign
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign, index) => (
                <div key={campaign.id} className="bg-slate-700 rounded-xl p-6 border border-slate-600 hover:border-slate-500 transition-all duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        <img 
                          src={campaign.image} 
                          alt={campaign.title}
                          className="w-20 h-20 object-cover rounded-xl shadow-lg"
                        />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-white">{campaign.title}</h3>
                          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">Active</span>
                        </div>
                        <p className="text-slate-300 text-sm line-clamp-2">{campaign.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center space-x-1 text-blue-400">
                            <span>💰</span>
                            <span>Target: ₹{campaign.target}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-green-400">
                            <span>📍</span>
                            <span>{campaign.address || `${campaign.location?.city || 'Global'}, ${campaign.location?.country || ''}`}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-slate-400">
                            <span>📅</span>
                            <span>Created: {new Date(campaign.id).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                      <button 
                        onClick={() => {
                          setEditingCampaign(campaign);
                          setNewCampaign({
                            title: campaign.title,
                            description: campaign.description,
                            target: campaign.target,
                            deadline: campaign.deadline ? new Date(campaign.deadline).toISOString().split('T')[0] : '',
                            image: campaign.image,
                            address: campaign.address,
                            location: campaign.location
                          });
                          setShowCreateForm(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                      >
                        <EditIcon className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button 
                        onClick={() => handleDeleteCampaign(campaign.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                      >
                        <span>🗑️</span>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPanel