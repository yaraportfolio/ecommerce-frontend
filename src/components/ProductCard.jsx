import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/format';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const imageUrl = product.image_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&auto=format&fit=crop';

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      if (confirm('Vous devez être connecté pour ajouter au panier. Se connecter ?')) {
        navigate('/login', { state: { from: '/products' } });
      }
      return;
    }
    addToCart(product, 1);

    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-neutral-900 text-white px-6 py-3 text-sm font-medium shadow-lg z-50';
    toast.textContent = `${product.name} ajouté au panier`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 2000);
  };

  return (
    <div
      className="group cursor-pointer"
      onClick={() => navigate(`/products/${product.id}`)}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-100 aspect-square mb-4">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500 bg-white px-3 py-1">
              Rupture de stock
            </span>
          </div>
        )}
        {product.stock > 0 && product.stock < 5 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1">
            Plus que {product.stock} !
          </span>
        )}

        {/* Quick add - visible on hover */}
        {product.stock > 0 && (
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              className="w-full bg-neutral-900 text-white py-3 text-sm font-medium tracking-wide hover:bg-neutral-700 transition-colors"
            >
              Ajouter au panier
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <p className="text-xs text-neutral-400 uppercase tracking-widest mb-1">{product.category}</p>
        <h3 className="text-sm font-medium text-neutral-900 line-clamp-2 mb-2 group-hover:text-neutral-600 transition-colors">
          {product.name}
        </h3>
        <p className="font-semibold text-neutral-900">{formatPrice(product.price)}</p>
      </div>
    </div>
  );
}
