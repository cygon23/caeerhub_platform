import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Search, ArrowLeft, Compass } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <Card className="border-0 shadow-elegant bg-background/95 backdrop-blur-sm text-center">
          <CardContent className="p-12">
            {/* 404 Animation */}
            <div className="relative mb-8">
              <div className="text-8xl font-bold bg-gradient-hero bg-clip-text text-transparent animate-pulse">
                404
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Compass className="h-16 w-16 text-primary/30 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
            </div>

            {/* Error Message */}
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Oops! Page Not Found
            </h1>
            <p className="text-muted-foreground text-lg mb-2">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Path: <code className="bg-muted px-2 py-1 rounded text-foreground">{location.pathname}</code>
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button className="bg-gradient-hero text-white hover:shadow-primary transition-all duration-300">
                  <Home className="h-4 w-4 mr-2" />
                  Go to Homepage
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
                className="hover:bg-muted transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>

            {/* Helpful Links */}
            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Popular Pages
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <Link 
                  to="/about" 
                  className="text-primary hover:text-primary-dark transition-colors"
                >
                  About Us
                </Link>
                <Link 
                  to="/features" 
                  className="text-primary hover:text-primary-dark transition-colors"
                >
                  Features
                </Link>
                <Link 
                  to="/services" 
                  className="text-primary hover:text-primary-dark transition-colors"
                >
                  Services
                </Link>
                <Link 
                  to="/contact" 
                  className="text-primary hover:text-primary-dark transition-colors"
                >
                  Contact
                </Link>
              </div>
            </div>

            {/* Fun Element */}
            <div className="mt-8 text-xs text-muted-foreground">
              🧭 Lost? Our Career na Mimi compass will guide you back!
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
