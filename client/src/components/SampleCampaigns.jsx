import React from 'react';
import { Link } from 'react-router-dom';
import FundCard from './FundCard';

const SampleCampaigns = () => {
  const sampleCampaigns = [
    {
      id: 1,
      title: "Advanced AI Assistant",
      description: "Building next-generation AI assistant for productivity and automation",
      raised: "0.7",
      target: "2.5",
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime(),
      amountCollected: "0.7",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500",
      owner: "0xE74B19D0da2Bfc42e89f88EdefB5525B15753074"
    },
    {
      id: 2,
      title: "Cloud Computing Platform",
      description: "Decentralized cloud storage and computing infrastructure",
      raised: "3.5",
      target: "7.5",
      deadline: new Date(Date.now() + 47 * 24 * 60 * 60 * 1000).getTime(),
      amountCollected: "3.5",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500",
      owner: "0x739F56dc3BD8c6c1f17f065372e24cf4cD4229bB"
    },
    {
      id: 3,
      title: "Smart Building IoT",
      description: "IoT-powered smart building management system",
      raised: "0.4",
      target: "12.0",
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).getTime(),
      amountCollected: "0.4",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
      owner: "0x739F56dc3BD8c6c1f17f065372e24cf4cD4229bB"
    },
    {
      id: 4,
      title: "Green Energy Solution",
      description: "Sustainable renewable energy generation platform",
      raised: "3.5",
      target: "7.5",
      deadline: new Date(Date.now() + 47 * 24 * 60 * 60 * 1000).getTime(),
      amountCollected: "3.5",
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=500",
      owner: "0x739F56dc3BD8c6c1f17f065372e24cf4cD4229bB"
    }
  ];

  const handleCampaignClick = (campaign) => {
    // Navigate to campaign details with campaign data
    window.location.href = `/campaign-details/${campaign.id}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {sampleCampaigns.map((campaign) => (
        <FundCard 
          key={campaign.id}
          {...campaign}
          handleClick={() => handleCampaignClick(campaign)}
        />
      ))}
    </div>
  );
};

export default SampleCampaigns;