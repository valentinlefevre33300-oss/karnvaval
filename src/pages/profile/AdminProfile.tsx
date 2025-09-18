import React, { useState, useEffect, useCallback } from 'react';
import { useStableAuth } from '@/hooks/useStableAuth';
import { usePersistedState } from '@/hooks/usePersistedState';
import { useProfileCleanup } from '@/hooks/useProfileCleanup';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Shield, User, Mail, Phone, Users, Store, ShoppingCart, TrendingUp, Upload, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import OrdersList from '@/components/OrdersList';
import ProductManagement from '@/components/ProductManagement';
import ProductForm from '@/components/ProductForm';
import { PromoCodeManagement } from '@/components/PromoCodeManagement';
import ErrorBoundary from '@/components/ErrorBoundary';
interface Stats {
  totalUsers: number;
  totalVendors: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
}
export const AdminProfile = () => {
  const {
    authUser,
    refetchUserData,
    signOut
  } = useStableAuth();
  
  // Clean up profile data on unmount
  useProfileCleanup();
  const isMobile = useIsMobile();
  // Persist active tab in localStorage
  const [activeTab, setActiveTab] = usePersistedState('adminProfileActiveTab', 'overview');
  
  // Persist form data in localStorage
  const [formData, setFormData] = usePersistedState('adminProfileFormData', {
    first_name: '',
    last_name: '',
    phone: ''
  });
  
  // Update form data when authUser changes
  useEffect(() => {
    if (authUser?.profile) {
      setFormData({
        first_name: authUser.profile.first_name || '',
        last_name: authUser.profile.last_name || '',
        phone: authUser.profile.phone || ''
      });
    }
  }, [authUser?.profile, setFormData]);

  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalVendors: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const fetchStats = useCallback(async () => {
    try {
      // Compter les utilisateurs par rôle
      const {
        data: users
      } = await supabase.from('user_roles').select('role');
      const totalUsers = users?.filter(u => u.role === 'client').length || 0;
      const totalVendors = users?.filter(u => u.role === 'vendeur').length || 0;

      // Compter les commandes réelles
      const {
        data: orders
      } = await supabase.from('orders').select('total');
      const totalOrders = orders?.length || 0;
      const totalRevenue = orders?.reduce((sum, order) => sum + (parseFloat(order.total.toString()) || 0), 0) || 0;

      // Compter les produits réels
      const {
        data: products
      } = await supabase.from('products').select('product_id');
      setStats({
        totalUsers,
        totalVendors,
        totalOrders,
        totalRevenue,
        totalProducts: products?.length || 0
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  }, []);
  
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser?.id) return;
    
    setLoading(true);
    setMessage('');
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('user_id', authUser.id);
        
      if (error) throw error;
      
      setMessage('Profil mis à jour avec succès');
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  }, [authUser?.id, formData]);
  const handleSignOut = async () => {
    await signOut();
  };
  if (!authUser) {
    return <div>Chargement...</div>;
  }
  return <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Tableau de bord Admin</h1>
          <Badge variant="default" className="ml-auto">
            <Shield className="h-4 w-4 mr-1" />
            Administrateur
          </Badge>
        </div>

        {message && <Alert variant={message.includes('Erreur') ? 'destructive' : 'default'}>
            {message}
          </Alert>}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {isMobile ? <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full mb-4">
                <SelectValue placeholder="Sélectionner une section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Vue d'ensemble</SelectItem>
                <SelectItem value="orders">Commandes</SelectItem>
                <SelectItem value="products">Produits</SelectItem>
              </SelectContent>
            </Select> : <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="orders">Commandes</TabsTrigger>
              <TabsTrigger value="products">Produits</TabsTrigger>
            </TabsList>}

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Commandes totales</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    Total des commandes passées
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenus</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">€{stats.totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    Chiffre d'affaires total
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Produits</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProducts}</div>
                  <p className="text-xs text-muted-foreground">
                    Produits en catalogue
                  </p>
                </CardContent>
              </Card>
            </div>

            <PromoCodeManagement />
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des commandes</CardTitle>
              </CardHeader>
              <CardContent>
                <OrdersList showAllOrders={true} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <ErrorBoundary>
              <ProductManagement showAddButton={true} />
            </ErrorBoundary>
              
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Actions rapides</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Gérez l'inventaire et ajoutez de nouveaux produits au catalogue.
                    </p>
                    <div className="grid gap-2">
                      <Button asChild variant="outline" className="justify-start">
                        <Link to="/catalogue">
                          <Package className="mr-2 h-4 w-4" />
                          Voir le catalogue
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                
              </div>
          </TabsContent>

        </Tabs>
      </div>;
};