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
  Heart,
  Cpu,
  Network,
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

      @keyframes pulse-glow {
        0%, 100% {
          opacity: 0.4;
          transform: scale(1);
        }
        50% {
          opacity: 0.8;
          transform: scale(1.1);
        }
      }
      .pulse-glow {
        animation: pulse-glow 3s ease-in-out infinite;
      }

      @keyframes float-slow {
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-20px);
        }
      }
      .float-slow {
        animation: float-slow 6s ease-in-out infinite;
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
    { number: "24/7", label: "AI Support Available", icon: Sparkles },
  ];

  const howItWorksSteps = [
    {
      step: "01",
      title: "Discover Yourself",
      description:
        "Embark on a journey of self-discovery with our AI-powered career assessment. Uncover your hidden strengths, passions, and the career paths that align with who you truly are.",
      icon: Compass,
    },
    {
      step: "02",
      title: "Chart Your Path",
      description:
        "Receive a personalized roadmap designed specifically for you. Our AI analyzes Tanzania's dynamic job market to create actionable steps that transform your dreams into achievable milestones.",
      icon: MapPin,
    },
    {
      step: "03",
      title: "Grow With Experts",
      description:
        "Connect with industry leaders and mentors who've walked your path. Access exclusive resources, real opportunities, and a community that believes in your potential.",
      icon: Rocket,
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
    },
    {
      title: "Smart Career Roadmap",
      description:
        "Your personalized blueprint for success, with step-by-step guidance tailored to Tanzania's opportunities and your unique goals.",
      icon: Target,
    },
    {
      title: "Expert Mentorship Network",
      description:
        "Learn from those who've succeeded. Get guidance, feedback, and insights from industry leaders who genuinely care about your growth.",
      icon: UserCheck,
    },
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <PublicLayout>
      {/* Hero Section - Technology + Humanity = Youth Success */}
      <section className='relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-slate-950'>
        {/* Split background - Pink left, Green right */}
        <div className='absolute inset-0'>
          <div className='absolute inset-y-0 left-0 w-1/2 bg-gradient-to-br from-[#FE047F] to-[#FE047F]/80'></div>
          <div className='absolute inset-y-0 right-0 w-1/2 bg-gradient-to-bl from-[#00690D] to-[#00690D]/80'></div>

          {/* Diagonal merge line with glow */}
          <div className='absolute inset-0 bg-gradient-to-r from-[#FE047F]/50 via-white to-[#00690D]/50 transform -skew-x-12 left-1/4 w-1/2'></div>
        </div>

        {/* Floating icons representing technology + humanity */}
        <div className='absolute inset-0 overflow-hidden'>
          {/* Technology side - Pink */}
          <div className='absolute top-1/4 left-[15%] float-slow'>
            <Cpu className='h-16 w-16 text-white/30' />
          </div>
          <div className='absolute top-1/2 left-[10%] float-slow' style={{ animationDelay: '1s' }}>
            <Brain className='h-20 w-20 text-white/40' />
          </div>
          <div className='absolute bottom-1/4 left-[20%] float-slow' style={{ animationDelay: '2s' }}>
            <Sparkles className='h-14 w-14 text-white/30' />
          </div>

          {/* Humanity side - Green */}
          <div className='absolute top-1/4 right-[15%] float-slow' style={{ animationDelay: '0.5s' }}>
            <Heart className='h-16 w-16 text-white/30' />
          </div>
          <div className='absolute top-1/2 right-[10%] float-slow' style={{ animationDelay: '1.5s' }}>
            <Users className='h-20 w-20 text-white/40' />
          </div>
          <div className='absolute bottom-1/4 right-[20%] float-slow' style={{ animationDelay: '2.5s' }}>
            <UserCheck className='h-14 w-14 text-white/30' />
          </div>

          {/* Connection/Network in center */}
          <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pulse-glow'>
            <Network className='h-32 w-32 text-white/50' />
          </div>
        </div>

        <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div ref={heroRef} className='text-center'>
            {/* Main concept visual */}
            <div className='mb-12'>
              <div className='flex items-center justify-center gap-8 mb-8'>
                {/* Technology */}
                <div className='flex flex-col items-center gap-3'>
                  <div className='w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white flex items-center justify-center shadow-2xl'>
                    <Cpu className='h-10 w-10 text-white' />
                  </div>
                  <span className='text-white font-bold text-lg'>Technology</span>
                </div>

                {/* Plus symbol */}
                <div className='text-6xl font-bold text-white'>+</div>

                {/* Humanity */}
                <div className='flex flex-col items-center gap-3'>
                  <div className='w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white flex items-center justify-center shadow-2xl'>
                    <Heart className='h-10 w-10 text-white' />
                  </div>
                  <span className='text-white font-bold text-lg'>Humanity</span>
                </div>

                {/* Equals symbol */}
                <div className='text-6xl font-bold text-white'>=</div>

                {/* Youth Success */}
                <div className='flex flex-col items-center gap-3'>
                  <div className='w-20 h-20 rounded-2xl bg-white backdrop-blur-sm border-2 border-white flex items-center justify-center shadow-2xl'>
                    <Rocket className='h-10 w-10 text-[#FE047F]' />
                  </div>
                  <span className='text-white font-bold text-lg'>Youth Success</span>
                </div>
              </div>
            </div>

            {/* Main headline */}
            <h1 className='text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight'>
              <span className='text-white'>
                Where AI Meets
              </span>
              <br />
              <span className='text-white'>
                Humanity for
              </span>
              <br />
              <span className='inline-block px-6 py-2 bg-white text-[#FE047F] rounded-2xl'>
                Youth Success
              </span>
            </h1>

            {/* Subheadline */}
            <p className='text-xl md:text-2xl text-white mb-4 max-w-4xl mx-auto leading-relaxed font-medium'>
              Combining cutting-edge technology with human expertise to empower
              <span className='block mt-2 text-white font-bold'>
                Tanzanian youth and build stronger communities together.
              </span>
            </p>

            {/* Trust indicators */}
            <div className='flex flex-wrap justify-center items-center gap-8 mb-12 text-white text-sm'>
              <div className='flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full'>
                <CheckCircle2 className='h-5 w-5' />
                <span>42,000+ Youth Empowered</span>
              </div>
              <div className='flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full'>
                <CheckCircle2 className='h-5 w-5' />
                <span>89% Success Rate</span>
              </div>
              <div className='flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full'>
                <CheckCircle2 className='h-5 w-5' />
                <span>100% Free to Start</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className='flex flex-col sm:flex-row gap-6 justify-center items-center mb-16'>
              <Link to='/signup'>
                <Button
                  size='lg'
                  className='group relative bg-white text-[#FE047F] hover:bg-white/90 text-lg px-10 py-7 shadow-2xl transform hover:scale-105 transition-all duration-300 border-0 font-bold'>
                  <span className='flex items-center gap-2'>
                    Begin Your Journey
                    <ArrowRight className='h-5 w-5 group-hover:translate-x-1 transition-transform' />
                  </span>
                </Button>
              </Link>
              <Link to='/features'>
                <Button
                  size='lg'
                  variant='outline'
                  className='border-2 border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 text-lg px-10 py-7 transform hover:scale-105 transition-all duration-300 font-bold'>
                  <Lightbulb className='mr-2 h-5 w-5' />
                  Explore Features
                </Button>
              </Link>
            </div>

            {/* Scroll indicator */}
            <div className='animate-bounce'>
              <ChevronDown className='h-8 w-8 text-white mx-auto' />
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className='py-20 bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900'>
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
                className='group relative overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-white dark:bg-slate-900'>
                {/* Gradient accent - alternating colors */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${index % 2 === 0 ? 'bg-[#FE047F]' : 'bg-[#00690D]'}`}></div>

                <CardContent className='p-8 text-center relative'>
                  {/* Icon with glow effect */}
                  <div className='relative inline-block mb-6'>
                    <div className={`absolute inset-0 ${index % 2 === 0 ? 'bg-[#FE047F]' : 'bg-[#00690D]'} opacity-20 blur-xl group-hover:opacity-40 transition-opacity`}></div>
                    <stat.icon className={`relative h-14 w-14 ${index % 2 === 0 ? 'text-[#FE047F]' : 'text-[#00690D]'} mx-auto`} />
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

      {/* How It Works Section */}
      <section className='py-24 bg-white dark:bg-slate-950 relative overflow-hidden'>
        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-20'>
            <h2 className='text-4xl md:text-5xl font-bold text-foreground mb-6'>
              Your Journey in{" "}
              <span className='text-[#FE047F]'>
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
                  <div className='hidden lg:block absolute top-32 left-[60%] w-[80%] h-0.5 bg-[#FE047F]/30 z-0'></div>
                )}

                <Card className='relative z-10 h-full hover:shadow-2xl transition-all duration-500 border-0 bg-white dark:bg-slate-900 group-hover:-translate-y-3'>
                  <CardContent className='p-8'>
                    {/* Step number badge */}
                    <div className='absolute -top-6 left-8'>
                      <div className={`${index % 2 === 0 ? 'bg-[#FE047F]' : 'bg-[#00690D]'} text-white w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                        {step.step}
                      </div>
                    </div>

                    {/* Icon container */}
                    <div className={`mt-8 mb-8 relative inline-block p-6 rounded-3xl ${index % 2 === 0 ? 'bg-[#FE047F]/10' : 'bg-[#00690D]/10'} backdrop-blur-sm`}>
                      <step.icon className={`relative h-12 w-12 ${index % 2 === 0 ? 'text-[#FE047F]' : 'text-[#00690D]'}`} />
                    </div>

                    {/* Content */}
                    <h3 className='text-2xl font-bold text-foreground mb-4'>
                      {step.title}
                    </h3>
                    <p className='text-muted-foreground leading-relaxed text-base'>
                      {step.description}
                    </p>

                    {/* Decorative element */}
                    <div className={`mt-6 h-1 w-16 ${index % 2 === 0 ? 'bg-[#FE047F]' : 'bg-[#00690D]'} rounded-full transform origin-left group-hover:scale-x-150 transition-transform duration-500`}></div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className='text-center mt-16'>
            <Link to='/signup'>
              <Button
                size='lg'
                className='bg-[#FE047F] hover:bg-[#FE047F]/90 text-white shadow-2xl transform hover:scale-105 transition-all duration-300 px-12 py-6 text-lg font-bold'>
                Start Your Transformation
                <ArrowRight className='ml-2 h-5 w-5' />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className='py-24 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-20'>
            <h2 className='text-4xl md:text-5xl font-bold text-foreground mb-6'>
              Powered by Intelligence,{" "}
              <span className='text-[#00690D]'>
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
                <div className={`absolute inset-0 ${index % 2 === 0 ? 'bg-[#FE047F]/5' : 'bg-[#00690D]/5'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                <CardContent className='relative p-10'>
                  {/* Icon */}
                  <div className='relative mb-8'>
                    <div className={`absolute inset-0 ${index % 2 === 0 ? 'bg-[#FE047F]' : 'bg-[#00690D]'} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity`}></div>
                    <feature.icon className={`relative h-16 w-16 ${index % 2 === 0 ? 'text-[#FE047F]' : 'text-[#00690D]'}`} />
                  </div>

                  {/* Title */}
                  <h3 className='text-2xl font-bold text-foreground mb-4 group-hover:text-[#FE047F] transition-colors'>
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className='text-muted-foreground leading-relaxed mb-6'>
                    {feature.description}
                  </p>

                  {/* Link */}
                  <div className='flex items-center text-[#FE047F] font-semibold group-hover:gap-3 gap-2 transition-all'>
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
                className='border-2 border-[#FE047F] text-[#FE047F] hover:bg-[#FE047F] hover:text-white px-10 py-6 text-lg transform hover:scale-105 transition-all duration-300 font-bold'>
                Explore All 9 Features
                <Sparkles className='ml-2 h-5 w-5' />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className='py-24 bg-white dark:bg-slate-950'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-20'>
            <h2 className='text-4xl md:text-5xl font-bold text-foreground mb-6'>
              Stories of{" "}
              <span className='text-[#00690D]'>
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
                className='group hover:shadow-2xl transition-all duration-500 border-0 bg-white dark:bg-slate-900 hover:-translate-y-2'>
                <CardContent className='p-8'>
                  {/* Quote mark */}
                  <MessageSquare className={`h-10 w-10 ${index % 2 === 0 ? 'text-[#FE047F]/20' : 'text-[#00690D]/20'} mb-6`} />

                  {/* Rating */}
                  <div className='flex mb-6'>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className='h-5 w-5 text-[#FE047F] fill-[#FE047F]'
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <p className='text-muted-foreground mb-6 leading-relaxed text-base italic'>
                    "{testimonial.content}"
                  </p>

                  {/* Metric badge */}
                  <div className='inline-flex items-center gap-2 bg-[#00690D]/10 text-[#00690D] px-4 py-2 rounded-full text-sm font-semibold mb-6'>
                    <TrendingUpIcon className='h-4 w-4' />
                    {testimonial.metric}
                  </div>

                  {/* Author info */}
                  <div className='flex items-center gap-4 pt-6 border-t border-muted'>
                    <div className={`w-12 h-12 rounded-full ${index % 2 === 0 ? 'bg-[#FE047F]' : 'bg-[#00690D]'} flex items-center justify-center text-white font-bold text-lg`}>
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className='font-bold text-foreground'>
                        {testimonial.name}
                      </div>
                      <div className='text-sm text-[#FE047F] font-medium'>
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
                className='bg-[#00690D] hover:bg-[#00690D]/90 text-white shadow-2xl px-10 py-6 text-lg font-bold'>
                Write Your Success Story
                <ArrowRight className='ml-2 h-5 w-5' />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className='py-24 bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold text-foreground mb-6'>
              Questions? We've Got{" "}
              <span className='text-[#FE047F]'>
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
                        <ChevronUp className='h-6 w-6 text-[#FE047F]' />
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
              <Button variant='outline' size='lg' className='border-2 hover:bg-[#FE047F] hover:text-white hover:border-[#FE047F] px-8 py-6 font-bold'>
                Contact Our Team
                <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Partners */}
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
                  className='text-muted-foreground hover:text-[#FE047F] transition-colors duration-300 whitespace-nowrap flex-shrink-0 font-semibold text-xl'>
                  {partner}
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {partners.map((partner, index) => (
                <div
                  key={`second-${partner}`}
                  className='text-muted-foreground hover:text-[#FE047F] transition-colors duration-300 whitespace-nowrap flex-shrink-0 font-semibold text-xl'>
                  {partner}
                </div>
              ))}
            </div>
          </div>
          <div className='mt-12'>
            <Link to='/partners'>
              <Button variant='outline' size='lg' className='border-2 border-[#00690D] text-[#00690D] hover:bg-[#00690D] hover:text-white font-bold'>
                View All Partners
                <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className='relative py-32 bg-[#FE047F] overflow-hidden'>
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
              <Sparkles className='h-5 w-5' />
              <span className='font-semibold'>Join 42,000+ Youth Already Succeeding</span>
            </div>

            <h2 className='text-5xl md:text-6xl font-bold text-white mb-8 leading-tight'>
              Your Future is Waiting.
              <span className='block mt-2'>
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
                  className='group bg-white text-[#FE047F] hover:bg-white/90 text-xl px-16 py-8 shadow-2xl transform hover:scale-110 transition-all duration-500 font-bold'>
                  Start Free Now
                  <ArrowRight className='ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform' />
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className='flex flex-wrap justify-center items-center gap-8 text-white/90 text-sm'>
              <div className='flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full'>
                <Shield className='h-5 w-5' />
                <span>Bank-Level Security</span>
              </div>
              <div className='flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full'>
                <Zap className='h-5 w-5' />
                <span>2-Minute Setup</span>
              </div>
              <div className='flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full'>
                <Clock className='h-5 w-5' />
                <span>24/7 Support</span>
              </div>
              <div className='flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full'>
                <CheckCircle2 className='h-5 w-5' />
                <span>No Credit Card</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
