import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const DEPLOY_BADGES = {
  ec2:        { label: 'EC2 + ASG',       color: 'bg-orange-500' },
  beanstalk:  { label: 'Elastic Beanstalk', color: 'bg-green-500' },
  ecs:        { label: 'ECS Fargate',     color: 'bg-purple-500' },
  eks:        { label: 'EKS + Helm',      color: 'bg-blue-500'   },
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const deployPlatform = import.meta.env.VITE_DEPLOY_PLATFORM?.toLowerCase();
  const badge = DEPLOY_BADGES[deployPlatform];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const cartItemCount = getItemCount();
  const isAdmin = user && user.role === 'admin';

  return (
    <nav className="bg-primary-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🛒</span>
            <span className="text-xl font-bold hidden sm:inline">DevOps E-Commerce</span>
            <span className="text-xl font-bold sm:hidden">DevOps</span>
            {badge && (
              <span className={`hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full text-white ${badge.color}`}>
                ☁️ {badge.label}
              </span>
            )}
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un produit..."
                className="w-full px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary-600 hover:text-primary-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Search Bar Expandable (Mobile/Tablet) */}
          {isSearchOpen && (
            <div className="lg:hidden pb-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un produit..."
                  className="w-full px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary-600 hover:text-primary-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>
          )}

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="hover:text-primary-200 transition">
              Accueil
            </Link>
            <Link to="/products" className="hover:text-primary-200 transition">
              Produits
            </Link>
            {user && (
              <Link to="/orders" className="hover:text-primary-200 transition">
                Mes commandes
              </Link>
            )}
            {isAdmin && (
              <Link 
                to="/admin" 
                className="bg-yellow-500 text-gray-900 px-3 py-1 rounded hover:bg-yellow-400 transition font-semibold"
              >
                👑 Admin
              </Link>
            )}
            
            {/* Search Icon (Tablet) */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="lg:hidden hover:text-primary-200 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart Link with Badge */}
            <Link to="/cart" className="relative hover:text-primary-200 transition">
              <span className="text-2xl">🛒</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/profile" className="hover:text-primary-200 transition whitespace-nowrap">
                  👤 {user.name}
                  {isAdmin && <span className="ml-1 text-yellow-300">(Admin)</span>}
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-white text-primary-600 px-4 py-2 rounded hover:bg-primary-50 transition whitespace-nowrap"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-primary-200 transition"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-primary-600 px-4 py-2 rounded hover:bg-primary-50 transition"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            {/* Search Icon Mobile */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hover:text-primary-200 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart Mobile */}
            <Link to="/cart" className="relative">
              <span className="text-2xl">🛒</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search Bar Expandable (Mobile/Tablet) */}
        {isSearchOpen && (
          <div className="lg:hidden pb-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un produit..."
                className="w-full px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary-600 hover:text-primary-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden px-4 pb-4">
        <div className="flex flex-col space-y-2">
          <Link to="/" className="hover:text-primary-200 transition py-2">
            Accueil
          </Link>
          <Link to="/products" className="hover:text-primary-200 transition py-2">
            Produits
          </Link>
          {user && (
            <>
              <Link to="/orders" className="hover:text-primary-200 transition py-2">
                Mes commandes
              </Link>
              {isAdmin && (
                <Link to="/admin" className="bg-yellow-500 text-gray-900 px-3 py-2 rounded hover:bg-yellow-400 transition font-semibold">
                  👑 Administration
                </Link>
              )}
              <Link to="/profile" className="hover:text-primary-200 transition py-2">
                👤 Mon Profil
              </Link>
              <button
                onClick={handleLogout}
                className="bg-white text-primary-600 px-4 py-2 rounded hover:bg-primary-50 transition text-left"
              >
                Déconnexion
              </button>
            </>
          )}
          {!user && (
            <>
              <Link to="/login" className="hover:text-primary-200 transition py-2">
                Connexion
              </Link>
              <Link to="/register" className="bg-white text-primary-600 px-3 py-2 rounded hover:bg-primary-50 transition text-center">
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
