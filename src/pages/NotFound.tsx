import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#FE047F]/10 animate-float"
            style={{
              width: `${20 + Math.random() * 80}px`,
              height: `${20 + Math.random() * 80}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>

      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="404-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="currentColor" className="text-foreground" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#404-grid)" />
        </svg>
      </div>

      <div className="w-full max-w-3xl relative z-10">
        <Card className="border-2 border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            {/* 404 SVG Illustration */}
            <div className="mb-8 relative">
              <svg className="w-full h-64 mx-auto" viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
                {/* 404 Text */}
                <text
                  x="400"
                  y="180"
                  fontSize="140"
                  fontWeight="bold"
                  fill="none"
                  stroke="#FE047F"
                  strokeWidth="3"
                  textAnchor="middle"
                  className="animate-pulse"
                >
                  404
                </text>
                <text
                  x="400"
                  y="180"
                  fontSize="140"
                  fontWeight="bold"
                  fill="#FE047F"
                  fillOpacity="0.1"
                  textAnchor="middle"
                >
                  404
                </text>

                {/* Magnifying Glass */}
                <g className="animate-bounce" style={{ transformOrigin: '650px 120px' }}>
                  <circle cx="630" cy="100" r="40" fill="none" stroke="#00690D" strokeWidth="6"/>
                  <circle cx="630" cy="100" r="40" fill="#00690D" fillOpacity="0.1"/>
                  <line x1="660" y1="130" x2="690" y2="160" stroke="#00690D" strokeWidth="6" strokeLinecap="round"/>
                  {/* Question mark inside */}
                  <text x="630" y="115" fontSize="40" fontWeight="bold" fill="#00690D" textAnchor="middle">?</text>
                </g>

                {/* Floating particles */}
                {[...Array(8)].map((_, i) => (
                  <circle
                    key={i}
                    cx={100 + i * 90}
                    cy={50 + (i % 2) * 200}
                    r="4"
                    fill="#FE047F"
                    opacity="0.3"
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}

                {/* Path/Road going nowhere */}
                <path
                  d="M 50 250 Q 200 230, 350 240 T 750 220"
                  fill="none"
                  stroke="#00690D"
                  strokeWidth="3"
                  strokeDasharray="10 5"
                  opacity="0.3"
                />
              </svg>
            </div>

            {/* Error Message */}
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Page Not Found
            </h1>
            <p className="text-muted-foreground text-lg mb-2">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <div className="inline-block bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg mb-8">
              <code className="text-sm text-foreground font-mono">
                {location.pathname}
              </code>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/">
                <Button className="w-full sm:w-auto h-12 bg-[#FE047F] hover:bg-[#FE047F]/90 text-white text-base font-semibold shadow-xl shadow-[#FE047F]/20 transition-all duration-300 hover:scale-[1.02]">
                  <Home className="h-5 w-5 mr-2" />
                  Go to Homepage
                </Button>
              </Link>

              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="w-full sm:w-auto h-12 border-2 border-[#00690D] text-[#00690D] hover:bg-[#00690D] hover:text-white text-base font-semibold transition-all duration-300"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Go Back
              </Button>
            </div>

            {/* Helpful Links */}
            <div className="pt-8 border-t-2 border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-center mb-6">
                <Search className="h-5 w-5 text-muted-foreground mr-2" />
                <h3 className="text-lg font-semibold text-foreground">
                  Popular Pages
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { name: 'About Us', path: '/about' },
                  { name: 'Features', path: '/features' },
                  { name: 'Services', path: '/services' },
                  { name: 'Contact', path: '/contact' }
                ].map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="p-3 rounded-lg border-2 border-slate-200 dark:border-slate-800 hover:border-[#FE047F] hover:bg-[#FE047F]/5 text-foreground font-medium transition-all duration-300 hover:scale-105"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Footer Message */}
            <div className="mt-8 text-sm text-muted-foreground">
              Lost? Let Career na Mimi guide you back on track
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
