import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Star,
  Users,
  TrendingUp,
  Award,
  ArrowRight,
  Play,
  UserPlus,
  Brain,
  Handshake,
  ChevronDown,
  ChevronUp,
  Shield,
  Zap,
  Clock,
} from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import {
  useGSAP,
  useGSAPScale,
  useGSAPStagger,
  useGSAPTextReveal,
  useGSAPMorphing,
  useGSAPFlip,
  useGSAPMagnetic,
} from "@/hooks/useGSAP";
import { useEffect, useState } from "react";

export default function Home() {
  const heroRef = useGSAPTextReveal();
  const morphingRef = useGSAPMorphing();
  const statsRef = useGSAPStagger(0.1);
  const howItWorksRef = useGSAPStagger(0.2);
  const featuresRef = useGSAPStagger(0.15);
  const testimonialsRef = useGSAPStagger(0.1);
  const faqRef = useGSAPStagger(0.1);
  const ctaRef = useGSAPScale();

  const [openFAQ, setOpenFAQ] = useState(null);

  useEffect(() => {
    // Add scrolling animation styles
    const style = document.createElement("style");
    style.textContent = `
      @keyframes scroll {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(-50%);
        }
      }
      .animate-scroll {
        animation: scroll 30s linear infinite;
      }
      .animate-scroll:hover {
        animation-play-state: paused;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const stats = [
    { number: "42,000+", label: "Youth Impacted", icon: Users },
    { number: "89%", label: "Career Success Rate", icon: TrendingUp },
    { number: "150+", label: "Partner Organizations", icon: Award },
    { number: "24/7", label: "AI Support Available", icon: Star },
  ];

  const howItWorksSteps = [
    {
      step: "01",
      title: "Sign Up",
      description:
        "Create your free account and complete our comprehensive career assessment to understand your strengths and interests.",
      icon: UserPlus,
      color: "bg-blue-500",
    },
    {
      step: "02",
      title: "Get AI Insights",
      description:
        "Our AI analyzes your profile and generates personalized career recommendations with detailed roadmaps tailored to Tanzania's job market.",
      icon: Brain,
      color: "bg-purple-500",
    },
    {
      step: "03",
      title: "Connect & Grow",
      description:
        "Match with mentors, access learning resources, and connect with real opportunities to launch your dream career.",
      icon: Handshake,
      color: "bg-green-500",
    },
  ];

  const faqData = [
    {
      question: "Is Career na Mimi really free to use?",
      answer:
        "Yes! Our core features including AI career assessment, personalized roadmaps, and basic mentorship matching are completely free. We also offer premium features for advanced coaching and exclusive opportunities.",
    },
    {
      question: "How does your AI career matching work?",
      answer:
        "Our AI analyzes your skills, interests, personality, and local market data to suggest careers with high success potential. It considers Tanzania-specific opportunities and creates step-by-step pathways to reach your goals.",
    },
    {
      question: "Is my personal data safe and private?",
      answer:
        "Absolutely. We use bank-level encryption to protect your data and never share your personal information with third parties without your consent. You control what information you share with mentors and employers.",
    },
    {
      question: "What kind of mentors can I connect with?",
      answer:
        "Our mentors are successful professionals across various industries in Tanzania and globally. They're vetted experts who volunteer their time to guide young people through career development and real-world challenges.",
    },
    {
      question: "How long does it take to see results?",
      answer:
        "Many users report clarity on their career direction within the first week. Actual career progress varies, but our average user sees meaningful career advancement within 6-8 months of active platform use.",
    },
    {
      question: "Do you help with job placement?",
      answer:
        "While we don't guarantee job placement, we connect you with partner organizations, provide interview preparation, and alert you to relevant opportunities. Many users find employment through our network.",
    },
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

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className='relative min-h-screen flex items-center justify-center overflow-hidden'>
        <div className='absolute inset-0' ref={morphingRef}>
          <img
            src={heroImage}
            alt='Young African professionals'
            className='w-full h-full object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/80'></div>
        </div>

        {/* Floating particles */}
        <div className='absolute inset-0 overflow-hidden'>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className='absolute w-2 h-2 bg-white/20 rounded-full animate-float'
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}></div>
          ))}
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
                  className='bg-white text-primary hover:bg-white/90 text-lg px-8 py-4 shadow-elegant transform hover:scale-105 transition-all duration-300'>
                  Start Your Journey
                  <ArrowRight className='ml-2 h-5 w-5' />
                </Button>
              </Link>
              <Button
                size='lg'
                variant='outline'
                className='border-white text-black hover:bg-white/10 text-lg px-8 py-4 transform hover:scale-105 transition-all duration-300'>
                <Play className='mr-2 h-5 w-5' />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className='py-20 bg-gradient-to-br from-primary/5 to-secondary/5'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold text-foreground mb-4'>
              How It Works
            </h2>
            <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
              Get started in just 3 simple steps and begin your journey to
              career success
            </p>
          </div>

          <div
            ref={howItWorksRef}
            className='grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12'>
            {howItWorksSteps.map((step, index) => (
              <div key={step.step} className='relative text-center group'>
                {/* Connection line */}
                {index < howItWorksSteps.length - 1 && (
                  <div className='hidden md:block absolute top-20 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/30 to-secondary/30 transform translate-x-1/2 z-0'></div>
                )}

                <Card className='relative z-10 hover:shadow-primary transition-all duration-500 transform group-hover:-translate-y-2 border-0 bg-background/80 backdrop-blur-sm'>
                  <CardContent className='p-8'>
                    {/* Step number */}
                    <div className='absolute -top-4 left-1/2 transform -translate-x-1/2'>
                      <div className='bg-gradient-hero text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg'>
                        {step.step}
                      </div>
                    </div>

                    {/* Icon */}
                    <div
                      className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                      <step.icon className='h-8 w-8 text-white' />
                    </div>

                    {/* Content */}
                    <h3 className='text-2xl font-bold text-foreground mb-4'>
                      {step.title}
                    </h3>
                    <p className='text-muted-foreground leading-relaxed'>
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className='text-center mt-16'>
            <Link to='/signup'>
              <Button
                size='lg'
                className='bg-gradient-hero text-white shadow-primary transform hover:scale-105 transition-all duration-300'>
                Start Free Today
                <ArrowRight className='ml-2 h-5 w-5' />
              </Button>
            </Link>
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

      {/* FAQ Section */}
      <section className='py-20 bg-background'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold text-foreground mb-4'>
              Frequently Asked Questions
            </h2>
            <p className='text-xl text-muted-foreground'>
              Everything you need to know about Career na Mimi
            </p>
          </div>

          <div ref={faqRef} className='space-y-4'>
            {faqData.map((faq, index) => (
              <Card
                key={index}
                className='hover:shadow-primary transition-all duration-300 border border-muted cursor-pointer'
                onClick={() => toggleFAQ(index)}>
                <CardContent className='p-0'>
                  <div className='p-6 flex items-center justify-between'>
                    <h3 className='text-lg font-semibold text-foreground pr-8'>
                      {faq.question}
                    </h3>
                    <div className='flex-shrink-0'>
                      {openFAQ === index ? (
                        <ChevronUp className='h-5 w-5 text-primary' />
                      ) : (
                        <ChevronDown className='h-5 w-5 text-muted-foreground' />
                      )}
                    </div>
                  </div>

                  {openFAQ === index && (
                    <div className='px-6 pb-6 border-t border-muted/30'>
                      <div className='pt-4'>
                        <p className='text-muted-foreground leading-relaxed'>
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className='text-center mt-12'>
            <p className='text-muted-foreground mb-4'>Still have questions?</p>
            <Link to='/contact'>
              <Button variant='outline' size='lg'>
                Contact Support
                <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className='py-16 bg-muted/20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h3 className='text-2xl font-semibold text-muted-foreground mb-8'>
            Trusted by Leading Organizations
          </h3>
          <div className='relative overflow-hidden'>
            <div className='flex animate-scroll space-x-12 md:space-x-16'>
              {/* First set of partners */}
              {partners.map((partner, index) => (
                <div
                  key={`first-${partner}`}
                  className='text-muted-foreground hover:text-primary transition-colors duration-300 whitespace-nowrap flex-shrink-0'>
                  <div className='font-medium text-lg md:text-xl'>
                    {partner}
                  </div>
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {partners.map((partner, index) => (
                <div
                  key={`second-${partner}`}
                  className='text-muted-foreground hover:text-primary transition-colors duration-300 whitespace-nowrap flex-shrink-0'>
                  <div className='font-medium text-lg md:text-xl'>
                    {partner}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 bg-gradient-hero relative overflow-hidden'>
        {/* Animated background elements */}
        <div className='absolute inset-0'>
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className='absolute rounded-full bg-white/5 animate-pulse'
              style={{
                width: `${50 + Math.random() * 200}px`,
                height: `${50 + Math.random() * 200}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}></div>
          ))}
        </div>

        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10'>
          <div ref={ctaRef}>
            <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
              Ready to Shape Your Future?
            </h2>
            <p className='text-xl text-white/90 mb-8'>
              Join thousands of young Tanzanians who are already building their
              dream careers.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
              <Link to='/signup'>
                <Button
                  size='lg'
                  className='bg-white text-primary hover:bg-white/90 text-lg px-12 py-4 shadow-elegant transform hover:scale-110 transition-all duration-500'>
                  Get Started Free Today
                  <ArrowRight className='ml-2 h-6 w-6' />
                </Button>
              </Link>
              <div className='flex items-center space-x-6 text-white/80 text-sm'>
                <div className='flex items-center'>
                  <Shield className='h-4 w-4 mr-1' />
                  Secure
                </div>
                <div className='flex items-center'>
                  <Zap className='h-4 w-4 mr-1' />
                  Instant Setup
                </div>
                <div className='flex items-center'>
                  <Clock className='h-4 w-4 mr-1' />
                  24/7 Support
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
