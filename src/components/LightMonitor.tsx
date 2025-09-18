import { useEffect, useState } from 'react';

/**
 * Light performance monitor - only shows in development
 * Can be enabled/disabled via localStorage
 */
export const LightMonitor = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    // Check if monitoring is enabled in localStorage
    const enabled = localStorage.getItem('enable-monitoring') === 'true';
    setIsEnabled(enabled);
  }, []);

  useEffect(() => {
    if (isEnabled) {
      setRenderCount(prev => prev + 1);
    }
  }, [isEnabled]);

  // Only show in development and if enabled
  if (process.env.NODE_ENV === 'production' || !isEnabled) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-blue-100 border border-blue-300 text-black p-2 rounded text-xs z-[9999]">
      <div className="font-bold mb-1">Monitor:</div>
      <div>Renders: {renderCount}</div>
      <button 
        onClick={() => {
          localStorage.setItem('enable-monitoring', 'false');
          setIsEnabled(false);
        }}
        className="text-xs underline mt-1"
      >
        Disable
      </button>
    </div>
  );
};

// Helper function to enable monitoring
export const enableMonitoring = () => {
  localStorage.setItem('enable-monitoring', 'true');
  window.location.reload();
};
