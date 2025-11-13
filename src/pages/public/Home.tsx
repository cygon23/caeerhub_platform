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
  UserPlus,
  Brain,
  Target,
  Lightbulb,
  Compass,
  UserCheck,
  LineChart,
  BookOpen,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Shield,
  Zap,
  Clock,
  Rocket,
  Sparkles,
  MapPin,
  CheckCircle2,
  MessageSquare,
  TrendingUpIcon,
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
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  const storyBeats = [
    "Every great career begins with a question...",
    "What if you could discover your true potential?",
    "Transform uncertainty into clarity.",
    "Your journey starts here.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStoryIndex((prev) => (prev + 1) % storyBeats.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

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

      @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translateY(10px); }
        10%, 90% { opacity: 1; transform: translateY(0); }
      }
      .story-text {
        animation: fadeInOut 3.5s ease-in-out;
      }

      @keyframes ripple {
        0% {
          transform: scale(1);
          opacity: 1;
        }
        100% {
          transform: scale(1.5);
          opacity: 0;
        }
      }
      .animate-ripple {
        animation: ripple 2s ease-out infinite;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const stats = [
    { number: "42,000+", label: "Youth Impacted", icon: Users, color: "text-blue-500" },
    { number: "89%", label: "Career Success Rate", icon: TrendingUp, color: "text-green-500" },
    { number: "150+", label: "Partner Organizations", icon: Award, color: "text-purple-500" },
    { number: "24/7", label: "AI Support Available", icon: Sparkles, color: "text-amber-500" },
  ];

  const howItWorksSteps = [
    {
      step: "01",
      title: "Discover Yourself",
      description:
        "Embark on a journey of self-discovery with our AI-powered career assessment. Uncover your hidden strengths, passions, and the career paths that align with who you truly are.",
      icon: Compass,
      color: "from-blue-500 to-cyan-500",
      accentColor: "bg-blue-500/10",
    },
    {
      step: "02",
      title: "Chart Your Path",
      description:
        "Receive a personalized roadmap designed specifically for you. Our AI analyzes Tanzania's dynamic job market to create actionable steps that transform your dreams into achievable milestones.",
      icon: MapPin,
      color: "from-purple-500 to-pink-500",
      accentColor: "bg-purple-500/10",
    },
    {
      step: "03",
      title: "Grow With Experts",
      description:
        "Connect with industry leaders and mentors who've walked your path. Access exclusive resources, real opportunities, and a community that believes in your potential.",
      icon: Rocket,
      color: "from-green-500 to-emerald-500",
      accentColor: "bg-green-500/10",
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
      location: "Dar es Salaam",
      content:
        "Career na Mimi didn't just help me find a job—it helped me discover a passion I didn't know I had. The AI assessment revealed my analytical thinking strengths, and the mentorship program guided me every step of the way.",
      rating: 5,
      metric: "From student to developer in 8 months",
    },
    {
      name: "Daniel Moshi",
      role: "Agricultural Entrepreneur",
      location: "Arusha",
      content:
        "I thought farming was all I knew. The platform showed me how to turn traditional knowledge into a modern agribusiness. Today, I employ 15 people and supply three major markets.",
      rating: 5,
      metric: "3x revenue increase in first year",
    },
    {
      name: "Grace Kimaro",
      role: "Digital Marketer",
      location: "Mwanza",
      content:
        "The personalized learning modules and mentor connections transformed me from a confused graduate to a confident freelancer serving international clients. This platform changed my life.",
      rating: 5,
      metric: "Now earning TZS 2.5M monthly",
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

  const impactFeatures = [
    {
      title: "AI-Powered Personality Test",
      description:
        "Dive deep into your unique strengths with our scientifically-backed assessment that reveals career paths you never imagined.",
      icon: Brain,
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-500",
    },
    {
      title: "Smart Career Roadmap",
      description:
        "Your personalized blueprint for success, with step-by-step guidance tailored to Tanzania's opportunities and your unique goals.",
      icon: Target,
      gradient: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-500",
    },
    {
      title: "Expert Mentorship Network",
      description:
        "Learn from those who've succeeded. Get guidance, feedback, and insights from industry leaders who genuinely care about your growth.",
      icon: UserCheck,
      gradient: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-500",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <PublicLayout>
      {/* Hero Section - Storytelling Approach */}
      <section className='relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900'>
        {/* Animated background layers */}
        <div className='absolute inset-0'>
          {/* Grid overlay */}
          <div className='absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]'></div>

          {/* Floating orbs */}
          <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse'></div>
          <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse' style={{ animationDelay: '1s' }}></div>

          {/* Floating particles */}
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className='absolute w-1 h-1 bg-white/30 rounded-full animate-float'
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}></div>
          ))}
        </div>

        <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div ref={heroRef} className='text-center'>
            {/* Story beat - changes every 3.5 seconds */}
            <div className='mb-8 h-12'>
              <p
                key={currentStoryIndex}
                className='story-text text-lg md:text-xl text-blue-300/80 font-light italic'>
                {storyBeats[currentStoryIndex]}
              </p>
            </div>

            {/* Main headline */}
            <h1 className='text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight'>
              <span className='bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent'>
                Where Dreams Meet
              </span>
              <br />
              <span className='bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'>
                Direction
              </span>
            </h1>

            {/* Subheadline */}
            <p className='text-xl md:text-2xl text-slate-300 mb-4 max-w-4xl mx-auto leading-relaxed'>
              Tanzania's most intelligent career development platform.
              <span className='block mt-2 text-blue-300'>
                Powered by AI. Driven by your potential. Built for your success.
              </span>
            </p>

            {/* Trust indicators */}
            <div className='flex flex-wrap justify-center items-center gap-8 mb-12 text-slate-400 text-sm'>
              <div className='flex items-center gap-2'>
                <CheckCircle2 className='h-5 w-5 text-green-400' />
                <span>42,000+ Youth Empowered</span>
              </div>
              <div className='flex items-center gap-2'>
                <CheckCircle2 className='h-5 w-5 text-green-400' />
                <span>89% Success Rate</span>
              </div>
              <div className='flex items-center gap-2'>
                <CheckCircle2 className='h-5 w-5 text-green-400' />
                <span>100% Free to Start</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className='flex flex-col sm:flex-row gap-6 justify-center items-center mb-16'>
              <Link to='/signup'>
                <Button
                  size='lg'
                  className='group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-lg px-10 py-7 shadow-2xl shadow-blue-500/50 transform hover:scale-105 transition-all duration-300 border-0'>
                  <span className='flex items-center gap-2'>
                    Begin Your Journey
                    <ArrowRight className='h-5 w-5 group-hover:translate-x-1 transition-transform' />
                  </span>
                  {/* Ripple effect */}
                  <span className='absolute inset-0 rounded-lg bg-white/20 animate-ripple'></span>
                </Button>
              </Link>
              <Link to='/features'>
                <Button
                  size='lg'
                  variant='outline'
                  className='border-2 border-slate-600 bg-slate-900/50 backdrop-blur-sm text-white hover:bg-slate-800/80 hover:border-slate-500 text-lg px-10 py-7 transform hover:scale-105 transition-all duration-300'>
                  <Lightbulb className='mr-2 h-5 w-5 text-yellow-400' />
                  Explore Features
                </Button>
              </Link>
            </div>

            {/* Scroll indicator */}
            <div className='animate-bounce'>
              <ChevronDown className='h-8 w-8 text-slate-500 mx-auto' />
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats Section - Redesigned */}
      <section className='py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold text-foreground mb-4'>
              Real Impact, Real Results
            </h2>
            <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
              Numbers that tell the story of transformation across Tanzania
            </p>
          </div>

          <div
            ref={statsRef}
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {stats.map((stat, index) => (
              <Card
                key={stat.label}
                className='group relative overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800'>
                {/* Gradient accent */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color === 'text-blue-500' ? 'from-blue-500 to-cyan-500' : stat.color === 'text-green-500' ? 'from-green-500 to-emerald-500' : stat.color === 'text-purple-500' ? 'from-purple-500 to-pink-500' : 'from-amber-500 to-orange-500'}`}></div>

                <CardContent className='p-8 text-center relative'>
                  {/* Icon with glow effect */}
                  <div className='relative inline-block mb-6'>
                    <div className={`absolute inset-0 ${stat.color} opacity-20 blur-xl group-hover:opacity-40 transition-opacity`}></div>
                    <stat.icon className={`relative h-14 w-14 ${stat.color} mx-auto`} />
                  </div>

                  {/* Number */}
                  <div className='text-4xl md:text-5xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300'>
                    {stat.number}
                  </div>

                  {/* Label */}
                  <div className='text-muted-foreground font-medium'>{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section - Redesigned */}
      <section className='py-24 bg-white dark:bg-slate-950 relative overflow-hidden'>
        {/* Background decoration */}
        <div className='absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,black,rgba(0,0,0,0.6))]'></div>

        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-20'>
            <h2 className='text-4xl md:text-5xl font-bold text-foreground mb-6'>
              Your Journey in{" "}
              <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                Three Steps
              </span>
            </h2>
            <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
              A proven pathway that has guided thousands of Tanzanian youth from confusion to clarity, from potential to success
            </p>
          </div>

          <div
            ref={howItWorksRef}
            className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
            {howItWorksSteps.map((step, index) => (
              <div key={step.step} className='relative group'>
                {/* Connection line */}
                {index < howItWorksSteps.length - 1 && (
                  <div className='hidden lg:block absolute top-32 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-transparent z-0'></div>
                )}

                <Card className='relative z-10 h-full hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 group-hover:-translate-y-3'>
                  <CardContent className='p-8'>
                    {/* Step number badge */}
                    <div className='absolute -top-6 left-8'>
                      <div className={`bg-gradient-to-r ${step.color} text-white w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                        {step.step}
                      </div>
                    </div>

                    {/* Icon container */}
                    <div className={`mt-8 mb-8 relative inline-block p-6 rounded-3xl bg-gradient-to-br ${step.accentColor} backdrop-blur-sm`}>
                      <div className={`absolute inset-0 bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-20 rounded-3xl blur-xl transition-opacity duration-300`}></div>
                      <step.icon className={`relative h-12 w-12 bg-gradient-to-r ${step.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text' }} />
                    </div>

                    {/* Content */}
                    <h3 className='text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors'>
                      {step.title}
                    </h3>
                    <p className='text-muted-foreground leading-relaxed text-base'>
                      {step.description}
                    </p>

                    {/* Decorative element */}
                    <div className={`mt-6 h-1 w-16 bg-gradient-to-r ${step.color} rounded-full transform origin-left group-hover:scale-x-150 transition-transform duration-500`}></div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className='text-center mt-16'>
            <Link to='/signup'>
              <Button
                size='lg'
                className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-2xl shadow-blue-500/50 transform hover:scale-105 transition-all duration-300 px-12 py-6 text-lg'>
                Start Your Transformation
                <ArrowRight className='ml-2 h-5 w-5' />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Preview - Redesigned */}
      <section className='py-24 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-20'>
            <h2 className='text-4xl md:text-5xl font-bold text-foreground mb-6'>
              Powered by Intelligence,{" "}
              <span className='bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
                Guided by Heart
              </span>
            </h2>
            <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
              Cutting-edge AI technology meets human expertise to create a platform that understands you, guides you, and grows with you
            </p>
          </div>

          <div
            ref={featuresRef}
            className='grid grid-cols-1 md:grid-cols-3 gap-10'>
            {impactFeatures.map((feature, index) => (
              <Card
                key={feature.title}
                className='group relative overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-white dark:bg-slate-900 hover:-translate-y-2'>
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                <CardContent className='relative p-10'>
                  {/* Icon */}
                  <div className='relative mb-8'>
                    <div className={`absolute inset-0 ${feature.iconColor} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity`}></div>
                    <feature.icon className={`relative h-16 w-16 ${feature.iconColor}`} />
                  </div>

                  {/* Title */}
                  <h3 className='text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors'>
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className='text-muted-foreground leading-relaxed mb-6'>
                    {feature.description}
                  </p>

                  {/* Link */}
                  <div className='flex items-center text-primary font-semibold group-hover:gap-3 gap-2 transition-all'>
                    <span>Learn more</span>
                    <ArrowRight className='h-4 w-4 group-hover:translate-x-1 transition-transform' />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className='text-center mt-16'>
            <Link to='/features'>
              <Button
                size='lg'
                variant='outline'
                className='border-2 border-primary hover:bg-primary hover:text-white px-10 py-6 text-lg transform hover:scale-105 transition-all duration-300'>
                Explore All 9 Features
                <Sparkles className='ml-2 h-5 w-5' />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials - Redesigned */}
      <section className='py-24 bg-white dark:bg-slate-950'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-20'>
            <h2 className='text-4xl md:text-5xl font-bold text-foreground mb-6'>
              Stories of{" "}
              <span className='bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent'>
                Transformation
              </span>
            </h2>
            <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
              Real people. Real journeys. Real success. These are the faces of Tanzania's future.
            </p>
          </div>

          <div
            ref={testimonialsRef}
            className='grid grid-cols-1 md:grid-cols-3 gap-10'>
            {testimonials.map((testimonial, index) => (
              <Card
                key={testimonial.name}
                className='group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 hover:-translate-y-2'>
                <CardContent className='p-8'>
                  {/* Quote mark */}
                  <MessageSquare className='h-10 w-10 text-primary/20 mb-6' />

                  {/* Rating */}
                  <div className='flex mb-6'>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className='h-5 w-5 text-amber-400 fill-amber-400'
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <p className='text-muted-foreground mb-6 leading-relaxed text-base italic'>
                    "{testimonial.content}"
                  </p>

                  {/* Metric badge */}
                  <div className='inline-flex items-center gap-2 bg-green-500/10 text-green-600 dark:text-green-400 px-4 py-2 rounded-full text-sm font-semibold mb-6'>
                    <TrendingUpIcon className='h-4 w-4' />
                    {testimonial.metric}
                  </div>

                  {/* Author info */}
                  <div className='flex items-center gap-4 pt-6 border-t border-muted'>
                    <div className='w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg'>
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className='font-bold text-foreground'>
                        {testimonial.name}
                      </div>
                      <div className='text-sm text-primary font-medium'>
                        {testimonial.role}
                      </div>
                      <div className='text-xs text-muted-foreground flex items-center gap-1'>
                        <MapPin className='h-3 w-3' />
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className='text-center mt-16'>
            <p className='text-muted-foreground mb-6 text-lg'>
              Join thousands of success stories across Tanzania
            </p>
            <Link to='/signup'>
              <Button
                size='lg'
                className='bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-2xl shadow-green-500/50 px-10 py-6 text-lg'>
                Write Your Success Story
                <ArrowRight className='ml-2 h-5 w-5' />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section - Enhanced */}
      <section className='py-24 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold text-foreground mb-6'>
              Questions? We've Got{" "}
              <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                Answers
              </span>
            </h2>
            <p className='text-xl text-muted-foreground'>
              Everything you need to know about starting your journey with Career na Mimi
            </p>
          </div>

          <div ref={faqRef} className='space-y-4'>
            {faqData.map((faq, index) => (
              <Card
                key={index}
                className='hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-slate-900 cursor-pointer overflow-hidden'
                onClick={() => toggleFAQ(index)}>
                <CardContent className='p-0'>
                  <div className='p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors'>
                    <h3 className='text-lg font-semibold text-foreground pr-8'>
                      {faq.question}
                    </h3>
                    <div className='flex-shrink-0'>
                      {openFAQ === index ? (
                        <ChevronUp className='h-6 w-6 text-primary' />
                      ) : (
                        <ChevronDown className='h-6 w-6 text-muted-foreground' />
                      )}
                    </div>
                  </div>

                  {openFAQ === index && (
                    <div className='px-6 pb-6 bg-slate-50 dark:bg-slate-800/30'>
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
            <p className='text-muted-foreground mb-4 text-lg'>
              Still have questions? Our team is here to help.
            </p>
            <Link to='/contact'>
              <Button variant='outline' size='lg' className='border-2 hover:bg-primary hover:text-white hover:border-primary px-8 py-6'>
                Contact Our Team
                <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Partners - Enhanced */}
      <section className='py-20 bg-white dark:bg-slate-950'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h3 className='text-2xl font-semibold text-muted-foreground mb-12'>
            Trusted by Leading Organizations Across Africa & Beyond
          </h3>
          <div className='relative overflow-hidden'>
            <div className='flex animate-scroll space-x-16'>
              {/* First set of partners */}
              {partners.map((partner, index) => (
                <div
                  key={`first-${partner}`}
                  className='text-muted-foreground hover:text-primary transition-colors duration-300 whitespace-nowrap flex-shrink-0 font-semibold text-xl'>
                  {partner}
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {partners.map((partner, index) => (
                <div
                  key={`second-${partner}`}
                  className='text-muted-foreground hover:text-primary transition-colors duration-300 whitespace-nowrap flex-shrink-0 font-semibold text-xl'>
                  {partner}
                </div>
              ))}
            </div>
          </div>
          <div className='mt-12'>
            <Link to='/partners'>
              <Button variant='outline' size='lg' className='border-2'>
                View All Partners
                <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Redesigned */}
      <section className='relative py-32 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 overflow-hidden'>
        {/* Animated background */}
        <div className='absolute inset-0'>
          <div className='absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:4rem_4rem]'></div>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className='absolute rounded-full bg-white/5 animate-pulse'
              style={{
                width: `${50 + Math.random() * 150}px`,
                height: `${50 + Math.random() * 150}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}></div>
          ))}
        </div>

        <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10'>
          <div ref={ctaRef}>
            {/* Badge */}
            <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-white mb-8 border border-white/20'>
              <Sparkles className='h-5 w-5 text-yellow-300' />
              <span className='font-semibold'>Join 42,000+ Youth Already Succeeding</span>
            </div>

            <h2 className='text-5xl md:text-6xl font-bold text-white mb-8 leading-tight'>
              Your Future is Waiting.
              <span className='block mt-2 bg-gradient-to-r from-blue-300 to-pink-300 bg-clip-text text-transparent'>
                Let's Build It Together.
              </span>
            </h2>

            <p className='text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed'>
              Every success story started with a single step. Take yours today—completely free, no credit card required.
            </p>

            <div className='flex flex-col sm:flex-row gap-6 justify-center items-center mb-12'>
              <Link to='/signup'>
                <Button
                  size='lg'
                  className='group bg-white text-blue-900 hover:bg-blue-50 text-xl px-16 py-8 shadow-2xl transform hover:scale-110 transition-all duration-500 font-bold'>
                  Start Free Now
                  <ArrowRight className='ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform' />
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className='flex flex-wrap justify-center items-center gap-8 text-white/70 text-sm'>
              <div className='flex items-center gap-2'>
                <Shield className='h-5 w-5 text-green-300' />
                <span>Bank-Level Security</span>
              </div>
              <div className='flex items-center gap-2'>
                <Zap className='h-5 w-5 text-yellow-300' />
                <span>2-Minute Setup</span>
              </div>
              <div className='flex items-center gap-2'>
                <Clock className='h-5 w-5 text-blue-300' />
                <span>24/7 Support</span>
              </div>
              <div className='flex items-center gap-2'>
                <CheckCircle2 className='h-5 w-5 text-purple-300' />
                <span>No Credit Card</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
