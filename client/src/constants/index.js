import { createCampaign, dashboard, logout, payment, profile, withdraw } from '../assets';

export const navlinks = [
  {
    name: 'dashboard',
    imgUrl: dashboard,
    link: '/',
    iconType: 'dashboard'
  },
  {
    name: 'favorites',
    imgUrl: '❤️',
    link: '/favorites',
    iconType: 'heart'
  },
  {
    name: 'analytics',
    imgUrl: '📊',
    link: '/analytics',
    iconType: 'chart'
  },

];
