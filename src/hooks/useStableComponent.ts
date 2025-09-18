import { useRef, useEffect } from 'react';

/**
 * Hook to prevent unnecessary re-renders of components
 * when the window regains focus
 */
export const useStableComponent = (componentName: string) => {
  const renderCountRef = useRef(0);
  const lastFocusTimeRef = useRef<number>(0);

  useEffect(() => {
    renderCountRef.current += 1;
    
    const handleFocus = () => {
      const now = Date.now();
      const timeSinceLastFocus = now - lastFocusTimeRef.current;
      
      // Only log if it's been more than 1 second since last focus
      if (timeSinceLastFocus > 1000) {
        console.log(`🔄 ${componentName} re-rendered (${renderCountRef.current} times)`);
        lastFocusTimeRef.current = now;
      }
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [componentName]);

  return renderCountRef.current;
};
