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
import { Alert } from '@/components/ui/alert';
import { Store, User, Mail } from 'lucide-react';
import OrdersList from '@/components/OrdersList';
import ProductManagement from '@/components/ProductManagement';
export const VendorProfile = () => {
  const {
    authUser,
    refetchUserData,
    signOut
  } = useStableAuth();
  
  // Clean up profile data on unmount
  useProfileCleanup();
  // Persist profile data in localStorage
  const [profileData, setProfileData] = usePersistedState('vendorProfileData', {
    first_name: '',
    last_name: '',
    phone: ''
  });
  
  // Persist vendor data in localStorage
  const [vendorData, setVendorData] = usePersistedState('vendorVendorData', {
    company_name: '',
    siret: '',
    business_address: ''
  });
  
  // Update form data when authUser changes
  useEffect(() => {
    if (authUser?.profile) {
      setProfileData({
        first_name: authUser.profile.first_name || '',
        last_name: authUser.profile.last_name || '',
        phone: authUser.profile.phone || ''
      });
    }
    if (authUser?.vendor_profile) {
      setVendorData({
        company_name: authUser.vendor_profile.company_name || '',
        siret: authUser.vendor_profile.siret || '',
        business_address: authUser.vendor_profile.business_address || ''
      });
    }
  }, [authUser?.profile, authUser?.vendor_profile, setProfileData, setVendorData]);

  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  const handleVendorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVendorData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const handleProfileSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser?.id) return;
    
    setLoading(true);
    setMessage('');
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('user_id', authUser.id);
        
      if (error) throw error;
      
      setMessage('Profil mis à jour avec succès');
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  }, [authUser?.id, profileData]);
  const handleVendorSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser?.id) return;
    
    setLoading(true);
    setMessage('');
    
    try {
      const { error } = await supabase
        .from('vendor_profiles')
        .upsert({
          user_id: authUser.id,
          ...vendorData
        });
        
      if (error) throw error;
      
      setMessage('Informations vendeur mises à jour avec succès');
    } catch (error) {
      console.error('Error updating vendor profile:', error);
      setMessage('Erreur lors de la mise à jour des informations vendeur');
    } finally {
      setLoading(false);
    }
  }, [authUser?.id, vendorData]);
  const handleSignOut = async () => {
    await signOut();
  };
  if (!authUser) {
    return <div>Chargement...</div>;
  }
  const isVerified = authUser.vendor_profile?.is_verified || false;
  const commissionRate = authUser.vendor_profile?.commission_rate || 10;
  return <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Store className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Mon Profil Vendeur</h1>
          
        </div>

        {message && <Alert variant={message.includes('Erreur') ? 'destructive' : 'default'}>
            {message}
          </Alert>}

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">Commandes</TabsTrigger>
            <TabsTrigger value="products">Produits</TabsTrigger>
            <TabsTrigger value="profile">Profil vendeur</TabsTrigger>
          </TabsList>


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
            <ProductManagement showAddButton={false} />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid gap-6">
              

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Informations du compte
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{authUser.email}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Vendeur</span>
                    
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>;
};