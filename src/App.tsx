import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { useStableAuth } from '@/hooks/useStableAuth';
import { CookieBanner } from '@/components/CookieBanner';
import { CartNotifications } from '@/components/CartNotifications';

import { PublicLayout } from '@/components/layouts/PublicLayout';
import Index from '@/pages/Index';
import Catalogue from '@/pages/Catalogue';
import ProductPage from '@/pages/ProductPage';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Cart from '@/pages/Cart';
import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';
import { ClientProfile } from '@/pages/profile/ClientProfile';
import { VendorProfile } from '@/pages/profile/VendorProfile';
import { AdminProfile } from '@/pages/profile/AdminProfile';

import Checkout from '@/pages/Checkout';
import OrderSuccess from '@/pages/OrderSuccess';
import NotFound from '@/pages/NotFound';
import { Conditions } from '@/pages/Conditions';

// Route protégée qui vérifie l'authentification et les rôles
const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  allowedRoles 
}: { 
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
}) => {
  const { authUser, loading, user } = useStableAuth();

  // Show loading while authentication state is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  // Redirect to login if authentication is required but user is not authenticated
  if (requireAuth && !user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Check role-based access only if user is authenticated and roles are specified
  if (allowedRoles && user && authUser && !authUser.roles.some(role => allowedRoles.includes(role))) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  return (
    <div className="min-h-screen bg-background">
      <CartNotifications />
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Index />} />
          <Route path="catalogue" element={<Catalogue />} />
          <Route path="product/:slug" element={<ProductPage />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-success" element={<OrderSuccess />} />
          <Route path="conditions" element={<Conditions />} />
          
          {/* Routes de profil protégées DANS le PublicLayout */}
          <Route path="profile/client" element={
            <ProtectedRoute allowedRoles={['client']}>
              <ClientProfile />
            </ProtectedRoute>
          } />
          
          <Route path="profile/vendor" element={
            <ProtectedRoute allowedRoles={['vendeur']}>
              <VendorProfile />
            </ProtectedRoute>
          } />
          
          <Route path="profile/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminProfile />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* Routes d'authentification (sans layout) */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />

        {/* Route 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <CookieBanner />
      <Toaster />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
