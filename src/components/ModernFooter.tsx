import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";

export default function ModernFooter() {

  const navigation = {
    company: [
      { name: "About Us", href: "/about" },
      { name: "Our Team", href: "/team" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
    ],
    platform: [
      { name: "Features", href: "/features" },
      { name: "Services", href: "/services" },
      { name: "Pricing", href: "/pricing" },
      { name: "API", href: "/api" },
    ],
    resources: [
      {
        name: "Blog",
        href: "https://morden-blog-site.vercel.app/",
        target: "_blank",
      },
      { name: "Help Center", href: "#help" },
      { name: "Community", href: "#community" },
      { name: "Partners", href: "#partners" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "GDPR", href: "/gdpr" },
    ],
  };

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
    { name: "YouTube", icon: Youtube, href: "#" },
  ];

  return (
    <footer className='bg-gradient-to-br from-background to-muted/30 border-t border-border/50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12'>
            {/* Brand Section */}
            <div className='lg:col-span-2'>
              <Link to='/' className='flex items-center space-x-3 mb-6'>
                <img
                  src='/logo.png'
                  alt='Career na Mimi Logo'
                  className='h-12 w-auto object-contain'
                />
              </Link>

              <p className='text-muted-foreground mb-6 leading-relaxed'>
                Empowering Tanzanian youth with AI-powered career development
                tools, mentorship, and opportunities to build their dream
                careers in the digital age.
              </p>

              {/* Contact Info */}
              <div className='space-y-3'>
                <div className='flex items-center text-muted-foreground'>
                  <MapPin className='h-4 w-4 mr-3 text-primary' />
                  <span>Arusha, Tanzania</span>
                </div>
                <div className='flex items-center text-muted-foreground'>
                  <Mail className='h-4 w-4 mr-3 text-primary' />
                  <span>info@careernamimi.org</span>
                </div>
                <div className='flex items-center text-muted-foreground'>
                  <Phone className='h-4 w-4 mr-3 text-primary' />
                  <span>+255 628 055 646/673 045 414</span>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div>
              <h3 className='font-semibold text-foreground mb-6 text-lg'>
                Company
              </h3>
              <ul className='space-y-3'>
                {navigation.company.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className='text-muted-foreground hover:text-primary transition-colors duration-200'>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className='font-semibold text-foreground mb-6 text-lg'>
                Platform
              </h3>
              <ul className='space-y-3'>
                {navigation.platform.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className='text-muted-foreground hover:text-primary transition-colors duration-200'>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className='font-semibold text-foreground mb-6 text-lg'>
                Resources
              </h3>
              <ul className='space-y-3'>
                {navigation.resources.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className='text-muted-foreground hover:text-primary transition-colors duration-200'>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className='font-semibold text-foreground mb-6 text-lg'>
                Legal
              </h3>
              <ul className='space-y-3'>
                {navigation.legal.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className='text-muted-foreground hover:text-primary transition-colors duration-200'>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social Links & Stats */}
          <div className='border-t border-border/50 mt-16 pt-8'>
            <div className='flex flex-col lg:flex-row justify-between items-center gap-8'>
              {/* Social Links */}
              <div className='flex items-center space-x-6'>
                <span className='text-muted-foreground font-medium'>
                  Follow Us:
                </span>
                <div className='flex space-x-4'>
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      className='text-muted-foreground hover:text-primary transition-colors duration-200'
                      aria-label={social.name}>
                      <social.icon className='h-5 w-5' />
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className='flex items-center space-x-8 text-sm text-muted-foreground'>
                <div className='text-center'>
                  <div className='font-bold text-primary text-lg'>200+</div>
                  <div>Youth Helped</div>
                </div>
                <div className='text-center'>
                  <div className='font-bold text-primary text-lg'>10+</div>
                  <div>Partners</div>
                </div>
                <div className='text-center'>
                  <div className='font-bold text-primary text-lg'>89%</div>
                  <div>Success Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className='border-t border-border/50 mt-8 pt-8'>
            <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
              <p className='text-muted-foreground text-center md:text-left'>
                © 2024 Career na Mimi. All rights reserved. Built in Tanzania.
              </p>

              <div className='flex items-center space-x-6 text-sm text-muted-foreground'>
                <span>Available in Swahili & English</span>
                <span>•</span>
                <span>Mobile Apps Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
    </footer>
  );
}
