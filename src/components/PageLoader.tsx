export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#FE047F]/10 animate-float"
            style={{
              width: `${20 + Math.random() * 100}px`,
              height: `${20 + Math.random() * 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="loader-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="currentColor" className="text-foreground" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#loader-grid)" />
        </svg>
      </div>

      {/* Main Loader Content */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Logo Container with Multiple Animations */}
        <div className="relative">
          {/* Outer Ring - Spinning */}
          <div className="absolute inset-0 -m-8">
            <svg className="w-40 h-40 animate-spin" style={{ animationDuration: '3s' }} viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#FE047F"
                strokeWidth="2"
                strokeDasharray="10 5"
                opacity="0.3"
              />
            </svg>
          </div>

          {/* Middle Ring - Counter Spinning */}
          <div className="absolute inset-0 -m-6">
            <svg className="w-36 h-36 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#00690D"
                strokeWidth="2"
                strokeDasharray="8 6"
                opacity="0.3"
              />
            </svg>
          </div>

          {/* Inner Pulsing Circle */}
          <div className="absolute inset-0 -m-4">
            <div className="w-32 h-32 rounded-full bg-[#FE047F]/10 animate-ping"></div>
          </div>

          {/* Logo/Center */}
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#FE047F] to-[#FE047F]/80 flex items-center justify-center shadow-2xl overflow-hidden">
            <img
              src="/logo.png"
              alt="Career na Mimi"
              className="w-20 h-20 object-contain animate-pulse"
            />
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>

          {/* Orbiting Dots */}
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="absolute inset-0 animate-spin"
              style={{
                animationDuration: '4s',
                animationDelay: `${i * 0.25}s`
              }}
            >
              <div
                className="absolute w-3 h-3 rounded-full bg-[#00690D] top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  boxShadow: '0 0 10px rgba(0, 105, 13, 0.5)'
                }}
              ></div>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#FE047F] via-[#00690D] to-[#FE047F] animate-loading-bar rounded-full"></div>
        </div>

        {/* Text */}
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-foreground animate-pulse">
            Loading Career na Mimi
          </h3>
          <p className="text-sm text-muted-foreground animate-pulse" style={{ animationDelay: '0.2s' }}>
            Preparing your career journey...
          </p>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-[#FE047F] opacity-20 animate-float-up"
              style={{
                left: `${15 + Math.random() * 70}%`,
                bottom: '10%',
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${4 + Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes loading-bar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes float-up {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(-400px) scale(0);
            opacity: 0;
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }

        .animate-float-up {
          animation: float-up 6s ease-in infinite;
        }
      `}</style>
    </div>
  );
}
