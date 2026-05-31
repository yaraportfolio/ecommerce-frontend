import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/api';
import api from '../../services/api';
import Loading from '../../components/Loading';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    lowStock: [],
    outOfStock: []
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [products, ordersResponse] = await Promise.all([
        productService.getAll(),
        api.get('/api/orders/all')
      ]);

      const orders = ordersResponse.data;
      const today = new Date().toDateString();

      const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
      const todayRevenue = orders
        .filter(o => new Date(o.created_at).toDateString() === today)
        .reduce((sum, order) => sum + parseFloat(order.total_amount), 0);

      const statusCounts = {
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length
      };

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        pendingOrders: statusCounts.pending,
        processingOrders: statusCounts.processing,
        shippedOrders: statusCounts.shipped,
        deliveredOrders: statusCounts.delivered,
        totalRevenue,
        todayRevenue,
        lowStock: products.filter(p => p.stock > 0 && p.stock < 10),
        outOfStock: products.filter(p => p.stock === 0)
      });

      setRecentOrders(orders.slice(0, 8));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  const orderCompletionRate = stats.totalOrders > 0 
    ? ((stats.deliveredOrders / stats.totalOrders) * 100).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header with Actions */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Tableau de Bord</h1>
            <p className="text-gray-600 mt-2">Bienvenue sur votre plateforme e-commerce</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/admin/products/new"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nouveau Produit
            </Link>
          </div>
        </div>

        {/* KPIs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Revenus Total */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-white text-opacity-80 text-sm font-medium">Revenus Total</p>
            <p className="text-3xl font-bold mt-2">{stats.totalRevenue.toFixed(2)}€</p>
            <p className="text-white text-opacity-70 text-xs mt-2">
              Aujourd'hui: {stats.todayRevenue.toFixed(2)}€
            </p>
          </div>

          {/* Commandes */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="text-2xl">📦</span>
            </div>
            <p className="text-white text-opacity-80 text-sm font-medium">Commandes Total</p>
            <p className="text-3xl font-bold mt-2">{stats.totalOrders}</p>
            <div className="flex gap-2 mt-2 text-xs">
              <span className="bg-white bg-opacity-20 px-2 py-1 rounded">{stats.pendingOrders} en attente</span>
              <span className="bg-white bg-opacity-20 px-2 py-1 rounded">{stats.deliveredOrders} livrées</span>
            </div>
          </div>

          {/* Produits */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span className="text-2xl">🛍️</span>
            </div>
            <p className="text-white text-opacity-80 text-sm font-medium">Produits</p>
            <p className="text-3xl font-bold mt-2">{stats.totalProducts}</p>
            <div className="flex gap-2 mt-2 text-xs">
              <span className="bg-red-500 bg-opacity-50 px-2 py-1 rounded">{stats.outOfStock.length} rupture</span>
              <span className="bg-orange-500 bg-opacity-50 px-2 py-1 rounded">{stats.lowStock.length} stock faible</span>
            </div>
          </div>

          {/* Taux de Complétion */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-2xl">✅</span>
            </div>
            <p className="text-white text-opacity-80 text-sm font-medium">Taux de Livraison</p>
            <p className="text-3xl font-bold mt-2">{orderCompletionRate}%</p>
            <p className="text-white text-opacity-70 text-xs mt-2">
              {stats.deliveredOrders} sur {stats.totalOrders} commandes
            </p>
          </div>
        </div>

        {/* Pipeline Commandes */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Pipeline des Commandes</h2>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'En Attente', count: stats.pendingOrders, color: 'orange', icon: '⏳' },
              { label: 'En Traitement', count: stats.processingOrders, color: 'blue', icon: '⚙️' },
              { label: 'Expédiées', count: stats.shippedOrders, color: 'purple', icon: '🚚' },
              { label: 'Livrées', count: stats.deliveredOrders, color: 'green', icon: '✅' }
            ].map((stage, index) => (
              <div key={index} className="relative">
                <div className={`bg-${stage.color}-50 border-2 border-${stage.color}-200 rounded-xl p-6 text-center hover:shadow-md transition`}>
                  <div className="text-4xl mb-2">{stage.icon}</div>
                  <p className={`text-3xl font-bold text-${stage.color}-600`}>{stage.count}</p>
                  <p className="text-sm text-gray-600 mt-2">{stage.label}</p>
                </div>
                {index < 3 && (
                  <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 text-gray-300 text-2xl">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Commandes Récentes (2 colonnes) */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Commandes Récentes</h2>
              <Link to="/admin/orders" className="text-primary-600 hover:underline text-sm">
                Voir tout →
              </Link>
            </div>
            <div className="p-6">
              {recentOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucune commande</p>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary-100 p-3 rounded-lg">
                          <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">#{order.id}</p>
                          <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleString('fr-FR')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{parseFloat(order.total_amount).toFixed(2)}€</p>
                        <span className={`text-xs px-3 py-1 rounded-full ${
                          order.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {order.status === 'pending' ? 'En attente' :
                           order.status === 'processing' ? 'En traitement' :
                           order.status === 'shipped' ? 'Expédiée' : 'Livrée'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Alertes Stock (1 colonne) */}
          <div className="bg-white rounded-2xl shadow-lg">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Alertes Stock</h2>
            </div>
            <div className="p-6">
              {/* Rupture de Stock */}
              {stats.outOfStock.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🚨</span>
                    <h3 className="font-semibold text-red-600">Rupture de Stock ({stats.outOfStock.length})</h3>
                  </div>
                  <div className="space-y-2">
                    {stats.outOfStock.slice(0, 3).map((product) => (
                      <div key={product.id} className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                        <Link 
                          to={`/admin/products/${product.id}/edit`}
                          className="text-xs text-primary-600 hover:underline"
                        >
                          Réapprovisionner →
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Faible */}
              {stats.lowStock.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">⚠️</span>
                    <h3 className="font-semibold text-orange-600">Stock Faible ({stats.lowStock.length})</h3>
                  </div>
                  <div className="space-y-2">
                    {stats.lowStock.slice(0, 3).map((product) => (
                      <div key={product.id} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-orange-600">{product.stock} unités restantes</span>
                          <Link 
                            to={`/admin/products/${product.id}/edit`}
                            className="text-xs text-primary-600 hover:underline"
                          >
                            Gérer →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {stats.outOfStock.length === 0 && stats.lowStock.length === 0 && (
                <div className="text-center py-8">
                  <span className="text-6xl">✅</span>
                  <p className="text-gray-500 mt-4">Tous les stocks sont OK</p>
                </div>
              )}

              <Link to="/admin/products" className="block text-center text-primary-600 hover:underline mt-6 text-sm">
                Gérer tous les produits →
              </Link>
            </div>
          </div>
        </div>

        {/* Actions Rapides (Bottom) */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Link to="/admin/orders" className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white hover:shadow-xl transition transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Gérer les Commandes</h3>
                <p className="text-sm text-white text-opacity-80 mt-2">Traiter et expédier</p>
              </div>
              <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </Link>

          <Link to="/admin/products" className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white hover:shadow-xl transition transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Gérer les Produits</h3>
                <p className="text-sm text-white text-opacity-80 mt-2">Catalogue complet</p>
              </div>
              <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </Link>

          <Link to="/admin/reviews" className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white hover:shadow-xl transition transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Modérer les Avis</h3>
                <p className="text-sm text-white text-opacity-80 mt-2">Avis clients</p>
              </div>
              <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
