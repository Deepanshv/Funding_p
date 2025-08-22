import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useStateContext } from '../context';
import { CustomButton } from './';
import { logo, menu, search } from '../assets';

const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { connect, address } = useStateContext();

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      // Navigate to home with search query
      navigate(`/?search=${encodeURIComponent(query)}`);
      setSearchQuery('');
    } else {
      // If empty search, go to home without search
      navigate('/');
    }
  };

  return (
    <nav className="bg-slate-800 border-b border-slate-700 px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="w-8 h-8" />
          <span className="text-xl font-bold text-white">CrowdFund</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pro-input w-full pl-4 pr-12 py-2 text-sm"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-slate-400 hover:text-white"
            >
              <img src={search} alt="Search" className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Link to="/admin-login">
            <CustomButton
              btnType="button"
              title="Admin Login"
              styles="pro-button px-4 py-2 text-sm"
            />
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white"
          >
            <img src={menu} alt="Menu" className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden mt-4 pt-4 border-t border-slate-700">
          <form onSubmit={handleSearch} className="mb-4">
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pro-input w-full px-4 py-2 text-sm"
            />
          </form>
        </div>
      )}
    </nav>
  )
}

export default Navbar