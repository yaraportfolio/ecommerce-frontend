import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <p className="text-2xl font-bold tracking-tight mb-4">SHOP<span className="text-neutral-500">.</span></p>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Votre destination shopping en ligne. Des milliers de produits, des prix compétitifs, livrés chez vous.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-semibold text-sm uppercase tracking-widest mb-5 text-neutral-300">Navigation</p>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li><Link to="/" className="hover:text-white transition-colors">Accueil</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Produits</Link></li>
              <li><Link to="/orders" className="hover:text-white transition-colors">Mes commandes</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">Mon compte</Link></li>
            </ul>
          </div>

          {/* Catégories */}
          <div>
            <p className="font-semibold text-sm uppercase tracking-widest mb-5 text-neutral-300">Catégories</p>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li><Link to="/products?category=Electronics" className="hover:text-white transition-colors">Électronique</Link></li>
              <li><Link to="/products?category=Clothing" className="hover:text-white transition-colors">Vêtements</Link></li>
              <li><Link to="/products?category=Home" className="hover:text-white transition-colors">Maison</Link></li>
              <li><Link to="/products?category=Books" className="hover:text-white transition-colors">Livres</Link></li>
            </ul>
          </div>

          {/* Aide */}
          <div>
            <p className="font-semibold text-sm uppercase tracking-widest mb-5 text-neutral-300">Aide</p>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li><span className="hover:text-white transition-colors cursor-default">Livraison & retours</span></li>
              <li><span className="hover:text-white transition-colors cursor-default">FAQ</span></li>
              <li><span className="hover:text-white transition-colors cursor-default">Contact</span></li>
              <li><span className="hover:text-white transition-colors cursor-default">Mentions légales</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>&copy; {new Date().getFullYear()} SHOP. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <span>Politique de confidentialité</span>
            <span>CGU</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
