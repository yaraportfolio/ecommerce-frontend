import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const DEPLOY_BADGES = {
  ec2:       { label: 'EC2',               color: 'bg-orange-500' },
  beanstalk: { label: 'Elastic Beanstalk', color: 'bg-green-500'  },
  ecs:       { label: 'ECS Fargate',       color: 'bg-purple-500' },
  eks:       { label: 'EKS + Helm',        color: 'bg-blue-500'   },
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

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
    }
  };

  const cartItemCount = getItemCount();
  const isAdmin = user?.role === 'admin';

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top banner */}
      <div className="bg-neutral-900 text-white text-center text-xs py-2 tracking-widest uppercase">
        Livraison gratuite dès 50€ d'achat
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <span className="text-2xl font-bold tracking-tight text-neutral-900">
              SHOP<span className="text-neutral-400">.</span>
            </span>
            {badge && (
              <span className={`hidden sm:inline-block text-xs font-medium px-2 py-0.5 rounded text-white ${badge.color}`}>
                {badge.label}
              </span>
            )}
          </Link>

          {/* Nav Links - Desktop */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
            <Link to="/" className="hover:text-neutral-900 transition-colors">Accueil</Link>
            <Link to="/products" className="hover:text-neutral-900 transition-colors">Produits</Link>
            {user && (
              <Link to="/orders" className="hover:text-neutral-900 transition-colors">Commandes</Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="text-amber-600 font-semibold hover:text-amber-700 transition-colors">
                Admin
              </Link>
            )}
          </nav>

          {/* Search + Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center border border-gray-200 rounded-full px-4 py-1.5 gap-2 bg-gray-50 focus-within:border-neutral-400 transition-colors">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                className="bg-transparent text-sm outline-none w-40 placeholder-gray-400"
              />
            </form>

            {/* Auth */}
            {user ? (
              <div className="hidden md:flex items-center gap-3 text-sm">
                <Link to="/profile" className="text-neutral-600 hover:text-neutral-900 transition-colors">
                  {user.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-neutral-400 hover:text-neutral-900 transition-colors text-xs uppercase tracking-wide"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3 text-sm">
                <Link to="/login" className="text-neutral-600 hover:text-neutral-900 transition-colors">Connexion</Link>
                <Link to="/register" className="bg-neutral-900 text-white px-4 py-1.5 text-sm hover:bg-neutral-700 transition-colors">
                  S'inscrire
                </Link>
              </div>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative p-1">
              <svg className="w-6 h-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-neutral-900 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-1">
              <svg className="w-6 h-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 flex flex-col gap-3 text-sm">
            <form onSubmit={handleSearch} className="flex items-center border border-gray-200 rounded-full px-4 py-2 gap-2 mb-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                className="bg-transparent text-sm outline-none flex-1"
              />
            </form>
            <Link to="/" onClick={() => setMenuOpen(false)} className="text-neutral-700 hover:text-neutral-900 py-1">Accueil</Link>
            <Link to="/products" onClick={() => setMenuOpen(false)} className="text-neutral-700 hover:text-neutral-900 py-1">Produits</Link>
            {user && <Link to="/orders" onClick={() => setMenuOpen(false)} className="text-neutral-700 hover:text-neutral-900 py-1">Commandes</Link>}
            {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-amber-600 font-semibold py-1">Admin</Link>}
            {user ? (
              <>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-neutral-700 py-1">{user.name}</Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="text-left text-neutral-400 py-1">Déconnexion</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="text-neutral-700 py-1">Connexion</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="bg-neutral-900 text-white text-center py-2">S'inscrire</Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
