import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGSAP, useGSAPStagger } from "@/hooks/useGSAP";
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
  Heart,
} from "lucide-react";

export default function ModernFooter() {
  const footerRef = useGSAP();
  const staggerRef = useGSAPStagger(0.1);

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
      { name: "Blog", href: "/blog" },
      { name: "Help Center", href: "/help" },
      { name: "Community", href: "/community" },
      { name: "Partners", href: "/partners" },
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
    <footer
      ref={footerRef}
      className='bg-gradient-to-br from-background to-muted/30 border-t border-border/50 overflow-hidden relative'>
      {/* Decorative background elements */}
      <div className='absolute inset-0 opacity-5'>
        <div className='absolute -top-24 -right-24 w-96 h-96 bg-primary rounded-full blur-3xl'></div>
        <div className='absolute -bottom-24 -left-24 w-96 h-96 bg-secondary rounded-full blur-3xl'></div>
      </div>

      <div className='relative'>
        {/* Main Footer Content */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
          <div
            ref={staggerRef}
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12'>
            {/* Brand Section */}
            <div className='lg:col-span-2'>
              <Link to='/' className='flex items-center space-x-3 mb-6'>
                <div className='w-12 h-12 bg-gradient-hero rounded-2xl flex items-center justify-center shadow-primary'>
                  <span className='text-white font-bold text-lg'>C</span>
                </div>
                <span className='text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent'>
                  Career na Mimi
                </span>
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
                  <span>Dar es Salaam, Tanzania</span>
                </div>
                <div className='flex items-center text-muted-foreground'>
                  <Mail className='h-4 w-4 mr-3 text-primary' />
                  <span>info@careernamimi.co.tz</span>
                </div>
                <div className='flex items-center text-muted-foreground'>
                  <Phone className='h-4 w-4 mr-3 text-primary' />
                  <span>+255 123 456 789</span>
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
                      className='text-muted-foreground hover:text-primary transition-colors duration-200 hover:translate-x-1 inline-block'>
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
                      className='text-muted-foreground hover:text-primary transition-colors duration-200 hover:translate-x-1 inline-block'>
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
                      className='text-muted-foreground hover:text-primary transition-colors duration-200 hover:translate-x-1 inline-block'>
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
                      className='text-muted-foreground hover:text-primary transition-colors duration-200 hover:translate-x-1 inline-block'>
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
                      className='text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110 hover:-translate-y-1'
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
                  <div className='font-bold text-primary text-lg'>150+</div>
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
                © 2024 Career na Mimi. All rights reserved. Built with{" "}
                <Heart className='inline h-4 w-4 text-red-500 fill-current' />{" "}
                in Tanzania.
              </p>

              <div className='flex items-center space-x-6 text-sm text-muted-foreground'>
                <span>🌍 Available in Swahili & English</span>
                <span>•</span>
                <span>📱 Mobile Apps Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
