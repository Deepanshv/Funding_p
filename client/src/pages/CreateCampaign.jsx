import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../context';
import { RocketIcon, MoneyIcon } from '../components/Icons';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const { address } = useStateContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is admin
  React.useEffect(() => {
    if (!localStorage.getItem('isAdmin')) {
      alert('⚠️ Only admins can create campaigns. Please login as admin.');
      navigate('/admin-login');
    }
  }, [navigate]);

  // Get tomorrow's date as minimum
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const sampleImages = [
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800'
  ];

  const handleCreate = () => {
    if (!title.trim()) {
      alert('Please enter a campaign title');
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
      
      const finalImage = image.trim() || sampleImages[Math.floor(Math.random() * sampleImages.length)];
      
      const newCampaign = {
        id: Date.now(),
        title: title.trim(),
        description: description.trim() || 'No description provided',
        target: target || '50000',
        deadline: deadline ? new Date(deadline).getTime() : Date.now() + (30 * 24 * 60 * 60 * 1000),
        amountCollected: '0',
        image: finalImage,
        location: { city: 'Global', country: '', lat: 0, lng: 0 },
        owner: address || '0x' + Math.random().toString(16).substr(2, 40)
      };
      
      console.log('Image URL being saved:', finalImage);
      
      campaigns.push(newCampaign);
      localStorage.setItem('campaigns', JSON.stringify(campaigns));
      
      setIsLoading(false);
      alert('🎉 Campaign created successfully!');
      navigate('/');
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center space-x-2">
          <RocketIcon className="w-8 h-8" />
          <span>Create Your Campaign</span>
        </h1>
        <p className="text-slate-400">Launch your project and start raising funds from the community</p>
      </div>
      
      <div className="pro-card p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Campaign Title *</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="pro-input w-full px-4 py-3"
              placeholder="Enter an engaging campaign title"
              maxLength={100}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2 flex items-center space-x-2">
              <span className="text-green-400 font-semibold">INR</span>
              <span>Funding Goal</span>
            </label>
            <input 
              type="number"
              step="1000"
              min="1000"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="pro-input w-full px-4 py-3"
              placeholder="50000"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white mb-2">Campaign Description</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="pro-input w-full px-4 py-3 h-32 resize-none"
            placeholder="Describe your project, goals, and how the funds will be used..."
            maxLength={500}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Campaign Deadline</label>
            <input 
              type="date"
              value={deadline}
              min={minDate}
              onChange={(e) => setDeadline(e.target.value)}
              className="pro-input w-full px-4 py-3"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">Campaign Image URL</label>
            <input 
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="pro-input w-full px-4 py-3"
              placeholder="https://example.com/image.jpg (optional)"
            />
          </div>
        </div>
        
        <div className="bg-slate-700 rounded-lg p-4">
          <h3 className="text-white font-medium mb-2 flex items-center space-x-2">
            <span className="text-yellow-400">⚡</span>
            <span>Tips for Success</span>
          </h3>
          <ul className="text-slate-300 text-sm space-y-1">
            <li>• Write a clear, compelling title that explains your project</li>
            <li>• Set a realistic funding goal based on your actual needs</li>
            <li>• Provide detailed description of how funds will be used</li>
            <li>• Choose an appropriate deadline (30-60 days recommended)</li>
          </ul>
        </div>
        
        <div className="flex justify-end pt-4">
          <button 
            onClick={handleCreate}
            disabled={isLoading || !title.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-8 py-3 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-2">
              <RocketIcon className="w-4 h-4" />
              <span>{isLoading ? 'Creating...' : 'Launch Campaign'}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateCampaign