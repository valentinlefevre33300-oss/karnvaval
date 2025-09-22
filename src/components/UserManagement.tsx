import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Users, Shield, Store, Mail, Phone, Trash2, Edit, KeyRound, Search, Filter, X, Check } from 'lucide-react';
import { AppRole } from '@/lib/types';

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  roles: AppRole[];
  created_at: string;
}

interface VendorProfile {
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [vendorProfiles, setVendorProfiles] = useState<Record<string, VendorProfile>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resettingPassword, setResettingPassword] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<AppRole | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'created_at' | 'role'>('created_at');

  // Form data for creating/editing users
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    role: 'client' as AppRole
  });

  // Fetch all users with their roles
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) {
        console.error('Profiles error:', profilesError);
        setError(`Erreur lors du chargement des profils: ${profilesError.message}`);
        return;
      }

      if (!profiles || profiles.length === 0) {
        setUsers([]);
        setVendorProfiles({});
        return;
      }

      // Get all user roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) {
        console.error('Roles error:', rolesError);
        setError(`Erreur lors du chargement des rôles: ${rolesError.message}`);
        return;
      }

      // Get vendor profiles
      const { data: vendorProfilesData, error: vendorError } = await supabase
        .from('vendor_profiles')
        .select('*');

      if (vendorError) {
        console.error('Vendor profiles error:', vendorError);
        setError(`Erreur lors du chargement des profils vendeurs: ${vendorError.message}`);
        return;
      }

      // Group roles by user_id
      const rolesByUser = (roles || []).reduce((acc, role) => {
        if (!acc[role.user_id]) acc[role.user_id] = [];
        acc[role.user_id].push(role.role as AppRole);
        return acc;
      }, {} as Record<string, AppRole[]>);

      // Group vendor profiles by user_id
      const vendorProfilesByUser = (vendorProfilesData || []).reduce((acc, profile) => {
        acc[profile.user_id] = profile;
        return acc;
      }, {} as Record<string, VendorProfile>);

      // Convert profiles to users format
      const usersWithRoles = profiles.map(profile => ({
        id: profile.user_id,
        email: profile.email || '',
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone,
        roles: rolesByUser[profile.user_id] || [],
        created_at: profile.created_at
      }));

      setUsers(usersWithRoles);
      setVendorProfiles(vendorProfilesByUser);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(`Erreur lors du chargement des utilisateurs: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    try {
      if (!Array.isArray(users)) {
        console.warn('Users is not an array:', users);
        return [];
      }

      let filtered = users.filter(user => {
        if (!user || typeof user !== 'object') {
          console.warn('Invalid user object:', user);
          return false;
        }

        // Search filter
        const matchesSearch = !searchTerm || 
          (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.first_name && user.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.last_name && user.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (`${user.first_name || ''} ${user.last_name || ''}`.toLowerCase().includes(searchTerm.toLowerCase()));

        // Role filter
        const matchesRole = roleFilter === 'all' || (user.roles && user.roles.includes(roleFilter));

        return matchesSearch && matchesRole;
      });

      // Sort users
      filtered.sort((a, b) => {
        try {
          let aValue: any;
          let bValue: any;

          switch (sortBy) {
            case 'name':
              aValue = `${a.first_name || ''} ${a.last_name || ''}`.trim() || a.email || '';
              bValue = `${b.first_name || ''} ${b.last_name || ''}`.trim() || b.email || '';
              break;
            case 'email':
              aValue = a.email || '';
              bValue = b.email || '';
              break;
            case 'created_at':
              aValue = new Date(a.created_at || 0);
              bValue = new Date(b.created_at || 0);
              break;
            case 'role':
              aValue = (a.roles && a.roles[0]) || '';
              bValue = (b.roles && b.roles[0]) || '';
              break;
            default:
              aValue = a.created_at || '';
              bValue = b.created_at || '';
          }

          // Always sort in descending order (newest first)
          return aValue < bValue ? 1 : -1;
        } catch (sortError) {
          console.error('Error sorting users:', sortError);
          return 0;
        }
      });

      return filtered;
    } catch (error) {
      console.error('Error filtering users:', error);
      return [];
    }
  }, [users, searchTerm, roleFilter, sortBy]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (loading) return;
    
    try {
      setError(null);
      setSuccess(null);
      setLoading(true);

      console.log('Starting user creation...');

      // Use regular signup instead of admin.createUser
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.first_name,
            last_name: formData.last_name
          }
        }
      });

      if (authError) {
        console.error('Auth error:', authError);
        if (authError.message.includes('already registered') || authError.message.includes('already been registered')) {
          setError('Un utilisateur avec cet email existe déjà.');
          return;
        }
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Erreur lors de la création de l\'utilisateur');
      }

      const userId = authData.user.id;
      console.log('User created with ID:', userId);

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone
        });

      if (profileError) {
        console.log('Profile error:', profileError);
        // If profile already exists, that's okay - user was created successfully
        if (profileError.code === '23505') { // Unique constraint violation
          console.log('Profile already exists, continuing...');
        } else {
          throw profileError;
        }
      }

      // Assign role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: formData.role
        });

      if (roleError) {
        console.log('Role error:', roleError);
        // If role already exists, that's okay
        if (roleError.code === '23505') { // Unique constraint violation
          console.log('Role already exists, continuing...');
        } else {
          throw roleError;
        }
      }

      // Create vendor profile if role is vendeur (minimal - only user_id)
      if (formData.role === 'vendeur') {
        const { error: vendorError } = await supabase
          .from('vendor_profiles')
          .insert({
            user_id: userId
          });

        if (vendorError) {
          console.log('Vendor error:', vendorError);
          // If vendor profile already exists, that's okay
          if (vendorError.code === '23505') { // Unique constraint violation
            console.log('Vendor profile already exists, continuing...');
          } else {
            throw vendorError;
          }
        }
      }

      console.log('User creation completed successfully');

      // Store form data before reset to avoid stale closure
      const userData = {
        id: userId,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        role: formData.role
      };

      // Success! Show message first
      setSuccess('Utilisateur créé avec succès !');
      
      // Add the new user to the list immediately (optimistic update)
      const newUser = {
        id: userData.id,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone,
        roles: [userData.role],
        created_at: new Date().toISOString()
      };
      
      setUsers(prevUsers => {
        // Check if user already exists to avoid duplicates
        const exists = prevUsers.some(user => user.id === newUser.id);
        if (exists) {
          console.log('User already exists in list, skipping add');
          return prevUsers;
        }
        return [...prevUsers, newUser];
      });
      
      // Add vendor profile if applicable (minimal - only user_id)
      if (userData.role === 'vendeur') {
        const newVendorProfile = {
          user_id: userData.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setVendorProfiles(prev => ({
          ...prev,
          [userData.id]: newVendorProfile
        }));
      }
      
      // Reset form immediately
      setFormData({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        phone: '',
        role: 'client'
      });
      
      // Close form
      setShowCreateForm(false);
      
      // Optional: Refresh in background to ensure data consistency (non-blocking)
      setTimeout(async () => {
        try {
          await fetchUsers();
        } catch (refreshError) {
          console.error('Background refresh error:', refreshError);
          // Silent fail - optimistic update already handled
        }
      }, 2000); // 2 seconds delay to not interfere with user experience

    } catch (err: any) {
      console.error('Error creating user:', err);
      setError(err.message || 'Erreur lors de la création de l\'utilisateur');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      setError(null);
      setSuccess(null);
      setResettingPassword(email);

      // Send password reset email using regular auth
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;

      // Success message with more details
      setSuccess(`✅ Email de réinitialisation envoyé avec succès à ${email}. L'utilisateur recevra un lien pour réinitialiser son mot de passe.`);
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (err: any) {
      console.error('Error sending reset email:', err);
      setError(`❌ Erreur lors de l'envoi de l'email de réinitialisation : ${err.message || 'Erreur inconnue'}`);
    } finally {
      setResettingPassword(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

    try {
      setError(null);
      setSuccess(null);

      // Delete from profiles table (this will cascade to related tables)
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);

      if (profileError) throw profileError;

      // Delete from user_roles table
      const { error: rolesError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (rolesError) throw rolesError;

      // Delete from vendor_profiles table if exists
      const { error: vendorError } = await supabase
        .from('vendor_profiles')
        .delete()
        .eq('user_id', userId);

      if (vendorError) {
        console.warn('Error deleting vendor profile:', vendorError);
        // Don't throw error as vendor profile might not exist
      }

      setSuccess('Utilisateur supprimé avec succès');
      fetchUsers();
    } catch (err: any) {
      console.error('Error deleting user:', err);
      setError(err.message || 'Erreur lors de la suppression de l\'utilisateur');
    }
  };

  const getRoleBadgeColor = (role: AppRole) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'vendeur': return 'secondary';
      case 'client': return 'default';
      default: return 'outline';
    }
  };

  const getRoleLabel = (role: AppRole) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'vendeur': return 'Vendeur';
      case 'client': return 'Client';
      default: return role;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gestion des utilisateurs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Chargement...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gestion des utilisateurs
            </CardTitle>
            <Button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-2"
              disabled={loading}
            >
              <UserPlus className="h-4 w-4" />
              {loading ? 'Création...' : 'Créer un utilisateur'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-4 border-green-200 bg-green-50 text-green-800">
              <Check className="h-4 w-4" />
              <AlertDescription className="font-medium">{success}</AlertDescription>
            </Alert>
          )}

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtres et tri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Search */}
                <div className="space-y-2">
                  <Label htmlFor="search">Rechercher</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Nom, email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                    {searchTerm && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-8 w-8 p-0"
                        onClick={() => setSearchTerm('')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Role Filter */}
                <div className="space-y-2">
                  <Label htmlFor="role-filter">Rôle</Label>
                  <Select value={roleFilter} onValueChange={(value: AppRole | 'all') => setRoleFilter(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les rôles</SelectItem>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="vendeur">Vendeur</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                  <Label htmlFor="sort-by">Trier par</Label>
                  <Select value={sortBy} onValueChange={(value: 'name' | 'email' | 'created_at' | 'role') => setSortBy(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created_at">Date de création</SelectItem>
                      <SelectItem value="name">Nom</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="role">Rôle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

              </div>

              {/* Results count */}
              <div className="mt-4 text-sm text-muted-foreground">
                {filteredAndSortedUsers.length} utilisateur(s) trouvé(s) sur {users.length} total
              </div>
            </CardContent>
          </Card>

          {showCreateForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Créer un nouvel utilisateur</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Mot de passe *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="first_name">Prénom</Label>
                      <Input
                        id="first_name"
                        value={formData.first_name}
                        onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name">Nom</Label>
                      <Input
                        id="last_name"
                        value={formData.last_name}
                        onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Rôle *</Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value: AppRole) => setFormData({...formData, role: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="client">Client</SelectItem>
                          <SelectItem value="vendeur">Vendeur</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>


                  <div className="flex gap-2">
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Création...' : 'Créer l\'utilisateur'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowCreateForm(false)}
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {filteredAndSortedUsers.map((user) => (
              <Card key={user.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {user.first_name && user.last_name && (
                          <span>{user.first_name} {user.last_name}</span>
                        )}
                        {user.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {user.phone}
                          </div>
                        )}
                        <span>
                          Créé le {new Date(user.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      {user.roles.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {user.roles.map((role) => (
                            <Badge key={role} variant={getRoleBadgeColor(role)}>
                              {getRoleLabel(role)}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResetPassword(user.email)}
                        className="flex items-center gap-2"
                        title="Envoyer un email de réinitialisation de mot de passe"
                        disabled={resettingPassword === user.email}
                      >
                        <KeyRound className="h-4 w-4" />
                        {resettingPassword === user.email ? 'Envoi...' : 'Réinitialiser'}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-destructive hover:text-destructive"
                        title="Supprimer l'utilisateur"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
