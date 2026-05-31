import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/format';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const categoryImages = {
    Electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
    Computers: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
    Smartphones: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    Tablets: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
    Audio: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    Wearables: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400',
  };

  const imageUrl = product.image_url || categoryImages[product.category] || 'https://via.placeholder.com/400';

  const handleAddToCart = (e) => {
    e.stopPropagation();
    
    // ✅ Vérifier si l'utilisateur est connecté
    if (!isAuthenticated) {
      // Demander à l'utilisateur de se connecter
      if (confirm('Vous devez être connecté pour ajouter des produits au panier. Voulez-vous vous connecter maintenant ?')) {
        navigate('/login', { state: { from: '/products', productId: product.id } });
      }
      return;
    }

    addToCart(product, 1);
    
    // Toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
    toast.textContent = `${product.name} ajouté au panier !`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('opacity-0', 'transition-opacity', 'duration-500');
      setTimeout(() => document.body.removeChild(toast), 500);
    }, 2000);
  };

  const handleViewDetails = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={handleViewDetails}
    >
      {/* Image */}
      <div className="relative h-64 bg-gray-200 overflow-hidden group">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {product.stock > 0 ? (
          <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            En stock
          </span>
        ) : (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Rupture
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <span className="text-xs text-primary-600 font-semibold uppercase tracking-wide">
          {product.category}
        </span>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mt-2 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Description - Tronquée avec tooltip */}
        <div className="relative group">
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>
          {product.description && product.description.length > 100 && (
            <div className="absolute hidden group-hover:block bottom-full left-0 right-0 mb-2 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
              {product.description}
            </div>
          )}
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-600">
            {formatPrice(product.price)}
          </span>
          
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              product.stock > 0
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {product.stock > 0 ? 'Ajouter' : 'Rupture'}
          </button>
        </div>

        {/* Stock warning */}
        {product.stock > 0 && product.stock < 10 && (
          <p className="text-xs text-orange-600 mt-2">
            Plus que {product.stock} en stock !
          </p>
        )}
      </div>
    </div>
  );
}
