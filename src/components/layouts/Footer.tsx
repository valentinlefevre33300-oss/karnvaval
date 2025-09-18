import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
export const Footer = () => {
  return <footer className="bg-brand-dark text-white bg-slate-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mx-0">
              
              <span className="text-xl font-bold text-gray-950 mx-0">Karnaval</span>
            </div>
            <p className="text-sm text-foreground">
              Votre destination premium pour des sneakers reconditionnées de qualité. 
              Style, durabilité et performance réunis.
            </p>
            <div className="flex space-x-4 bg-slate-100 mx-[10px]">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-brand-orange transition-colors cursor-pointer" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-brand-orange transition-colors cursor-pointer bg-slate-50" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-brand-orange transition-colors cursor-pointer" />
              <Mail className="h-5 w-5 text-gray-400 hover:text-brand-orange transition-colors cursor-pointer" />
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-slate-950">Navigation</h3>
            <ul className="space-y-2 text-foreground">
              <li><Link to="/" className="hover:text-brand-orange transition-colors">Accueil</Link></li>
              <li><Link to="/catalog" className="hover:text-brand-orange transition-colors">Catalogue</Link></li>
              <li><Link to="/about" className="hover:text-brand-orange transition-colors">À propos</Link></li>
              <li><Link to="/contact" className="hover:text-brand-orange transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          

          {/* Newsletter */}
          
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Karnaval. Tous droits réservés.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            
            <Link to="/conditions" className="text-gray-400 hover:text-brand-orange transition-colors text-sm">
              Conditions
            </Link>
            
          </div>
        </div>
      </div>
    </footer>;
};