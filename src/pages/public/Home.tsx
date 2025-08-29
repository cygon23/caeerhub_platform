import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Star, Users, TrendingUp, Award, ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import { useGSAP, useGSAPScale, useGSAPStagger } from "@/hooks/useGSAP";
import { useEffect } from "react";

export default function Home() {
  const heroRef = useGSAP();
  const statsRef = useGSAPStagger(0.2);
  const featuresRef = useGSAPStagger(0.3);
  const testimonialsRef = useGSAPStagger(0.15);

  const stats = [
    { number: "42,000+", label: "Youth Impacted", icon: Users },
    { number: "89%", label: "Career Success Rate", icon: TrendingUp },
    { number: "150+", label: "Partner Organizations", icon: Award },
    { number: "24/7", label: "AI Support Available", icon: Star },
  ];

  const testimonials = [
    {
      name: "Fatma Juma",
      role: "Software Developer",
      content:
        "Career na Mimi helped me discover my passion for technology and guided me through every step of becoming a developer.",
      rating: 5,
    },
    {
      name: "Daniel Moshi",
      role: "Agricultural Entrepreneur",
      content:
        "The AI-powered roadmap showed me how to turn my farming knowledge into a profitable agribusiness.",
      rating: 5,
    },
    {
      name: "Grace Kimaro",
      role: "Digital Marketer",
      content:
        "From student to successful freelancer in 8 months. The mentorship program was life-changing!",
      rating: 5,
    },
  ];

  const partners = [
    "TechnoServe",
    "USAID",
    "World Bank",
    "Vodacom Foundation",
    "Mastercard Foundation",
    "Google.org",
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className='relative min-h-screen flex items-center justify-center overflow-hidden'>
        <div className='absolute inset-0'>
          <img
            src={heroImage}
            alt='Young African professionals'
            className='w-full h-full object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/80'></div>
        </div>

        <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <div ref={heroRef}>
            <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6'>
              Discover Your
              <span className='block text-primary-light'>Dream Career</span>
            </h1>
            <p className='text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto'>
              AI-powered career development platform empowering Tanzanian youth
              to build successful careers through personalized guidance and
              mentorship.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
              <Link to='/signup'>
                <Button
                  size='lg'
                  className='bg-white text-primary hover:bg-white/90 text-lg px-8 py-4 shadow-elegant'>
                  Start Your Journey
                  <ArrowRight className='ml-2 h-5 w-5' />
                </Button>
              </Link>
              <Button
                size='lg'
                variant='outline'
                className='border-white text-white hover:bg-white/10 text-lg px-8 py-4'>
                <Play className='mr-2 h-5 w-5' />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='py-20 bg-gradient-card'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div
            ref={statsRef}
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {stats.map((stat, index) => (
              <Card
                key={stat.label}
                className='text-center hover:shadow-primary transition-all duration-300 border-0 bg-background/50 backdrop-blur-sm'>
                <CardContent className='p-6'>
                  <stat.icon className='h-12 w-12 text-primary mx-auto mb-4' />
                  <div className='text-3xl font-bold text-foreground mb-2'>
                    {stat.number}
                  </div>
                  <div className='text-muted-foreground'>{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className='py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-4xl font-bold text-foreground mb-4'>
            Powered by AI, Driven by
            <span className='bg-gradient-hero bg-clip-text text-transparent'>
              {" "}
              Purpose
            </span>
          </h2>
          <p className='text-xl text-muted-foreground mb-12 max-w-3xl mx-auto'>
            Our intelligent platform combines cutting-edge AI with local
            expertise to create personalized career pathways for every young
            Tanzanian.
          </p>

          <div
            ref={featuresRef}
            className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {[
              {
                title: "AI Career Assessment",
                description:
                  "Discover your strengths, interests, and ideal career matches through our advanced personality analysis.",
                icon: "🧠",
              },
              {
                title: "Smart Roadmap Generator",
                description:
                  "Get step-by-step career pathways tailored to your goals, skills, and local opportunities.",
                icon: "🗺️",
              },
              {
                title: "Expert Mentorship",
                description:
                  "Connect with successful professionals who guide you through real-world career challenges.",
                icon: "👥",
              },
            ].map((feature, index) => (
              <Card
                key={feature.title}
                className='hover:shadow-secondary transition-all duration-300 border-0 bg-gradient-card'>
                <CardContent className='p-8'>
                  <div className='text-4xl mb-4'>{feature.icon}</div>
                  <h3 className='text-xl font-semibold text-foreground mb-3'>
                    {feature.title}
                  </h3>
                  <p className='text-muted-foreground'>{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className='mt-12'>
            <Link to='/features'>
              <Button
                size='lg'
                className='bg-gradient-hero text-white shadow-primary'>
                Explore All Features
                <ArrowRight className='ml-2 h-5 w-5' />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className='py-20 bg-muted/30'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold text-foreground mb-4'>
              Success Stories
            </h2>
            <p className='text-xl text-muted-foreground'>
              Real stories from youth who transformed their careers with Career
              na Mimi
            </p>
          </div>

          <div
            ref={testimonialsRef}
            className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {testimonials.map((testimonial, index) => (
              <Card
                key={testimonial.name}
                className='hover:shadow-elegant transition-all duration-300'>
                <CardContent className='p-6'>
                  <div className='flex mb-4'>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className='h-5 w-5 text-yellow-400 fill-current'
                      />
                    ))}
                  </div>
                  <p className='text-muted-foreground mb-4 italic'>
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className='font-semibold text-foreground'>
                      {testimonial.name}
                    </div>
                    <div className='text-sm text-primary'>
                      {testimonial.role}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className='py-16 bg-background'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h3 className='text-2xl font-semibold text-muted-foreground mb-8'>
            Trusted by Leading Organizations
          </h3>
          <div className='grid grid-cols-2 md:grid-cols-6 gap-8 items-center'>
            {partners.map((partner, index) => (
              <div
                key={partner}
                className='text-muted-foreground hover:text-primary transition-colors duration-300'>
                <div className='font-medium text-sm md:text-base'>
                  {partner}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 bg-gradient-hero'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <div>
            <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
              Ready to Shape Your Future?
            </h2>
            <p className='text-xl text-white/90 mb-8'>
              Join thousands of young Tanzanians who are already building their
              dream careers.
            </p>
            <Link to='/signup'>
              <Button
                size='lg'
                className='bg-white text-primary hover:bg-white/90 text-lg px-12 py-4 shadow-elegant'>
                Get Started Free Today
                <ArrowRight className='ml-2 h-6 w-6' />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
