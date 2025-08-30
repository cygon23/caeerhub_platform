import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon, Languages, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import ModernFooter from "@/components/ModernFooter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PublicLayoutProps {
  children: ReactNode;
}

// Language options
const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "sw", name: "Kiswahili", flag: "🇹🇿" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
];

export default function PublicLayout({ children }: PublicLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, then system preference
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved;
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  });

  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Check localStorage first, then browser language, then default to English
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("language");
      if (saved) return saved;
      const browserLang = navigator.language.split("-")[0];
      return languages.find((lang) => lang.code === browserLang)?.code || "en";
    }
    return "en";
  });

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Features", href: "/features" },
    { name: "Services", href: "/services" },
    { name: "Partners", href: "/partners" },
    { name: "Contact", href: "/contact" },
  ];

  // Theme switching logic
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  // Language switching logic
  useEffect(() => {
    localStorage.setItem("language", currentLanguage);
    document.documentElement.lang = currentLanguage;
    // Here you can trigger your translation system
    // Example: i18n.changeLanguage(currentLanguage);
  }, [currentLanguage]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const changeLanguage = (langCode: string) => {
    setCurrentLanguage(langCode);
  };

  const getCurrentLanguage = () => {
    return (
      languages.find((lang) => lang.code === currentLanguage) || languages[0]
    );
  };

  return (
    <div className='min-h-screen bg-background transition-colors duration-300'>
      {/* Navigation */}
      <nav className='bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            {/* Logo */}
            <Link to='/' className='flex items-center space-x-2'>
              <img
                src='/logo.png'
                alt='Career na Mimi Logo'
                className='w-8 h-8 object-contain'
              />
            </Link>

            {/* Desktop Navigation */}
            <div className='hidden md:flex items-center space-x-8'>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className='text-foreground hover:text-primary transition-colors duration-200 font-medium'>
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Controls & Auth */}
            <div className='hidden md:flex items-center space-x-2'>
              {/* Language Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='flex items-center space-x-2 hover:bg-muted/50'>
                    <Globe className='h-4 w-4' />
                    <span className='text-sm'>{getCurrentLanguage().flag}</span>
                    <span className='text-sm font-medium'>
                      {getCurrentLanguage().code.toUpperCase()}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-40'>
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`flex items-center space-x-3 cursor-pointer ${
                        currentLanguage === lang.code
                          ? "bg-primary/10 text-primary"
                          : ""
                      }`}>
                      <span>{lang.flag}</span>
                      <span className='font-medium'>{lang.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Switcher */}
              <Button
                variant='ghost'
                size='sm'
                onClick={toggleTheme}
                className='hover:bg-muted/50 transition-colors duration-200'
                aria-label={`Switch to ${
                  theme === "light" ? "dark" : "light"
                } mode`}>
                {theme === "light" ? (
                  <Moon className='h-4 w-4' />
                ) : (
                  <Sun className='h-4 w-4' />
                )}
              </Button>

              {/* Auth Buttons */}
              <div className='flex items-center space-x-3 ml-4 pl-4 border-l border-border'>
                <Link to='/login'>
                  <Button
                    variant='ghost'
                    className='text-foreground hover:text-primary'>
                    Login
                  </Button>
                </Link>
                <Link to='/signup'>
                  <Button className='bg-gradient-hero text-white shadow-primary hover:opacity-90 transform hover:scale-105 transition-all duration-300'>
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className='md:hidden flex items-center space-x-2'>
              {/* Mobile Theme Toggle */}
              <Button
                variant='ghost'
                size='sm'
                onClick={toggleTheme}
                className='hover:bg-muted/50'>
                {theme === "light" ? (
                  <Moon className='h-4 w-4' />
                ) : (
                  <Sun className='h-4 w-4' />
                )}
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? (
                  <X className='h-6 w-6' />
                ) : (
                  <Menu className='h-6 w-6' />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className='md:hidden'>
              <div className='px-2 pt-2 pb-3 space-y-1 bg-background border-t border-border'>
                {/* Mobile Language Switcher */}
                <div className='px-3 py-2'>
                  <div className='text-sm font-medium text-muted-foreground mb-2'>
                    Language
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    {languages.map((lang) => (
                      <Button
                        key={lang.code}
                        variant={
                          currentLanguage === lang.code ? "default" : "outline"
                        }
                        size='sm'
                        onClick={() => changeLanguage(lang.code)}
                        className='flex items-center space-x-2'>
                        <span>{lang.flag}</span>
                        <span className='text-xs'>{lang.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Mobile Navigation Links */}
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className='block px-3 py-2 text-foreground hover:text-primary transition-colors duration-200'
                    onClick={() => setIsMenuOpen(false)}>
                    {item.name}
                  </Link>
                ))}

                {/* Mobile Auth Buttons */}
                <div className='px-3 py-2 space-y-2 border-t border-border mt-2 pt-4'>
                  <Link to='/login' onClick={() => setIsMenuOpen(false)}>
                    <Button variant='ghost' className='w-full justify-start'>
                      Login
                    </Button>
                  </Link>
                  <Link to='/signup' onClick={() => setIsMenuOpen(false)}>
                    <Button className='w-full bg-gradient-hero text-white shadow-primary'>
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      <ModernFooter />
    </div>
  );
}
