import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Shield, Users, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Product, parseProductSizes, getProductSlug } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { OptimizedImage } from '@/components/OptimizedImage';
import HomeCarousel from '@/components/HomeCarousel';
const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { authUser } = useAuth();
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const {
          data,
          error
        } = await supabase
          .from('products')
          .select('*')
          .neq('stock_quantity', '0')
          .limit(8);
        if (error) throw error;
        setFeaturedProducts(data || []);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);
  const features = useMemo(() => [{
    icon: Shield,
    title: "Authenticité garantie",
    description: "Tous nos produits sont vérifiés par nos experts"
  }, {
    icon: TrendingUp,
    title: "Prix compétitifs",
    description: "Les meilleurs prix du marché pour des sneakers premium"
  }, {
    icon: Users,
    title: "Communauté passionnée",
    description: "Rejoignez des milliers de sneakerheads comme vous"
  }], []);
  
  const stats = useMemo(() => [{
    label: "Produits vendus",
    value: "10K+"
  }, {
    label: "Clients satisfaits",
    value: "5K+"
  }, {
    label: "Marques partenaires",
    value: "50+"
  }], []);
  return <div className="min-h-screen">
      {/* Hero Carousel */}
      <div className="container mx-auto px-4 py-8 sm:py-10 lg:py-14">
        <HomeCarousel />
      </div>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Pourquoi nous choisir ?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nous mettons tout en œuvre pour vous offrir la meilleure expérience d'achat de sneakers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <CardContent className="space-y-4">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Produits en vedette</h2>
              <p className="text-muted-foreground">
                Découvrez notre sélection des meilleures sneakers du moment
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/catalogue">
                Voir tout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {loading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted rounded-lg mb-4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-6 bg-muted rounded w-1/3" />
                  </div>
                </div>)}
            </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => <Link key={product.product_id} to={`/product/${getProductSlug(product.name)}`} className="group">
                  <Card className="group-hover:shadow-lg transition-shadow duration-300">
                    <div className="aspect-square relative overflow-hidden">
                      <OptimizedImage 
                        src={product.image_url || '/placeholder.svg'} 
                        alt={product.name} 
                        className="w-full h-full group-hover:scale-105 transition-transform duration-300" 
                      />
                      <Badge variant="secondary" className="absolute top-2 right-2">
                        {product.category || 'Général'}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {product.brand?.trim() || 'Marque inconnue'}
                        </p>
                        <h3 className="font-semibold text-lg line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />)}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            (23 avis)
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-primary">
                              {product.price}€
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>)}
            </div>}
        </div>
      </section>

      {/* CTA Section */}
      
    </div>;
};
export default Index;