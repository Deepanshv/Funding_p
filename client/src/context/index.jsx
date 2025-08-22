import React, { useContext, createContext } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract('0x4124E341d149b7F1DE550888042Ad7b64c275a2E');
  const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');

  const address = useAddress();
  const connect = useMetamask();

  const handleConnect = async () => {
    try {
      await connect();
      return true;
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    }
  };

  const publishCampaign = async (form) => {
    if (!contract || !address) {
      throw new Error('Please connect your wallet first');
    }

    try {
      const data = await createCampaign({
        args: [
          address, // owner
          form.title, // title
          form.description, // description
          form.target,
          new Date(form.deadline).getTime(), // deadline,
          form.image,
        ],
      });

      console.log("Campaign created successfully", data);
      return data;
    } catch (error) {
      console.error("Failed to create campaign", error);
      throw error;
    }
  }

  const getCampaigns = async () => {
    if (!contract) return [];
    
    try {
      const campaigns = await contract.call('getCampaigns');
      const parsedCampaigns = campaigns.map((campaign, i) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: ethers.utils.formatEther(campaign.target.toString()),
        deadline: campaign.deadline.toNumber(),
        amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
        image: campaign.image,
        pId: i
      }));
      return parsedCampaigns;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return [];
    }
  }

  const getUserCampaigns = async () => {
    if (!contract || !address) return [];
    
    try {
      const allCampaigns = await getCampaigns();
      const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);
      return filteredCampaigns;
    } catch (error) {
      console.error('Error fetching user campaigns:', error);
      return [];
    }
  }

  const donate = async (pId, amount) => {
    if (!contract || !address) throw new Error('Contract not available');
    
    try {
      const data = await contract.call('donateToCampaign', [pId], { 
        value: ethers.utils.parseEther(amount)
      });
      return data;
    } catch (error) {
      console.error('Error donating:', error);
      throw error;
    }
  }

  const getDonations = async (pId) => {
    if (!contract) return [];
    
    try {
      const donations = await contract.call('getDonators', [pId]);
      const numberOfDonations = donations[0].length;
      const parsedDonations = [];

      for(let i = 0; i < numberOfDonations; i++) {
        parsedDonations.push({
          donator: donations[0][i],
          donation: ethers.utils.formatEther(donations[1][i].toString())
        })
      }
      return parsedDonations;
    } catch (error) {
      console.error('Error fetching donations:', error);
      return [];
    }
  }


  return (
    <StateContext.Provider
      value={{ 
        address,
        contract,
        connect: handleConnect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);