import PublicLayout from "@/components/layout/PublicLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Brain,
  Map,
  FileText,
  MessageCircle,
  BarChart3,
  Users,
  GraduationCap,
  Briefcase,
  Target,
  ArrowRight,
  Sparkles,
  CheckCircle,
  UserCircle2,
  TrendingUp,
  Award,
  Star
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGSAPStagger } from "@/hooks/useGSAP";
import {
  HeroBackground,
  StatsBackground,
  FeaturesBackground,
  CTABackground,
} from "@/components/backgrounds/SectionBackgrounds";

export default function Features() {
  const { t } = useTranslation('features');
  const featuresRef = useGSAPStagger(0.15);

  const features = [
    {
      icon: Brain,
      title: "AI Career Personality Test",
      description: "Advanced psychological assessment that analyzes your personality, interests, and cognitive patterns to identify your ideal career matches.",
      benefits: [
        "Comprehensive personality analysis",
        "Career compatibility scoring",
        "Strengths & weaknesses mapping",
        "Learning style identification"
      ],
      category: "Assessment"
    },
    {
      icon: Map,
      title: "Smart Roadmap Generator", 
      description: "Personalized step-by-step career pathways based on your goals, current skills, and local opportunities in Tanzania.",
      benefits: [
        "Customized learning paths",
        "Milestone tracking",
        "Resource recommendations",
        "Timeline optimization"
      ],
      category: "Planning"
    },
    {
      icon: FileText,
      title: "Intelligent CV Builder",
      description: "AI-powered resume builder that creates professional CVs optimized for Tanzanian employers and international standards.",
      benefits: [
        "Industry-specific templates",
        "ATS optimization",
        "Skills gap analysis",
        "Interview preparation tips"
      ],
      category: "Tools"
    },
    {
      icon: MessageCircle,
      title: "24/7 AI Career Coach",
      description: "Always-available virtual mentor that provides instant guidance, answers questions, and offers career advice in Swahili and English.",
      benefits: [
        "Instant career guidance",
        "Multilingual support",
        "Interview practice",
        "Study assistance"
      ],
      category: "Support"
    },
    {
      icon: Users,
      title: "Expert Mentorship Network",
      description: "Connect with successful professionals across various industries for one-on-one guidance and real-world insights.",
      benefits: [
        "Industry expert matching",
        "Scheduled mentoring sessions",
        "Career path insights",
        "Networking opportunities"
      ],
      category: "Mentorship"
    },
    {
      icon: BarChart3,
      title: "Progress Analytics Dashboard",
      description: "Comprehensive tracking of your career development journey with insights, achievements, and areas for improvement.",
      benefits: [
        "Skill development tracking",
        "Achievement badges",
        "Performance insights",
        "Goal completion rates"
      ],
      category: "Analytics"
    },
    {
      icon: GraduationCap,
      title: "Personalized Learning Modules",
      description: "Curated educational content and skill-building courses tailored to your career goals and learning preferences.",
      benefits: [
        "Adaptive learning algorithms",
        "Industry-relevant content",
        "Practical skill assessments",
        "Certificate programs"
      ],
      category: "Education"
    },
    {
      icon: Briefcase,
      title: "Job Market Intelligence",
      description: "Real-time insights into employment opportunities, salary ranges, and skill demands across Tanzania and global markets.",
      benefits: [
        "Live job market data",
        "Salary benchmarking",
        "Skill demand forecasting",
        "Industry trend analysis"
      ],
      category: "Market Intel"
    },
    {
      icon: Target,
      title: "Goal Setting & Tracking",
      description: "SMART goal framework with automated reminders, progress tracking, and achievement celebrations to keep you motivated.",
      benefits: [
        "SMART goal framework",
        "Automated reminders",
        "Progress visualization",
        "Achievement rewards"
      ],
      category: "Productivity"
    }
  ];

  const categories = Array.from(new Set(features.map(f => f.category)));

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-card relative overflow-hidden">
        <HeroBackground />
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-primary/10 animate-float"
              style={{
                width: `${20 + Math.random() * 60}px`,
                height: `${20 + Math.random() * 60}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 4}s`
              }}
            ></div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div>
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="h-8 w-8 text-primary mr-3 animate-pulse-scale" />
              <h1 className="text-4xl md:text-6xl font-bold text-foreground">
                {t('hero.title')}{" "}
                <span className="bg-gradient-hero bg-clip-text text-transparent">{t('hero.titleHighlight')}</span>
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              {t('hero.subtitle')}
            </p>
            <div>
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-hero text-white shadow-primary transform hover:scale-110 transition-all duration-300">
                  Try All Features Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-20 overflow-hidden">
        <FeaturesBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={featuresRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={feature.title}
                className="hover:shadow-primary transition-all duration-500 border-0 bg-gradient-card hover-lift group"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-8 w-8 text-primary" />
                    </div>
                    <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded-full font-medium">
                      {feature.category}
                    </span>
                  </div>
                  <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">{feature.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground text-sm mb-3">Key Benefits:</h4>
                    {feature.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center text-sm transform hover:translate-x-2 transition-transform duration-200">
                        <CheckCircle className="h-4 w-4 text-secondary mr-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Circular Connected Journey */}
      <section className="relative py-20 bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 overflow-hidden">
        <StatsBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">{t('howItWorks.title')}</h2>
            <p className="text-xl text-muted-foreground">
              {t('howItWorks.subtitle')}
            </p>
          </div>

          {/* Circular Journey Path */}
          <div className="relative max-w-5xl mx-auto">
            {/* Connecting Rope/Line */}
            <div className="absolute top-24 left-0 right-0 h-1 hidden md:block">
              <svg className="w-full h-full" preserveAspectRatio="none">
                <path
                  d="M 0 0 Q 25 20, 33 0 T 66 0 T 100 0"
                  stroke="#FE047F"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="8 4"
                  opacity="0.3"
                />
              </svg>
            </div>

            {/* Steps as Connected Circles */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {[
                {
                  step: "01",
                  title: t('howItWorks.step1.title'),
                  description: t('howItWorks.step1.description'),
                  icon: Brain,
                  color: "bg-[#FE047F]"
                },
                {
                  step: "02",
                  title: t('howItWorks.step2.title'),
                  description: t('howItWorks.step2.description'),
                  icon: Map,
                  color: "bg-[#00690D]"
                },
                {
                  step: "03",
                  title: t('howItWorks.step3.title'),
                  description: t('howItWorks.step3.description'),
                  icon: Users,
                  color: "bg-[#FE047F]"
                },
                {
                  step: "04",
                  title: t('howItWorks.step4.title'),
                  description: t('howItWorks.step4.description'),
                  icon: Target,
                  color: "bg-[#00690D]"
                }
              ].map((item, index) => (
                <div key={item.step} className="flex flex-col items-center group relative">
                  {/* Climbing Person Icon Between Steps */}
                  {index < 3 && (
                    <div className="absolute -right-12 top-16 hidden md:block z-10 animate-float" style={{ animationDuration: '4s', animationDelay: `${index * 0.5}s` }}>
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center border-2 border-[#FE047F]/30">
                        <UserCircle2 className="h-6 w-6 text-[#FE047F]" />
                      </div>
                    </div>
                  )}

                  {/* Circular Badge */}
                  <div className="relative mb-6">
                    {/* Outer glow ring */}
                    <div className={`absolute inset-0 rounded-full ${item.color} opacity-20 blur-xl group-hover:opacity-40 transition-opacity`}></div>

                    {/* Main circular badge */}
                    <div className={`relative w-32 h-32 rounded-full ${item.color} flex flex-col items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300 border-4 border-white dark:border-slate-900`}>
                      {/* Icon */}
                      <item.icon className="h-10 w-10 text-white mb-1" />
                      {/* Step Number */}
                      <span className="text-sm font-bold text-white/80">{item.step}</span>
                    </div>
                  </div>

                  {/* Title and Description */}
                  <h3 className="text-xl font-semibold text-foreground mb-3 text-center">{item.title}</h3>
                  <p className="text-muted-foreground text-center text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Proven Results - Circular Badge Design */}
      <section className="relative py-20 bg-white dark:bg-slate-950 overflow-hidden">
        <FeaturesBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              {t('results.title')}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t('results.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { number: "94%", label: t('results.completionRate'), icon: Target, color: "bg-[#FE047F]" },
              { number: "87%", label: t('results.satisfactionScore'), icon: TrendingUp, color: "bg-[#00690D]" },
              { number: "76%", label: t('results.careerClarity'), icon: Award, color: "bg-[#FE047F]" },
              { number: "4.8/5", label: t('results.rating'), icon: Star, color: "bg-[#00690D]" }
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="flex flex-col items-center group"
              >
                {/* Circular Badge */}
                <div className="relative mb-6">
                  {/* Outer glow ring */}
                  <div className={`absolute inset-0 rounded-full ${stat.color} opacity-20 blur-xl group-hover:opacity-40 transition-opacity animate-pulse-scale`}></div>

                  {/* Main circular badge */}
                  <div className={`relative w-32 h-32 rounded-full ${stat.color} flex flex-col items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                    {/* Icon */}
                    <stat.icon className="h-8 w-8 text-white mb-2" />
                    {/* Number */}
                    <span className="text-2xl font-bold text-white">{stat.number}</span>
                  </div>
                </div>

                {/* Label below */}
                <p className="text-center text-foreground font-semibold text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Creative Dual-Tone Design */}
      <section className="relative py-32 bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 overflow-hidden">
        <CTABackground />
        {/* Creative Background Elements */}
        <div className="absolute inset-0">
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="features-cta-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="1" fill="currentColor" className="text-foreground" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#features-cta-grid)" />
            </svg>
          </div>

          {/* Left Accent - Pink Gradient Orb */}
          <div className="absolute -left-32 top-1/2 -translate-y-1/2 w-80 h-80 bg-[#FE047F]/20 rounded-full blur-3xl"></div>

          {/* Right Accent - Green Gradient Orb */}
          <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-80 h-80 bg-[#00690D]/20 rounded-full blur-3xl"></div>

          {/* Animated Floating Shapes */}
          <div className="absolute top-20 left-20 w-16 h-16 border-2 border-[#FE047F]/20 rounded-full animate-float" style={{ animationDuration: '8s' }}></div>
          <div className="absolute bottom-20 right-20 w-12 h-12 border-2 border-[#00690D]/20 rounded-lg animate-float" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-8 h-8 border-2 border-[#FE047F]/20 rotate-45 animate-pulse" style={{ animationDuration: '4s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#FE047F]/10 px-6 py-3 rounded-full mb-8 border border-[#FE047F]/20">
                <Sparkles className="h-5 w-5 text-[#FE047F]" />
                <span className="font-semibold text-[#FE047F]">AI-Powered Career Platform</span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                {t('cta.title')}
              </h2>

              <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
                {t('cta.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/signup">
                  <Button
                    size="lg"
                    className="group bg-[#FE047F] hover:bg-[#FE047F]/90 text-white text-lg px-12 py-6 shadow-xl shadow-[#FE047F]/20 transform hover:scale-105 transition-all duration-300 font-semibold">
                    {t('cta.button')}
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-[#00690D] text-[#00690D] hover:bg-[#00690D] hover:text-white text-lg px-12 py-6 font-semibold transition-all duration-300">
                    Schedule Demo
                  </Button>
                </Link>
              </div>

              {/* Trust badges - Compact */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#00690D]" />
                  <span>Free to Start</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#00690D]" />
                  <span>No Credit Card</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#00690D]" />
                  <span>Cancel Anytime</span>
                </div>
              </div>
            </div>

            {/* Right Column - Visual Feature Highlights */}
            <div className="relative hidden lg:block">
              {/* Feature Cards */}
              <div className="space-y-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-800 hover:scale-105 transition-transform">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#FE047F] flex items-center justify-center">
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">AI Career Matching</p>
                      <p className="text-sm text-muted-foreground">94% Accuracy Rate</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-800 hover:scale-105 transition-transform">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#00690D] flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Expert Mentorship</p>
                      <p className="text-sm text-muted-foreground">Connect with Pros</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-800 hover:scale-105 transition-transform">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#FE047F] flex items-center justify-center">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Track Progress</p>
                      <p className="text-sm text-muted-foreground">Real-Time Analytics</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-[#00690D] text-white px-6 py-4 rounded-2xl shadow-xl transform rotate-3 hover:rotate-0 transition-transform">
                <p className="text-sm font-medium">🎉 200+ Youth Empowered</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}