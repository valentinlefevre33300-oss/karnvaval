import { useEffect } from 'react';

/**
 * Hook to clean up profile-related localStorage data when user logs out
 */
export function useProfileCleanup() {
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Clean up profile data when page is about to unload
      const keysToClean = [
        'clientProfileActiveTab',
        'clientProfileFormData',
        'adminProfileActiveTab',
        'adminProfileFormData',
        'vendorProfileData',
        'vendorVendorData'
      ];
      
      keysToClean.forEach(key => {
        localStorage.removeItem(key);
      });
    };

    // Clean up on page unload
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
}
