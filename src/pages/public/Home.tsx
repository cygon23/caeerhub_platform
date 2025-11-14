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
  PlayCircle,
} from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import { useTranslation } from "react-i18next";
import { useGSAPTextReveal, useGSAPStagger } from "@/hooks/useGSAP";
import { useEffect, useState } from "react";
import {
  HeroBackground,
  StatsBackground,
  JourneyBackground,
  FeaturesBackground,
  TestimonialsBackground,
  FAQBackground,
  PartnersBackground,
  CTABackground,
} from "@/components/backgrounds/SectionBackgrounds";

export default function Home() {
  const { t } = useTranslation('home');
  const heroRef = useGSAPTextReveal();
  const statsRef = useGSAPStagger(0.1);
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

      /* Testimonials infinite scroll - Left to Right */}
      @keyframes scroll-left {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(-50%);
        }
      }
      .animate-scroll-left {
        animation: scroll-left 40s linear infinite;
      }
      .animate-scroll-left:hover {
        animation-play-state: paused;
      }

      /* Testimonials infinite scroll - Right to Left */}
      @keyframes scroll-right {
        0% {
          transform: translateX(-50%);
        }
        100% {
          transform: translateX(0);
        }
      }
      .animate-scroll-right {
        animation: scroll-right 40s linear infinite;
      }
      .animate-scroll-right:hover {
        animation-play-state: paused;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const stats = [
    { number: "200+", label: t('stats.youthImpacted'), icon: Users },
    { number: "89%", label: t('stats.successRate'), icon: TrendingUp },
    { number: "5+", label: t('stats.partnerOrganizations'), icon: Award },
    { number: "24/7", label: t('stats.aiSupport'), icon: Sparkles },
  ];

  const howItWorksSteps = [
    {
      step: "01",
      title: t('howItWorks.steps.signUp.title'),
      description: t('howItWorks.steps.signUp.description'),
      icon: Compass,
    },
    {
      step: "02",
      title: t('howItWorks.steps.getInsights.title'),
      description: t('howItWorks.steps.getInsights.description'),
      icon: MapPin,
    },
    {
      step: "03",
      title: t('howItWorks.steps.connect.title'),
      description: t('howItWorks.steps.connect.description'),
      icon: Rocket,
    },
  ];

  const faqData = [
    {
      question: t('faq.questions.free.q'),
      answer: t('faq.questions.free.a'),
    },
    {
      question: t('faq.questions.ai.q'),
      answer: t('faq.questions.ai.a'),
    },
    {
      question: t('faq.questions.privacy.q'),
      answer: t('faq.questions.privacy.a'),
    },
    {
      question: t('faq.questions.mentors.q'),
      answer: t('faq.questions.mentors.a'),
    },
    {
      question: t('faq.questions.results.q'),
      answer: t('faq.questions.results.a'),
    },
    {
      question: t('faq.questions.jobPlacement.q'),
      answer: t('faq.questions.jobPlacement.a'),
    },
  ];

  // Expanded realistic success stories - Secondary students & Small entrepreneurs
  const successStories = [
    // Secondary Students - Form 4 & Form 6
    {
      name: "Amina Hassan",
      role: "Form 4 Student",
      location: "Dodoma",
      content: "The AI career test helped me discover I'm good at science! Now I know I want to study medicine. My teachers are helping me prepare.",
      metric: "Found my dream career path",
      category: "student"
    },
    {
      name: "John Mlawa",
      role: "Form 6 Graduate",
      location: "Mbeya",
      content: "I started a small phone repair business after learning from Career na Mimi. Now I fix 20+ phones weekly and save for university.",
      metric: "Earning TZS 150K/month",
      category: "entrepreneur"
    },
    {
      name: "Neema Kasongo",
      role: "Secondary Student",
      location: "Morogoro",
      content: "The mentorship program connected me with a software engineer. She taught me coding basics. I built my first website!",
      metric: "Started learning to code",
      category: "student"
    },
    {
      name: "Emmanuel Kibona",
      role: "Small Business Owner",
      location: "Arusha",
      content: "From selling chips after school to running a food cart. Career na Mimi taught me business planning. I now serve 50+ customers daily.",
      metric: "TZS 200K profit/month",
      category: "entrepreneur"
    },
    {
      name: "Hadija Omary",
      role: "Form 5 Student",
      location: "Zanzibar",
      content: "I was confused about my future. The platform showed me opportunities in tourism. Now I'm learning hotel management!",
      metric: "Clear career direction",
      category: "student"
    },
    {
      name: "Peter Mwanga",
      role: "Young Farmer",
      location: "Iringa",
      content: "Started with 2 chickens. Career na Mimi connected me to agriculture mentors. Now I have 100+ chickens and supply local markets.",
      metric: "10x business growth",
      category: "entrepreneur"
    },
    {
      name: "Zainab Ali",
      role: "Form 6 Student",
      location: "Dar es Salaam",
      content: "The study guides helped me improve my grades from D to B+. Now I'm confident about joining university next year!",
      metric: "Grades improved 2 levels",
      category: "student"
    },
    {
      name: "Moses Ndege",
      role: "Shoe Shiner",
      location: "Mwanza",
      content: "Was just shining shoes. The platform taught me customer service and money management. Now I have 3 employees working with me.",
      metric: "Grew to 3 employees",
      category: "entrepreneur"
    },
    {
      name: "Rehema Juma",
      role: "Secondary Graduate",
      location: "Tanga",
      content: "Found my passion for graphic design through Career na Mimi. Started designing posters for local businesses. Saving for design school!",
      metric: "5 regular clients",
      category: "student"
    },
    {
      name: "Ibrahim Seif",
      role: "Form 4 Student",
      location: "Singida",
      content: "The AI test showed I'm creative. I started making handmade jewelry. My classmates love my designs!",
      metric: "Sold 50+ pieces",
      category: "entrepreneur"
    },
    {
      name: "Sophia Mushi",
      role: "Form 6 Student",
      location: "Kilimanjaro",
      content: "Career na Mimi mentors helped me prepare for university applications. I got accepted to study engineering with a scholarship!",
      metric: "University scholarship won",
      category: "student"
    },
    {
      name: "Hassan Bakari",
      role: "Vegetable Seller",
      location: "Dodoma",
      content: "Learned market strategies from the platform. Increased my vegetable sales by organizing with other vendors. Tripled my income!",
      metric: "TZS 180K/month now",
      category: "entrepreneur"
    },
    {
      name: "Mariam Ndumbaro",
      role: "Form 5 Student",
      location: "Mtwara",
      content: "Was shy and unsure of myself. The confidence-building modules helped me become class president and debate team captain!",
      metric: "Leadership skills gained",
      category: "student"
    },
    {
      name: "Daniel Maro",
      role: "Boda Boda Rider",
      location: "Arusha",
      content: "Started with renting a motorcycle. Career na Mimi taught me savings discipline. Now I own 2 motorcycles and employ a friend!",
      metric: "From 1 to 2 motorcycles",
      category: "entrepreneur"
    },
    {
      name: "Fatuma Said",
      role: "Form 4 Student",
      location: "Lindi",
      content: "Discovered I love teaching through Career na Mimi. Now I tutor younger students and earn money while preparing for teacher college.",
      metric: "10 tutoring students",
      category: "student"
    },
    {
      name: "Jackson Lyimo",
      role: "Small Shop Owner",
      location: "Mbeya",
      content: "From selling sweets at school to owning a small shop. The business planning tools helped me grow steadily and smart.",
      metric: "Shop revenue TZS 300K",
      category: "entrepreneur"
    },
    {
      name: "Asha Mjema",
      role: "Secondary Student",
      location: "Pwani",
      content: "The platform connected me with a nurse who inspired me. Now I volunteer at local clinic and know exactly what I want to study!",
      metric: "Found healthcare passion",
      category: "student"
    },
    {
      name: "Richard Komba",
      role: "Tailoring Student",
      location: "Dar es Salaam",
      content: "Learning tailoring while in school. Career na Mimi showed me how to market online. Got 15 orders for school uniforms this month!",
      metric: "15 orders/month",
      category: "entrepreneur"
    },
    {
      name: "Grace Silayo",
      role: "Form 6 Graduate",
      location: "Kigoma",
      content: "Career guidance helped me choose accounting. Started keeping books for small businesses. Earning while waiting for college admission!",
      metric: "3 business clients",
      category: "student"
    },
    {
      name: "Baraka Masanja",
      role: "Car Wash Entrepreneur",
      location: "Mwanza",
      content: "Started washing 2 cars per day. Platform taught me service excellence. Now have permanent spot, 20+ cars daily, hired 2 helpers!",
      metric: "20 cars daily, 2 staff",
      category: "entrepreneur"
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
      title: t('features.aiAssessment.title'),
      description: t('features.aiAssessment.description'),
      icon: Brain,
    },
    {
      title: t('features.smartRoadmap.title'),
      description: t('features.smartRoadmap.description'),
      icon: Target,
    },
    {
      title: t('features.mentorship.title'),
      description: t('features.mentorship.description'),
      icon: UserCheck,
    },
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <PublicLayout>
      {/* Modern Hero Section - AI + Experts = Success */}
      <section className='relative min-h-screen flex items-center bg-white dark:bg-slate-950 overflow-hidden'>
        {/* Animated AI & Technology Background */}
        <HeroBackground />

        <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
          <div className='grid lg:grid-cols-2 gap-16 items-center'>
            {/* Left Column - Content */}
            <div ref={heroRef}>
              {/* Badge */}
              <div className='inline-flex items-center gap-2 bg-[#FE047F]/10 px-4 py-2 rounded-full mb-6 border border-[#FE047F]/20'>
                <Sparkles className='h-4 w-4 text-[#FE047F]' />
                <span className='text-sm font-semibold text-[#FE047F]'>AI-Powered Career Platform</span>
              </div>

              {/* Main Headline - Powerful Slogan */}
              <h1 className='text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-[1.1]'>
                <span className='text-[#FE047F]'>{t('hero.title')} </span>
                <span className='text-[#00690D]'>{t('hero.titleHighlight')}</span>
              </h1>

              {/* Description */}
              <p className='text-xl text-muted-foreground mb-10 leading-relaxed max-w-xl'>
                {t('hero.subtitle')}
              </p>

              {/* Stats - Circular Badges */}
              <div className='flex flex-wrap gap-4 mb-10'>
                <div className='flex items-center gap-3 bg-[#FE047F]/10 px-5 py-3 rounded-full border border-[#FE047F]/20'>
                  <div className='w-12 h-12 rounded-full bg-[#FE047F] flex items-center justify-center'>
                    <span className='text-white font-bold text-sm'>200+</span>
                  </div>
                  <span className='text-sm font-semibold text-foreground'>Youth Empowered</span>
                </div>
                <div className='flex items-center gap-3 bg-[#00690D]/10 px-5 py-3 rounded-full border border-[#00690D]/20'>
                  <div className='w-12 h-12 rounded-full bg-[#00690D] flex items-center justify-center'>
                    <span className='text-white font-bold text-sm'>89%</span>
                  </div>
                  <span className='text-sm font-semibold text-foreground'>Success Rate</span>
                </div>
                <div className='flex items-center gap-3 bg-[#FE047F]/10 px-5 py-3 rounded-full border border-[#FE047F]/20'>
                  <div className='w-12 h-12 rounded-full bg-[#FE047F] flex items-center justify-center'>
                    <span className='text-white font-bold text-sm'>24/7</span>
                  </div>
                  <span className='text-sm font-semibold text-foreground'>AI Support</span>
                </div>
              </div>

              {/* CTA Buttons - Modern Layout */}
              <div className='flex flex-col sm:flex-row gap-4'>
                <Link to='/signup'>
                  <Button
                    size='lg'
                    className='bg-[#FE047F] hover:bg-[#FE047F]/90 text-white px-8 py-6 text-lg font-semibold shadow-xl shadow-[#FE047F]/20 hover:shadow-2xl hover:shadow-[#FE047F]/30 transition-all duration-300'>
                    {t('hero.startJourney')}
                    <ArrowRight className='ml-2 h-5 w-5' />
                  </Button>
                </Link>
                <Link to='/features'>
                  <Button
                    size='lg'
                    variant='outline'
                    className='border-2 border-[#00690D] text-[#00690D] hover:bg-[#00690D] hover:text-white px-8 py-6 text-lg font-semibold transition-all duration-300'>
                    <PlayCircle className='mr-2 h-5 w-5' />
                    Explore Features
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column - Visual Representation */}
            <div className='relative hidden lg:block'>
              {/* Animated Vector Background Decoration */}
              <div className='absolute inset-0 opacity-[0.08]'>
                {/* Concentric Circles - AI Processing (Spin) */}
                <svg
                  className='absolute top-20 right-10 w-32 h-32 animate-spin'
                  viewBox='0 0 100 100'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  style={{ animationDuration: '20s' }}>
                  <circle cx='50' cy='50' r='40' stroke='#FE047F' strokeWidth='1' strokeDasharray='4 4' />
                  <circle cx='50' cy='50' r='25' stroke='#00690D' strokeWidth='1' />
                  <circle cx='50' cy='50' r='10' stroke='#FE047F' strokeWidth='0.5' strokeDasharray='2 2' />
                </svg>

                {/* Data Grid - Knowledge Base (Pulse) */}
                <svg
                  className='absolute bottom-32 left-10 w-24 h-24 animate-pulse-scale'
                  viewBox='0 0 100 100'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'>
                  <rect x='10' y='10' width='80' height='80' stroke='#FE047F' strokeWidth='1' strokeDasharray='6 6' />
                  <line x1='50' y1='10' x2='50' y2='90' stroke='#FE047F' strokeWidth='0.5' opacity='0.5' />
                  <line x1='10' y1='50' x2='90' y2='50' stroke='#FE047F' strokeWidth='0.5' opacity='0.5' />
                </svg>

                {/* Triangle - Direction/Growth (Float) */}
                <svg
                  className='absolute top-1/2 right-5 w-20 h-20 animate-float'
                  viewBox='0 0 100 100'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  style={{ animationDuration: '6s' }}>
                  <polygon points='50,10 90,90 10,90' stroke='#00690D' strokeWidth='1' fill='none' />
                  <circle cx='50' cy='10' r='3' fill='#00690D' />
                </svg>

                {/* Diamond - Achievement (Rotate & Pulse) */}
                <svg
                  className='absolute bottom-10 right-20 w-16 h-16 animate-pulse'
                  viewBox='0 0 100 100'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  style={{ animation: 'pulse 3s ease-in-out infinite, spin 15s linear infinite' }}>
                  <path d='M50 10 L90 50 L50 90 L10 50 Z' stroke='#FE047F' strokeWidth='1' fill='none' strokeDasharray='3 3' />
                  <circle cx='50' cy='50' r='5' fill='#FE047F' opacity='0.6' />
                </svg>

                {/* Network Nodes - Connection Pattern */}
                <svg
                  className='absolute top-1/3 left-12 w-28 h-28 animate-pulse-scale'
                  viewBox='0 0 100 100'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  style={{ animationDuration: '4s' }}>
                  <circle cx='25' cy='25' r='4' fill='#FE047F' opacity='0.8' />
                  <circle cx='75' cy='25' r='4' fill='#00690D' opacity='0.8' />
                  <circle cx='50' cy='75' r='4' fill='#FE047F' opacity='0.8' />
                  <line x1='25' y1='25' x2='75' y2='25' stroke='#FE047F' strokeWidth='0.5' opacity='0.4' strokeDasharray='2 2' />
                  <line x1='25' y1='25' x2='50' y2='75' stroke='#00690D' strokeWidth='0.5' opacity='0.4' strokeDasharray='2 2' />
                  <line x1='75' y1='25' x2='50' y2='75' stroke='#FE047F' strokeWidth='0.5' opacity='0.4' strokeDasharray='2 2' />
                </svg>

                {/* Brain Waves - AI Thinking */}
                <svg
                  className='absolute top-40 left-5 w-20 h-16'
                  viewBox='0 0 100 100'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M 10 50 Q 25 30, 40 50 T 70 50 T 90 50'
                    stroke='#FE047F'
                    strokeWidth='1'
                    fill='none'
                    opacity='0.6'>
                    <animate
                      attributeName='stroke-dashoffset'
                      from='0'
                      to='100'
                      dur='3s'
                      repeatCount='indefinite' />
                  </path>
                </svg>
              </div>

              {/* Floating Abstract Shapes - Orbiting Elements */}
              <div className='absolute top-10 left-5 w-12 h-12 rounded-full bg-[#FE047F]/5 border border-[#FE047F]/20 animate-float' style={{ animationDuration: '5s', animationDelay: '0s' }}></div>
              <div className='absolute bottom-20 right-8 w-8 h-8 rounded-full bg-[#00690D]/5 border border-[#00690D]/20 animate-float' style={{ animationDuration: '7s', animationDelay: '1s' }}></div>
              <div className='absolute top-1/3 left-8 w-6 h-6 rotate-45 bg-[#FE047F]/5 border border-[#FE047F]/20 animate-pulse' style={{ animationDuration: '4s' }}></div>
              <div className='absolute bottom-1/3 left-16 w-10 h-10 rounded-full bg-[#00690D]/5 border border-[#00690D]/20 animate-pulse-scale' style={{ animationDuration: '6s', animationDelay: '2s' }}></div>

              {/* Modern 3D-style Card Stack Visualization */}
              <div className='relative h-[600px]'>
                {/* AI Card - Back */}
                <div className='absolute top-0 right-0 w-80 h-96 bg-gradient-to-br from-[#FE047F] to-[#FE047F]/80 rounded-3xl shadow-2xl transform rotate-6 transition-transform hover:rotate-3'>
                  <div className='p-8 text-white'>
                    <div className='w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm'>
                      <Brain className='h-8 w-8 text-white' />
                    </div>
                    <h3 className='text-2xl font-bold mb-3'>AI Technology</h3>
                    <p className='text-white/90 text-sm leading-relaxed'>
                      Advanced machine learning algorithms analyze your unique strengths, interests, and goals to provide personalized career recommendations.
                    </p>
                    <div className='mt-6 space-y-2'>
                      <div className='flex items-center gap-2'>
                        <CheckCircle2 className='h-4 w-4' />
                        <span className='text-sm'>Personality Assessment</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <CheckCircle2 className='h-4 w-4' />
                        <span className='text-sm'>Smart Roadmaps</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <CheckCircle2 className='h-4 w-4' />
                        <span className='text-sm'>24/7 AI Coach</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expert Card - Front */}
                <div className='absolute bottom-0 left-0 w-80 h-96 bg-gradient-to-br from-[#00690D] to-[#00690D]/80 rounded-3xl shadow-2xl transform -rotate-6 transition-transform hover:-rotate-3'>
                  <div className='p-8 text-white'>
                    <div className='w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm'>
                      <Users className='h-8 w-8 text-white' />
                    </div>
                    <h3 className='text-2xl font-bold mb-3'>Expert Mentors</h3>
                    <p className='text-white/90 text-sm leading-relaxed'>
                      Connect with successful professionals who provide real-world guidance, industry insights, and proven strategies for career success.
                    </p>
                    <div className='mt-6 space-y-2'>
                      <div className='flex items-center gap-2'>
                        <CheckCircle2 className='h-4 w-4' />
                        <span className='text-sm'>1-on-1 Mentorship</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <CheckCircle2 className='h-4 w-4' />
                        <span className='text-sm'>Industry Experts</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <CheckCircle2 className='h-4 w-4' />
                        <span className='text-sm'>Career Coaching</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Success Badge - Center */}
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10'>
                  <div className='w-32 h-32 bg-white dark:bg-slate-900 rounded-full shadow-2xl flex items-center justify-center border-4 border-white dark:border-slate-800'>
                    <div className='text-center'>
                      <Rocket className='h-12 w-12 text-[#FE047F] mx-auto mb-1' />
                      <div className='text-xs font-bold text-foreground'>Success</div>
                    </div>
                  </div>
                </div>

                {/* Connecting Lines - SVG */}
                <svg className='absolute inset-0 w-full h-full pointer-events-none' xmlns='http://www.w3.org/2000/svg'>
                  <line x1='40%' y1='35%' x2='50%' y2='50%' stroke='#FE047F' strokeWidth='2' strokeDasharray='5,5' opacity='0.3' />
                  <line x1='60%' y1='65%' x2='50%' y2='50%' stroke='#00690D' strokeWidth='2' strokeDasharray='5,5' opacity='0.3' />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce'>
          <ChevronDown className='h-6 w-6 text-muted-foreground' />
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className='relative py-20 bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 overflow-hidden'>
        {/* Animated Data & Analytics Background */}
        <StatsBackground />

        <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold text-foreground mb-4'>
              Real Impact, Real Results
            </h2>
            <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
              Numbers that tell the story of transformation across Tanzania
            </p>
          </div>

          <div ref={statsRef} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto'>
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className='flex flex-col items-center group'>
                {/* Circular Badge with Icon */}
                <div className='relative mb-6'>
                  {/* Outer glow ring */}
                  <div className={`absolute inset-0 rounded-full ${index % 2 === 0 ? 'bg-[#FE047F]' : 'bg-[#00690D]'} opacity-20 blur-xl group-hover:opacity-40 transition-opacity animate-pulse-scale`}></div>

                  {/* Main circular badge */}
                  <div className={`relative w-32 h-32 rounded-full ${index % 2 === 0 ? 'bg-[#FE047F]' : 'bg-[#00690D]'} flex flex-col items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                    {/* Icon */}
                    <stat.icon className='h-8 w-8 text-white mb-2' />
                    {/* Number */}
                    <span className='text-2xl font-bold text-white'>{stat.number}</span>
                  </div>
                </div>

                {/* Label below */}
                <p className='text-center text-foreground font-semibold text-lg'>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className='relative py-24 bg-white dark:bg-slate-950 overflow-hidden'>
        {/* Animated Journey/Process Background */}
        <JourneyBackground />

        <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-20'>
            <h2 className='text-4xl md:text-5xl font-bold text-foreground mb-6'>
              {t('howItWorks.title')}
            </h2>
            <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
              {t('howItWorks.subtitle')}
            </p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
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
      <section className='relative py-24 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 overflow-hidden'>
        {/* Animated Innovation Background */}
        <FeaturesBackground />

        <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-20'>
            <h2 className='text-4xl md:text-5xl font-bold text-foreground mb-6'>
              {t('features.title')}{" "}
              <span className='text-[#00690D]'>
                {t('features.titleHighlight')}
              </span>
            </h2>
            <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
              {t('features.subtitle')}
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
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

      {/* Success Stories - Dual Infinite Scroll */}
      <section className='relative py-24 bg-white dark:bg-slate-950 overflow-hidden'>
        {/* Animated People & Success Background */}
        <TestimonialsBackground />

        <div className='relative z-10'>
          <div className='text-center mb-16 px-4'>
            <h2 className='text-4xl md:text-5xl font-bold text-foreground mb-6'>
              {t('testimonials.title')}
            </h2>
            <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
              Real stories from 200+ youth we've empowered across Tanzania
            </p>
          </div>

          {/* First Row - Scrolling Left to Right */}
          <div className='mb-8 overflow-hidden'>
            <div className='flex gap-6 animate-scroll-left'>
              {/* Duplicate arrays for seamless loop */}
              {[...successStories.slice(0, 10), ...successStories.slice(0, 10)].map((story, index) => (
                <Card
                  key={`row1-${index}`}
                  className='flex-shrink-0 w-[350px] hover:shadow-2xl transition-all duration-500 border-0 bg-white dark:bg-slate-900 hover:-translate-y-2'>
                  <CardContent className='p-6'>
                    {/* Category Badge */}
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                      story.category === 'student'
                        ? 'bg-[#FE047F]/10 text-[#FE047F]'
                        : 'bg-[#00690D]/10 text-[#00690D]'
                    }`}>
                      {story.category === 'student' ? '🎓 Student' : '💼 Entrepreneur'}
                    </div>

                    {/* Content */}
                    <p className='text-muted-foreground mb-4 leading-relaxed text-sm'>
                      "{story.content}"
                    </p>

                    {/* Metric badge */}
                    <div className='inline-flex items-center gap-2 bg-[#00690D]/10 text-[#00690D] px-3 py-1.5 rounded-full text-xs font-semibold mb-4'>
                      <TrendingUpIcon className='h-3 w-3' />
                      {story.metric}
                    </div>

                    {/* Author info */}
                    <div className='flex items-center gap-3 pt-4 border-t border-muted'>
                      <div className={`w-10 h-10 rounded-full ${
                        story.category === 'student' ? 'bg-[#FE047F]' : 'bg-[#00690D]'
                      } flex items-center justify-center text-white font-bold text-sm`}>
                        {story.name.charAt(0)}
                      </div>
                      <div>
                        <div className='font-bold text-foreground text-sm'>
                          {story.name}
                        </div>
                        <div className='text-xs text-[#FE047F] font-medium'>
                          {story.role}
                        </div>
                        <div className='text-xs text-muted-foreground flex items-center gap-1'>
                          <MapPin className='h-2.5 w-2.5' />
                          {story.location}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Second Row - Scrolling Right to Left */}
          <div className='overflow-hidden'>
            <div className='flex gap-6 animate-scroll-right'>
              {/* Duplicate arrays for seamless loop */}
              {[...successStories.slice(10, 20), ...successStories.slice(10, 20)].map((story, index) => (
                <Card
                  key={`row2-${index}`}
                  className='flex-shrink-0 w-[350px] hover:shadow-2xl transition-all duration-500 border-0 bg-white dark:bg-slate-900 hover:-translate-y-2'>
                  <CardContent className='p-6'>
                    {/* Category Badge */}
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                      story.category === 'student'
                        ? 'bg-[#FE047F]/10 text-[#FE047F]'
                        : 'bg-[#00690D]/10 text-[#00690D]'
                    }`}>
                      {story.category === 'student' ? '🎓 Student' : '💼 Entrepreneur'}
                    </div>

                    {/* Content */}
                    <p className='text-muted-foreground mb-4 leading-relaxed text-sm'>
                      "{story.content}"
                    </p>

                    {/* Metric badge */}
                    <div className='inline-flex items-center gap-2 bg-[#00690D]/10 text-[#00690D] px-3 py-1.5 rounded-full text-xs font-semibold mb-4'>
                      <TrendingUpIcon className='h-3 w-3' />
                      {story.metric}
                    </div>

                    {/* Author info */}
                    <div className='flex items-center gap-3 pt-4 border-t border-muted'>
                      <div className={`w-10 h-10 rounded-full ${
                        story.category === 'student' ? 'bg-[#FE047F]' : 'bg-[#00690D]'
                      } flex items-center justify-center text-white font-bold text-sm`}>
                        {story.name.charAt(0)}
                      </div>
                      <div>
                        <div className='font-bold text-foreground text-sm'>
                          {story.name}
                        </div>
                        <div className='text-xs text-[#FE047F] font-medium'>
                          {story.role}
                        </div>
                        <div className='text-xs text-muted-foreground flex items-center gap-1'>
                          <MapPin className='h-2.5 w-2.5' />
                          {story.location}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className='text-center mt-16 px-4'>
            <p className='text-muted-foreground mb-6 text-lg'>
              Join 200+ youth already succeeding across Tanzania
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
      <section className='relative py-24 bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 overflow-hidden'>
        {/* Animated Q&A Background */}
        <FAQBackground />

        <div className='relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold text-foreground mb-6'>
              {t('faq.title')}
            </h2>
            <p className='text-xl text-muted-foreground'>
              {t('faq.subtitle')}
            </p>
          </div>

          <div className='space-y-4'>
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
      <section className='relative py-20 bg-white dark:bg-slate-950 overflow-hidden'>
        {/* Animated Network Connections Background */}
        <PartnersBackground />

        <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h3 className='text-2xl font-semibold text-muted-foreground mb-12'>
            {t('partners.title')}
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

      {/* Final CTA Section - Creative Dual-Tone Design */}
      <section className='relative py-32 bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 overflow-hidden'>
        {/* Animated Success & Achievement Background */}
        <CTABackground />

        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
          <div>
            {/* Split Layout Container */}
            <div className='grid lg:grid-cols-2 gap-12 items-center'>
              {/* Left Column - Content */}
              <div className='text-left'>
                {/* Badge */}
                <div className='inline-flex items-center gap-2 bg-[#FE047F]/10 px-6 py-3 rounded-full mb-8 border border-[#FE047F]/20'>
                  <Sparkles className='h-5 w-5 text-[#FE047F]' />
                  <span className='font-semibold text-[#FE047F]'>Join 200+ Youth Already Succeeding</span>
                </div>

                <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight'>
                  {t('cta.title')}
                </h2>

                <p className='text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed'>
                  {t('cta.subtitle')}
                </p>

                <div className='flex flex-col sm:flex-row gap-4 mb-8'>
                  <Link to='/signup'>
                    <Button
                      size='lg'
                      className='group bg-[#FE047F] hover:bg-[#FE047F]/90 text-white text-lg px-12 py-6 shadow-xl shadow-[#FE047F]/20 transform hover:scale-105 transition-all duration-300 font-semibold'>
                      {t('cta.getStarted')}
                      <ArrowRight className='ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform' />
                    </Button>
                  </Link>
                  <Link to='/features'>
                    <Button
                      size='lg'
                      variant='outline'
                      className='border-2 border-[#00690D] text-[#00690D] hover:bg-[#00690D] hover:text-white text-lg px-12 py-6 font-semibold transition-all duration-300'>
                      Learn More
                    </Button>
                  </Link>
                </div>

                {/* Trust badges - Compact */}
                <div className='flex flex-wrap gap-4 text-sm text-muted-foreground'>
                  <div className='flex items-center gap-2'>
                    <CheckCircle2 className='h-4 w-4 text-[#00690D]' />
                    <span>{t('cta.trustBadges.instantSetup')}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <CheckCircle2 className='h-4 w-4 text-[#00690D]' />
                    <span>No Credit Card</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <CheckCircle2 className='h-4 w-4 text-[#00690D]' />
                    <span>{t('cta.trustBadges.support')}</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Visual Element */}
              <div className='relative hidden lg:block'>
                {/* Decorative Card with Stats */}
                <div className='relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-slate-800'>
                  {/* Accent Corner */}
                  <div className='absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#FE047F]/20 to-[#00690D]/20 rounded-bl-3xl rounded-tr-3xl'></div>

                  <div className='relative space-y-6'>
                    <h3 className='text-2xl font-bold text-foreground mb-6'>Platform Highlights</h3>

                    <div className='flex items-center gap-4 p-4 bg-[#FE047F]/5 rounded-xl'>
                      <div className='w-12 h-12 rounded-full bg-[#FE047F] flex items-center justify-center'>
                        <Users className='h-6 w-6 text-white' />
                      </div>
                      <div>
                        <p className='font-bold text-foreground'>200+</p>
                        <p className='text-sm text-muted-foreground'>Youth Empowered</p>
                      </div>
                    </div>

                    <div className='flex items-center gap-4 p-4 bg-[#00690D]/5 rounded-xl'>
                      <div className='w-12 h-12 rounded-full bg-[#00690D] flex items-center justify-center'>
                        <TrendingUp className='h-6 w-6 text-white' />
                      </div>
                      <div>
                        <p className='font-bold text-foreground'>89%</p>
                        <p className='text-sm text-muted-foreground'>Success Rate</p>
                      </div>
                    </div>

                    <div className='flex items-center gap-4 p-4 bg-[#FE047F]/5 rounded-xl'>
                      <div className='w-12 h-12 rounded-full bg-[#FE047F] flex items-center justify-center'>
                        <Clock className='h-6 w-6 text-white' />
                      </div>
                      <div>
                        <p className='font-bold text-foreground'>24/7</p>
                        <p className='text-sm text-muted-foreground'>AI Support</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Badge */}
                <div className='absolute -bottom-6 -right-6 bg-[#00690D] text-white px-6 py-4 rounded-2xl shadow-xl transform rotate-3 hover:rotate-0 transition-transform'>
                  <p className='text-sm font-medium'>🎉 Free to Start</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
