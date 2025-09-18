import { useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser, AppRole } from '@/lib/types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async (userId: string) => {
    try {
      // Parallel fetch profile and roles for better performance
      const [profileResult, rolesResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle(),
        supabase.from('user_roles').select('role').eq('user_id', userId)
      ]);

      const profile = profileResult.data;
      const rolesData = rolesResult.data;
      const roles = rolesData?.map(r => r.role as AppRole) || [];
      
      // Only fetch vendor profile if user has vendor role
      let vendorProfile = null;
      if (roles.includes('vendeur')) {
        const { data } = await supabase
          .from('vendor_profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();
        vendorProfile = data;
      }

      setAuthUser({
        id: userId,
        email: profile?.email || '',
        profile: profile || undefined,
        roles,
        vendor_profile: vendorProfile || undefined,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      setAuthUser(null);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;

        // CRITICAL: Only synchronous state updates in the callback
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer async operations with setTimeout to prevent deadlocks
        if (session?.user && event !== 'TOKEN_REFRESHED') {
          setTimeout(() => {
            if (isMounted) {
              setLoading(true);
              fetchUserData(session.user.id).finally(() => {
                if (isMounted) setLoading(false);
              });
            }
          }, 0);
        } else if (!session?.user) {
          setAuthUser(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setLoading(true);
        fetchUserData(session.user.id).finally(() => {
          if (isMounted) setLoading(false);
        });
      } else {
        setLoading(false);
      }
    }).catch((error) => {
      console.error('Error getting session:', error);
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserData]);

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setSession(null);
      setAuthUser(null);
      // Clear all user-specific localStorage data
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('cart_') && !key.endsWith('_anonymous')) {
          localStorage.removeItem(key);
        }
      });
    }
    return { error };
  };

  const hasRole = (role: AppRole): boolean => {
    return authUser?.roles?.includes(role) || false;
  };

  const isClient = () => hasRole('client');
  const isVendor = () => hasRole('vendeur');
  const isAdmin = () => hasRole('admin');

  return {
    user,
    session,
    authUser,
    loading,
    signUp,
    signIn,
    signOut,
    hasRole,
    isClient,
    isVendor,
    isAdmin,
    refetchUserData: () => user ? fetchUserData(user.id) : Promise.resolve(),
  };
};