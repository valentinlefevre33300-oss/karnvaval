import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, ShoppingCart, User, LogOut, Store, Shield } from 'lucide-react';
import { SearchDialog } from '@/components/SearchDialog';
interface HeaderActionsProps {
  isMobile?: boolean;
}

export const HeaderActions = ({ isMobile = false }: HeaderActionsProps) => {
  const {
    authUser,
    signOut,
    isClient,
    isVendor,
    isAdmin
  } = useAuth();
  const handleSignOut = async () => {
    await signOut();
  };
  const getProfileLink = () => {
    if (isAdmin()) return '/profile/admin';
    if (isVendor()) return '/profile/vendor';
    if (isClient()) return '/profile/client';
    return '/auth/login';
  };
  const getProfileIcon = () => {
    if (isAdmin()) return <Shield className="h-4 w-4 mr-2" />;
    if (isVendor()) return <Store className="h-4 w-4 mr-2" />;
    return <User className="h-4 w-4 mr-2" />;
  };

  // Layout mobile avec boutons empilés verticalement
  if (isMobile) {
    return (
      <div className="flex flex-col space-y-3 w-full">
        <SearchDialog>
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <Search className="h-4 w-4 mr-2" />
            Rechercher
          </Button>
        </SearchDialog>
        
        {authUser ? (
          <div className="flex flex-col space-y-2 w-full">
            <Button variant="ghost" size="sm" asChild className="w-full justify-start">
              <Link to={getProfileLink()}>
                {getProfileIcon()}
                Mon profil
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut} 
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Se déconnecter
            </Button>
          </div>
        ) : (
          <div className="flex flex-col space-y-2 w-full">
            <Button variant="ghost" size="sm" asChild className="w-full justify-center">
              <Link to="/auth/login">Connexion</Link>
            </Button>
            <Button size="sm" asChild className="w-full justify-center">
              <Link to="/auth/register">Inscription</Link>
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Layout desktop (inchangé)
  return (
    <div className="flex items-center space-x-4">
      <SearchDialog>
        <Button variant="ghost" size="sm">
          <Search className="h-4 w-4" />
        </Button>
      </SearchDialog>
      
      {authUser ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5 text-sm">
              <p className="font-medium">{authUser.profile?.first_name || 'Utilisateur'}</p>
              <p className="text-muted-foreground text-xs">{authUser.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={getProfileLink()} className="cursor-pointer">
                {getProfileIcon()}
                Mon profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
              <LogOut className="h-4 w-4 mr-2" />
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/auth/login">Connexion</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/auth/register">Inscription</Link>
          </Button>
        </div>
      )}
    </div>
  );
};