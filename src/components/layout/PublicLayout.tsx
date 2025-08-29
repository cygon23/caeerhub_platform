import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Features', href: '/features' },
    { name: 'Services', href: '/services' },
    { name: 'Partners', href: '/partners' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <div className='min-h-screen bg-background'>
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

            {/* Auth Buttons */}
            <div className='hidden md:flex items-center space-x-4'>
              <Link to='/login'>
                <Button
                  variant='ghost'
                  className='text-foreground hover:text-primary'>
                  Login
                </Button>
              </Link>
              <Link to='/signup'>
                <Button className='bg-gradient-hero text-white shadow-primary hover:opacity-90'>
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className='md:hidden'>
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
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className='block px-3 py-2 text-foreground hover:text-primary transition-colors duration-200'
                    onClick={() => setIsMenuOpen(false)}>
                    {item.name}
                  </Link>
                ))}
                <div className='px-3 py-2 space-y-2'>
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

      {/* Footer */}
      <footer className='bg-muted/30 border-t border-border'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
            <div className='col-span-1 md:col-span-2'>
              <Link to='/' className='flex items-center space-x-2 mb-4'>
                <div className='w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center'>
                  <span className='text-white font-bold text-sm'>C</span>
                </div>
                <span className='text-xl font-bold bg-gradient-hero bg-clip-text text-transparent'>
                  Career na Mimi
                </span>
              </Link>
              <p className='text-muted-foreground max-w-md'>
                Empowering Tanzanian youth with AI-powered career development
                tools, mentorship, and opportunities to build their dream
                careers.
              </p>
            </div>

            <div>
              <h3 className='font-semibold text-foreground mb-4'>
                Quick Links
              </h3>
              <div className='space-y-2'>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className='block text-muted-foreground hover:text-primary transition-colors'>
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className='font-semibold text-foreground mb-4'>Connect</h3>
              <div className='space-y-2'>
                <p className='text-muted-foreground'>Dar es Salaam, Tanzania</p>
                <p className='text-muted-foreground'>info@careernamimi.co.tz</p>
                <p className='text-muted-foreground'>+255 123 456 789</p>
              </div>
            </div>
          </div>

          <div className='border-t border-border mt-8 pt-8 text-center'>
            <p className='text-muted-foreground'>
              © 2024 Career na Mimi. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}