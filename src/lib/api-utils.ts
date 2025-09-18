import { supabase } from '@/integrations/supabase/client';

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

export const handleApiError = (error: unknown): ApiError => {
  console.error('API Error:', error);
  
  if (typeof error === 'object' && error && 'code' in error && (error as { code?: string }).code === 'PGRST116') {
    return {
      message: 'Aucun résultat trouvé',
      code: (error as { code?: string }).code
    };
  }
  
  if (typeof error === 'object' && error && 'message' in error && typeof (error as { message?: string }).message === 'string' && (error as { message: string }).message.includes('Failed to fetch')) {
    return {
      message: 'Problème de connexion réseau. Veuillez vérifier votre connexion.',
      code: 'NETWORK_ERROR'
    };
  }
  
  return {
    message: typeof error === 'object' && error && 'message' in error ? String((error as { message?: unknown }).message) : 'Une erreur est survenue',
    code: typeof error === 'object' && error && 'code' in error ? String((error as { code?: unknown }).code) : undefined,
    details: error
  };
};

export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on certain errors
      if (error && typeof error === 'object' && 'code' in error) {
        const errorCode = String((error as { code?: unknown }).code ?? '');
        if (errorCode === 'PGRST116' || errorCode?.startsWith('42')) {
          throw error;
        }
      }
      
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError!;
};

export const createOptimizedProductsQuery = () => {
  return supabase
    .from('products')
    .select('*')
    .limit(1000); // Prevent accidentally loading huge datasets
};