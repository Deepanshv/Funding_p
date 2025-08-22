export const daysLeft = (deadline) => {
  const difference = new Date(deadline).getTime() - Date.now();
  const remainingDays = difference / (1000 * 3600 * 24);

  return Math.max(0, remainingDays.toFixed(0));
};

export const searchCampaigns = (campaigns, query) => {
  if (!query || !query.trim()) return campaigns;
  
  const searchTerm = query.toLowerCase().trim();
  return campaigns.filter(campaign => 
    campaign.title?.toLowerCase().includes(searchTerm) ||
    campaign.description?.toLowerCase().includes(searchTerm) ||
    campaign.owner?.toLowerCase().includes(searchTerm)
  );
};

export const calculateBarPercentage = (goal, raisedAmount) => {
  const percentage = Math.round((raisedAmount * 100) / goal);

  return percentage;
};

export const checkIfImage = (url, callback) => {
  // Basic URL validation first
  if (!url || typeof url !== 'string') {
    callback(false);
    return;
  }

  // Check if it's a valid URL format
  try {
    new URL(url);
  } catch {
    callback(false);
    return;
  }

  // Check if URL looks like an image
  const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i;
  const isImageUrl = imageExtensions.test(url) || url.includes('unsplash.com') || url.includes('images.');
  
  if (isImageUrl) {
    callback(true);
    return;
  }

  // Fallback to actual image loading test
  const img = new Image();
  img.crossOrigin = 'anonymous';
  
  const timeout = setTimeout(() => {
    callback(true); // Accept if loading takes too long
  }, 3000);

  img.onload = () => {
    clearTimeout(timeout);
    callback(true);
  };
  
  img.onerror = () => {
    clearTimeout(timeout);
    callback(false);
  };
  
  img.src = url;
};
