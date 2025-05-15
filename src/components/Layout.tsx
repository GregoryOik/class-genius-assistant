
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-2xl font-bold text-uniclass-purple">
              UniClass
            </Link>
            <span className="bg-secondary px-2 py-0.5 rounded text-xs font-medium">AI Helper</span>
          </div>
          <nav className="hidden md:flex items-center space-x-4">
            <NavLink to="/" isActive={location.pathname === '/'}>
              Dashboard
            </NavLink>
            <NavLink to="/subjects" isActive={location.pathname.startsWith('/subjects') && !location.pathname.endsWith('/new')}>
              Subjects
            </NavLink>
          </nav>
          <div className="flex items-center gap-2">
            {location.pathname === '/subjects' || location.pathname === '/' ? (
              <Button asChild variant="default">
                <Link to="/subjects/new" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  <span>Add Subject</span>
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">{children}</main>
      <footer className="border-t py-6 bg-white">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} UniClass AI Helper
          </p>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
            <Link to="/subjects" className="text-sm text-muted-foreground hover:text-foreground">
              Subjects
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

type NavLinkProps = {
  to: string;
  isActive: boolean;
  children: React.ReactNode;
};

const NavLink = ({ to, isActive, children }: NavLinkProps) => (
  <Link
    to={to}
    className={cn(
      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
      isActive
        ? "bg-accent text-uniclass-purple"
        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
    )}
  >
    {children}
  </Link>
);

export default Layout;
