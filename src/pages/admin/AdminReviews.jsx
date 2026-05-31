import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService, reviewService } from '../../services/api';
import { formatDate } from '../../utils/format';
import Loading from '../../components/Loading';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Récupérer tous les produits
      const productsData = await productService.getAll();
      setProducts(productsData);

      // Récupérer tous les avis de tous les produits
      const allReviews = [];
      for (const product of productsData) {
        try {
          const productReviews = await reviewService.getByProduct(product.id);
          if (Array.isArray(productReviews)) {
            allReviews.push(...productReviews.map(review => ({
              ...review,
              product_name: product.name
            })));
          }
        } catch (error) {
          console.error(`Error fetching reviews for product ${product.id}:`, error);
        }
      }

      // Trier par date décroissante
      allReviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setReviews(allReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) {
      return;
    }

    try {
      await reviewService.delete(reviewId);
      setReviews(reviews.filter(r => r.id !== reviewId));
      alert('Avis supprimé avec succès');
    } catch (error) {
      alert('Erreur lors de la suppression de l\'avis');
      console.error(error);
    }
  };

  const filteredReviews = filterRating === 'all'
    ? reviews
    : reviews.filter(review => review.rating === parseInt(filterRating));

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Modération des Avis</h1>
          <p className="text-gray-600 mt-2">{reviews.length} avis au total</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-gray-900">{reviews.length}</div>
            <div className="text-gray-600 mt-1">Total avis</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold text-yellow-600">{averageRating}</div>
              <span className="text-yellow-500 text-2xl">⭐</span>
            </div>
            <div className="text-gray-600 mt-1">Note moyenne</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600">
              {reviews.filter(r => r.rating >= 4).length}
            </div>
            <div className="text-gray-600 mt-1">Avis positifs</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-red-600">
              {reviews.filter(r => r.rating <= 2).length}
            </div>
            <div className="text-gray-600 mt-1">Avis négatifs</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <label className="block text-gray-700 font-medium mb-2">Filtrer par note</label>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterRating('all')}
              className={`px-4 py-2 rounded ${
                filterRating === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Toutes
            </button>
            {[5, 4, 3, 2, 1].map(rating => (
              <button
                key={rating}
                onClick={() => setFilterRating(rating.toString())}
                className={`px-4 py-2 rounded flex items-center gap-1 ${
                  filterRating === rating.toString()
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {rating} ⭐
              </button>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
              Aucun avis trouvé
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-yellow-500 text-xl">
                        {'⭐'.repeat(review.rating)}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {formatDate(review.created_at)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {review.product_name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Par: {review.user_name || `User #${review.user_id}`}
                    </p>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="text-red-600 hover:text-red-700 px-4 py-2 border border-red-600 rounded hover:bg-red-50 transition"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 text-sm">
                  <span className="text-gray-500">Produit ID: #{review.product_id}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-500">Avis ID: #{review.id}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Back Link */}
        <div className="mt-6">
          <Link
            to="/admin"
            className="text-primary-600 hover:underline flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour au dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
