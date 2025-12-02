import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center bg-background-light dark:bg-background-dark px-4 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-9xl font-black text-primary mb-4">404</h1>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button size="lg" className="btn-primary">
                <Home className="h-5 w-5 mr-2" />
                Return to Home
              </Button>
            </Link>
            <Link to="/search">
              <Button size="lg" variant="outline">
                <Search className="h-5 w-5 mr-2" />
                Search Properties
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NotFound;
