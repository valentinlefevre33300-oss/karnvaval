import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, ShoppingCart, User, LogOut, Store, Shield } from 'lucide-react';
import { SearchDialog } from '@/components/SearchDialog';
export const HeaderActions = () => {
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
  return <div className="flex items-center space-x-4">
      <SearchDialog>
        <Button variant="ghost" size="sm">
          <Search className="h-4 w-4" />
        </Button>
      </SearchDialog>
      
      
      {authUser ? <DropdownMenu>
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
            <DropdownMenuItem asChild>
              
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
              <LogOut className="h-4 w-4 mr-2" />
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> : <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/auth/login">Connexion</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/auth/register">Inscription</Link>
          </Button>
        </div>}
    </div>;
};