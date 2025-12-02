import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Listings", path: "/listings" },
    { name: "Co-living", path: "/search?type=co-living" },
    { name: "Commercial", path: "/search?type=commercial" },
    { name: "Market Insights", path: "/insights" },
  ];

  const isActive = (path: string) => location.pathname === path || location.search === path.split('?')[1];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 dark:border-gray-700/50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between whitespace-nowrap px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          {/* Logo matching UrbanNest design */}
          <Link to="/" className="flex items-center gap-3 text-gray-900 dark:text-white hover:opacity-80 transition-opacity">
            <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_6_319_new)">
                <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" fill="currentColor"></path>
              </g>
              <defs>
                <clipPath id="clip0_6_319_new">
                  <rect fill="white" height="48" width="48"></rect>
                </clipPath>
              </defs>
            </svg>
            <h2 className="text-xl font-bold tracking-tight">SmartDwell</h2>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium hover:text-primary dark:hover:text-primary transition-colors",
                  isActive(link.path) && "text-primary font-semibold"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Search Input - Desktop */}
          <div className="hidden md:flex items-center relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </span>
            <Input
              className="w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary focus:ring-opacity-50 border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark placeholder-gray-400 dark:placeholder-gray-500 pl-10 pr-4 py-2 text-sm font-normal leading-normal transition-all"
              placeholder="Search"
            />
          </div>

          {/* CTA Button */}
          <Link to="/list-property" className="hidden sm:inline-flex">
            <Button className="h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-wide shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark transition-colors">
              List Your Property
            </Button>
          </Link>

          {/* User Avatar Placeholder */}
          <div className="hidden md:block h-10 w-10 bg-gradient-to-br from-primary to-secondary rounded-full"></div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden py-4 animate-slide-in border-t border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 flex flex-col space-y-2">
            {/* Mobile Search */}
            <div className="mb-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-5 w-5 text-gray-400" />
                </span>
                <Input
                  className="w-full pl-10 pr-4 py-2 text-sm"
                  placeholder="Search"
                />
              </div>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors hover:bg-muted rounded-lg",
                  isActive(link.path) && "bg-primary/10 text-primary font-semibold"
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/list-property" onClick={() => setIsOpen(false)}>
              <Button className="w-full mt-4">
                List Your Property
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
