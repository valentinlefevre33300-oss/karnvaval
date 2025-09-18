import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react';

const OrderSuccess = () => {
  // In a real app, you would get the order details from the URL params or state
  const orderNumber = "KRN-" + Math.random().toString(36).substr(2, 9).toUpperCase();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Commande confirmée !
          </h1>
          <p className="text-muted-foreground mb-6">
            Merci pour votre achat. Votre commande a été traitée avec succès.
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-lg font-semibold">
                <Package className="h-5 w-5" />
                Commande #{orderNumber}
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  Un email de confirmation vous a été envoyé
                </div>
                <div className="text-muted-foreground">
                  Temps de livraison estimé : 3-5 jours ouvrés
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link to="/catalogue">
              Continuer le shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="w-full">
            <Link to="/">
              Retour à l'accueil
            </Link>
          </Button>
        </div>

        <div className="mt-12 p-6 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">Besoin d'aide ?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Notre équipe est là pour vous aider si vous avez des questions sur votre commande.
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link to="/contact">
              Nous contacter
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;