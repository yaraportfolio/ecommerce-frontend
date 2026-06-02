import { Link } from 'react-router-dom';

const categories = [
  {
    name: 'Électronique',
    slug: 'Electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop',
    count: 'Smartphones, laptops, audio'
  },
  {
    name: 'Vêtements',
    slug: 'Clothing',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop',
    count: 'Mode homme & femme'
  },
  {
    name: 'Maison',
    slug: 'Home',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop',
    count: 'Décoration, équipement'
  },
  {
    name: 'Livres',
    slug: 'Books',
    image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&auto=format&fit=crop',
    count: 'Romans, tech, développement'
  },
];

const perks = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12a2 2 0 002 2h8a2 2 0 002-2L19 8M10 12v4M14 12v4" />
      </svg>
    ),
    title: 'Livraison gratuite',
    desc: 'Dès 50€ d\'achat'
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: 'Retours 30 jours',
    desc: 'Satisfait ou remboursé'
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Paiement sécurisé',
    desc: 'Chiffrement SSL'
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: 'Support 7j/7',
    desc: 'On est là pour vous'
  },
];

export default function Home() {
  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="relative bg-neutral-900 text-white overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative container mx-auto px-4 py-32 lg:py-48">
          <p className="text-sm font-medium uppercase tracking-widest text-neutral-300 mb-4">Nouvelle collection</p>
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6 max-w-2xl">
            Découvrez notre sélection
          </h1>
          <p className="text-lg text-neutral-300 mb-10 max-w-xl">
            Des produits soigneusement sélectionnés pour vous, livrés directement chez vous.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/products"
              className="inline-block bg-white text-neutral-900 px-8 py-4 font-semibold tracking-wide hover:bg-neutral-100 transition-colors text-center"
            >
              Voir les produits
            </Link>
            <Link
              to="/register"
              className="inline-block border border-white text-white px-8 py-4 font-semibold tracking-wide hover:bg-white hover:text-neutral-900 transition-colors text-center"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100">
            {perks.map((perk, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-6">
                <div className="text-neutral-500 flex-shrink-0">{perk.icon}</div>
                <div>
                  <p className="font-semibold text-sm text-neutral-900">{perk.title}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{perk.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold text-neutral-900">Catégories</h2>
          <Link to="/products" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors underline underline-offset-4">
            Tout voir
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/products?category=${cat.slug}`}
              className="group relative overflow-hidden aspect-square bg-gray-100"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5">
                <p className="text-white font-bold text-lg">{cat.name}</p>
                <p className="text-neutral-300 text-xs mt-1">{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Promo banner */}
      <section className="bg-neutral-900 text-white">
        <div className="container mx-auto px-4 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-sm uppercase tracking-widest text-neutral-400 mb-2">Offre limitée</p>
            <h2 className="text-3xl font-bold mb-2">Jusqu'à -30% sur l'électronique</h2>
            <p className="text-neutral-400">Profitez de nos meilleures offres sur une sélection de produits tech.</p>
          </div>
          <Link
            to="/products?category=Electronics"
            className="flex-shrink-0 bg-white text-neutral-900 px-8 py-4 font-semibold tracking-wide hover:bg-neutral-100 transition-colors whitespace-nowrap"
          >
            Voir les offres
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Pas encore inscrit ?</h2>
        <p className="text-neutral-500 mb-8 max-w-md mx-auto">
          Créez un compte pour suivre vos commandes, sauvegarder vos favoris et profiter d'offres exclusives.
        </p>
        <Link to="/register" className="inline-block bg-neutral-900 text-white px-10 py-4 font-semibold hover:bg-neutral-700 transition-colors">
          Rejoindre la communauté
        </Link>
      </section>

    </div>
  );
}
