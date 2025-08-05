import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Settings, PenTool, Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export const Header = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const NavigationLinks = ({ mobile = false, onClose }: { mobile?: boolean; onClose?: () => void }) => (
    <nav className={`flex ${mobile ? 'flex-col gap-4' : 'items-center gap-6'}`}>
      <Link
        to="/"
        onClick={onClose}
        className={`text-sm font-medium transition-all duration-300 hover:text-primary hover:scale-105 story-link ${
          isActivePath('/') ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        Home
      </Link>
      <Link
        to="/blog"
        onClick={onClose}
        className={`text-sm font-medium transition-all duration-300 hover:text-primary hover:scale-105 story-link ${
          isActivePath('/blog') ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        Blog
      </Link>
      <Link
        to="/about"
        onClick={onClose}
        className={`text-sm font-medium transition-all duration-300 hover:text-primary hover:scale-105 story-link ${
          isActivePath('/about') ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        About
      </Link>
      <Link
        to="/contact"
        onClick={onClose}
        className={`text-sm font-medium transition-all duration-300 hover:text-primary hover:scale-105 story-link ${
          isActivePath('/contact') ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        Contact
      </Link>
      {isAuthenticated && (
        <Link
          to="/dashboard"
          onClick={onClose}
          className={`text-sm font-medium transition-all duration-300 hover:text-primary hover:scale-105 story-link ${
            isActivePath('/dashboard') ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          Dashboard
        </Link>
      )}
      {isAdmin && (
        <Link
          to="/admin"
          onClick={onClose}
          className={`text-sm font-medium transition-all duration-300 hover:text-primary hover:scale-105 story-link ${
            isActivePath('/admin') ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          Admin
        </Link>
      )}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-fade-in">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 hover-scale cursor-magic">
            <PenTool className="h-6 w-6 text-primary animate-pulse" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              BlogApp
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavigationLinks />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 hover-scale cursor-magic">
                    <User className="h-4 w-4" />
                    <span className="max-w-[100px] truncate">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-background border border-border animate-scale-in">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-magic">
                      <Settings className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-magic">
                        <Settings className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-magic text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild className="hover-scale cursor-magic">
                  <Link to="/login">Login</Link>
                </Button>
                <Button size="sm" asChild className="hover-scale cursor-magic">
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden cursor-magic">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] animate-slide-in-right">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-6">
                <NavigationLinks mobile onClose={() => setIsMobileMenuOpen(false)} />
                
                <div className="border-t pt-6">
                  {isAuthenticated ? (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{user?.name}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="justify-start gap-2 cursor-magic"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Button variant="ghost" asChild className="justify-start cursor-magic">
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                      </Button>
                      <Button asChild className="justify-start cursor-magic">
                        <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};