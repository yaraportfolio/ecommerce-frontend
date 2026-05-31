import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Récupérer le paramètre de recherche depuis l'URL
  const searchQuery = searchParams.get('search') || '';
  
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      let response;
      
      // Si recherche active
      if (searchQuery) {
        response = await axios.get(`/api/products/search?q=${searchQuery}`);
      } else if (selectedCategory === 'all') {
        response = await axios.get('/api/products');
      } else {
        response = await axios.get(`/api/products/category/${selectedCategory}`);
      }
      
      setProducts(response.data);
      setError(null);
      setLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement des produits');
      setLoading(false);
    }
  };
  
  // Obtenir toutes les catégories depuis les produits (seulement si pas de recherche)
  const categories = searchQuery 
    ? ['all']
    : ['all', ...new Set(products.map(p => p.category))];
  
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);
  
  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-center text-red-600 mt-10">{error}</div>
  );
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Nos Produits</h1>
      
      {/* Bandeau résultats de recherche */}
      {searchQuery && (
        <div className="mb-6 bg-blue-100 border border-blue-300 text-blue-700 px-4 py-3 rounded-lg">
          <div className="flex items-center justify-between">
            <span>
              Résultats pour <strong>"{searchQuery}"</strong> : {products.length} produit{products.length > 1 ? 's' : ''}
            </span>
            <button
              onClick={() => navigate('/products')}
              className="text-blue-700 hover:text-blue-900 underline font-medium"
            >
              ✕ Effacer la recherche
            </button>
          </div>
        </div>
      )}
      
      {/* Filtres catégories (masqué pendant recherche) */}
      {!searchQuery && (
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {cat === 'all' ? 'Tous' : cat}
            </button>
          ))}
        </div>
      )}
      
      {/* Grille de produits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {/* Message si aucun résultat */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 text-lg mb-2">
            {searchQuery 
              ? `Aucun produit trouvé pour "${searchQuery}"`
              : 'Aucun produit dans cette catégorie'
            }
          </p>
          {searchQuery && (
            <button
              onClick={() => navigate('/products')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Voir tous les produits
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;
