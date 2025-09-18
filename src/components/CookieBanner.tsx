import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-orange-500 text-white p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <p className="text-sm md:text-base flex-1">
          Ce site utilise uniquement des cookies nécessaires à son bon fonctionnement (connexion, panier).
        </p>
        <Button
          onClick={handleAccept}
          variant="secondary"
          size="sm"
          className="bg-white text-orange-500 hover:bg-gray-100 whitespace-nowrap"
        >
          J'ai compris
        </Button>
        <Button
          onClick={handleAccept}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-orange-600 p-1"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};