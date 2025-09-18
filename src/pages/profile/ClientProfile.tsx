import React, { useState, useEffect, useCallback } from 'react';
import { useStableAuth } from '@/hooks/useStableAuth';
import { usePersistedState } from '@/hooks/usePersistedState';
import { useProfileCleanup } from '@/hooks/useProfileCleanup';
import { useStableComponent } from '@/hooks/useStableComponent';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert } from '@/components/ui/alert';
import { User, Mail, Phone, Calendar, LogOut, Heart, ShoppingBag, ChevronDown } from 'lucide-react';
import OrdersList from '@/components/OrdersList';
import { FavoritesSection } from '@/components/FavoritesSection';
export const ClientProfile = () => {
  // Debug: Track re-renders
  useStableComponent('ClientProfile');
  
  const {
    authUser,
    refetchUserData,
    signOut
  } = useStableAuth();
  
  // Clean up profile data on unmount
  useProfileCleanup();
  // Persist active tab in localStorage
  const [activeTab, setActiveTab] = usePersistedState('clientProfileActiveTab', 'orders');
  
  // Persist form data in localStorage
  const [formData, setFormData] = usePersistedState('clientProfileFormData', {
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    country: 'France'
  });
  
  // Update form data when authUser changes
  useEffect(() => {
    if (authUser?.profile) {
      setFormData({
        first_name: authUser.profile.first_name || '',
        last_name: authUser.profile.last_name || '',
        phone: authUser.profile.phone || '',
        address: authUser.profile.address || '',
        city: authUser.profile.city || '',
        postal_code: authUser.profile.postal_code || '',
        country: authUser.profile.country || 'France'
      });
    }
  }, [authUser?.profile, setFormData]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
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
      // Don't call refetchUserData to avoid auth loops
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
  const getTabLabel = (value: string) => {
    switch (value) {
      case 'orders':
        return 'Mes commandes';
      case 'favorites':
        return 'Favoris';
      case 'profile':
        return 'Profil';
      default:
        return '';
    }
  };

  const getTabIcon = (value: string) => {
    switch (value) {
      case 'orders':
        return <ShoppingBag className="h-4 w-4" />;
      case 'favorites':
        return <Heart className="h-4 w-4" />;
      case 'profile':
        return <User className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (!authUser) {
    return <div>Chargement...</div>;
  }
  return <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <User className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Mon Profil Client</h1>
          </div>
          <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2 self-start sm:self-auto">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Se déconnecter</span>
            <span className="sm:hidden">Déconnexion</span>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Desktop TabsList */}
          <TabsList className="hidden md:grid w-full grid-cols-3 h-auto bg-background border">
            <TabsTrigger value="orders" className="text-sm py-2">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Mes commandes
            </TabsTrigger>
            <TabsTrigger value="favorites" className="text-sm py-2">
              <Heart className="h-4 w-4 mr-2" />
              Favoris
            </TabsTrigger>
            <TabsTrigger value="profile" className="text-sm py-2">
              <User className="h-4 w-4 mr-2" />
              Profil
            </TabsTrigger>
          </TabsList>

          {/* Mobile Dropdown */}
          <div className="md:hidden mb-4">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full bg-background border z-50">
                <div className="flex items-center gap-2">
                  {getTabIcon(activeTab)}
                  <SelectValue placeholder="Sélectionner une section">
                    {getTabLabel(activeTab)}
                  </SelectValue>
                </div>
              </SelectTrigger>
              <SelectContent className="bg-background border z-50">
                <SelectItem value="orders" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Mes commandes
                  </div>
                </SelectItem>
                <SelectItem value="favorites" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Favoris
                  </div>
                </SelectItem>
                <SelectItem value="profile" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profil
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Historique des commandes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <OrdersList showAllOrders={false} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Mes favoris
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FavoritesSection />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                    Informations du compte
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground break-all">{authUser.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">Membre depuis</p>
                      <p className="text-sm text-muted-foreground">
                        {authUser.profile?.created_at ? new Date(authUser.profile.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>;
};