import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService, reviewService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatPrice, formatDate } from '../utils/format';
import Loading from '../components/Loading';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Review form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchProductAndReviews();
  }, [id]);

  const fetchProductAndReviews = async () => {
    try {
      setLoading(true);
      const [productData, reviewsData] = await Promise.all([
        productService.getById(id),
        reviewService.getByProduct(id)
      ]);
      setProduct(productData);
      setReviews(reviewsData || []);
      setError(null);
    } catch (err) {
      setError('Impossible de charger les détails du produit.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      if (confirm('Vous devez être connecté pour ajouter au panier. Se connecter maintenant ?')) {
        navigate('/login', { state: { from: `/products/${id}` } });
      }
      return;
    }
    
    addToCart(product, quantity);
    
    // Toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
    toast.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
          <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/>
        </svg>
        <span>${quantity}x ${product.name} ajouté au panier !</span>
      </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.5s';
      setTimeout(() => {
        if (toast.parentNode) {
          document.body.removeChild(toast);
        }
      }, 500);
    }, 3000);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      if (confirm('Vous devez être connecté pour laisser un avis. Se connecter maintenant ?')) {
        navigate('/login', { state: { from: `/products/${id}` } });
      }
      return;
    }

    try {
      await reviewService.create({
        product_id: parseInt(id),
        rating: newReview.rating,
        comment: newReview.comment
      });
      setShowReviewForm(false);
      setNewReview({ rating: 5, comment: '' });
      fetchProductAndReviews();
      
      // Toast succès
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      toast.textContent = 'Avis publié avec succès !';
      document.body.appendChild(toast);
      setTimeout(() => {
        if (toast.parentNode) document.body.removeChild(toast);
      }, 3000);
    } catch (err) {
      alert('Impossible de publier l\'avis. Veuillez réessayer.');
      console.error('Review error:', err);
    }
  };

  if (loading) return <Loading />;

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Produit introuvable'}
        </div>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700"
        >
          Retour aux Produits
        </button>
      </div>
    );
  }

  const categoryImages = {
    Computers: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600',
    Smartphones: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600',
    Tablets: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600',
    Audio: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    Wearables: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600',
    Electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600',
  };

  const imageUrl = product.image_url || categoryImages[product.category] || 'https://via.placeholder.com/600';

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Image */}
            <div>
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600?text=Image+non+disponible';
                }}
              />
            </div>

            {/* Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center mb-4">
                <span className="text-yellow-500 text-xl mr-2">
                  {'⭐'.repeat(Math.round(averageRating))}
                </span>
                <span className="text-gray-600">
                  {averageRating} ({reviews.length} avis)
                </span>
              </div>

              <div className="mb-4">
                <span className="inline-block bg-primary-100 text-primary-700 px-4 py-1 rounded-full text-sm font-medium">
                  {product.category}
                </span>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-primary-600">
                  {formatPrice(product.price)}
                </span>
              </div>

              <div className="mb-6">
                <span className={`text-lg font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `En stock (${product.stock} disponible${product.stock > 1 ? 's' : ''})` : 'Rupture de stock'}
                </span>
              </div>

              {/* Quantity & Add to Cart */}
              {product.stock > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <label className="text-gray-700 font-medium">Quantité :</label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-gray-100 transition"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                      className="w-16 text-center border-x border-gray-300 py-2"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-4 py-2 hover:bg-gray-100 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold text-lg transition flex items-center justify-center gap-2 ${
                    product.stock > 0
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                  </svg>
                  {product.stock > 0 ? 'Ajouter au Panier' : 'Rupture de stock'}
                </button>
                
                {product.stock > 0 && isAuthenticated && (
                  <button
                    onClick={() => {
                      addToCart(product, quantity);
                      navigate('/cart');
                    }}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    Commander
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Avis Clients</h2>
            {isAuthenticated && !showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition"
              >
                Écrire un Avis
              </button>
            )}
            {!isAuthenticated && (
              <button
                onClick={() => navigate('/login', { state: { from: `/products/${id}` } })}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Se connecter pour donner un avis
              </button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-lg mb-4">Donnez votre avis</h3>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Note</label>
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                >
                  <option value={5}>5 - Excellent ⭐⭐⭐⭐⭐</option>
                  <option value={4}>4 - Très bien ⭐⭐⭐⭐</option>
                  <option value={3}>3 - Bien ⭐⭐⭐</option>
                  <option value={2}>2 - Moyen ⭐⭐</option>
                  <option value={1}>1 - Médiocre ⭐</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Commentaire</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                  placeholder="Partagez votre expérience avec ce produit..."
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700 transition"
                >
                  Publier l'Avis
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewForm(false);
                    setNewReview({ rating: 5, comment: '' });
                  }}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 transition"
                >
                  Annuler
                </button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <p className="text-gray-500 text-lg">Aucun avis pour le moment</p>
              <p className="text-gray-400 text-sm mt-2">Soyez le premier à donner votre avis !</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-yellow-500 text-lg">
                        {'⭐'.repeat(review.rating)}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {formatDate(review.created_at)}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}