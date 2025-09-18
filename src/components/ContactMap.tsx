import React from 'react';
import { MapPin } from 'lucide-react';
const ContactMap = () => {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <MapPin className="h-4 w-4" />
      <span>Carte interactive bientôt disponible</span>
    </div>
  );
};
export default ContactMap;