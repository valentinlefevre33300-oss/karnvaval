import { useEffect, useState, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser, AppRole } from '@/lib/types';

/**
 * Stable auth hook that prevents unnecessary re-renders and page reloads
 * when the window regains focus (Alt+Tab scenario)
 */
export const useStableAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Use refs to track state without causing re-renders
  const lastUserIdRef = useRef<string | null>(null);
  const isProcessingRef = useRef(false);

  const fetchUserData = useCallback(async (userId: string) => {
    // Prevent duplicate fetches
    if (isProcessingRef.current || lastUserIdRef.current === userId) {
      return;
    }
    
    isProcessingRef.current = true;
    lastUserIdRef.current = userId;
    
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

      const newAuthUser = {
        id: userId,
        email: profile?.email || '',
        profile: profile || undefined,
        roles,
        vendor_profile: vendorProfile || undefined,
      };

      // Only update if the data has actually changed
      setAuthUser(prevAuthUser => {
        if (JSON.stringify(prevAuthUser) === JSON.stringify(newAuthUser)) {
          return prevAuthUser;
        }
        return newAuthUser;
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      setAuthUser(null);
    } finally {
      isProcessingRef.current = false;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;

        // Only process significant auth changes, not token refreshes
        if (event === 'TOKEN_REFRESHED') {
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Only fetch if we don't have this user's data or if it's a sign in
          if (event === 'SIGNED_IN' || lastUserIdRef.current !== session.user.id) {
            setLoading(true);
            fetchUserData(session.user.id).finally(() => {
              if (isMounted) {
                setLoading(false);
                setIsInitialized(true);
              }
            });
          }
        } else {
          setAuthUser(null);
          lastUserIdRef.current = null;
          setLoading(false);
          setIsInitialized(true);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setLoading(true);
        fetchUserData(session.user.id).finally(() => {
          if (isMounted) {
            setLoading(false);
            setIsInitialized(true);
          }
        });
      } else {
        setLoading(false);
        setIsInitialized(true);
      }
    }).catch((error) => {
      console.error('Error getting session:', error);
      if (isMounted) {
        setLoading(false);
        setIsInitialized(true);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserData]);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setAuthUser(null);
      lastUserIdRef.current = null;
      isProcessingRef.current = false;
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, []);

  const isAdmin = useCallback(() => {
    return authUser?.roles?.includes('admin') || false;
  }, [authUser?.roles]);

  const isVendor = useCallback(() => {
    return authUser?.roles?.includes('vendeur') || false;
  }, [authUser?.roles]);

  const isClient = useCallback(() => {
    return authUser?.roles?.includes('client') || false;
  }, [authUser?.roles]);

  const refetchUserData = useCallback(async () => {
    if (user?.id) {
      lastUserIdRef.current = null; // Force refetch
      await fetchUserData(user.id);
    }
  }, [user?.id, fetchUserData]);

  return {
    user,
    session,
    authUser,
    loading: loading || !isInitialized,
    signOut,
    isAdmin,
    isVendor,
    isClient,
    refetchUserData,
  };
};
