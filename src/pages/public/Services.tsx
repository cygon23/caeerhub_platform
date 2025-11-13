import PublicLayout from "@/components/layout/PublicLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import {
  Users,
  Heart,
  UserCheck,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Shield,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Target,
  Brain
} from "lucide-react";
import { useGSAP, useGSAPScale, useGSAPStagger, useGSAPTextReveal, useGSAPMagnetic } from "@/hooks/useGSAP";

export default function Services() {
  const heroRef = useGSAPTextReveal();
  const tabsRef = useGSAPScale();
  const additionalRef = useGSAPStagger(0.2);
  const ctaRef = useGSAPMagnetic();

  const services = {
    youth: {
      icon: GraduationCap,
      title: "Youth Empowerment",
      subtitle: "Ages 16-30 • Students & Early Career",
      description: "Comprehensive career development program designed specifically for young Tanzanians ready to discover and pursue their dream careers.",
      features: [
        "AI-powered career personality assessment",
        "Personalized career roadmap generation", 
        "24/7 virtual career coaching in Swahili & English",
        "Skills gap analysis and learning recommendations",
        "Professional CV building and optimization",
        "Interview preparation and practice sessions",
        "Access to job market intelligence and opportunities",
        "Peer networking and collaboration platform"
      ],
      benefits: [
        "92% of users discover new career possibilities",
        "Average 40% improvement in job interview success",
        "Access to 500+ learning resources and courses",
        "Connect with 150+ industry mentors"
      ],
      pricing: "Free for students • Premium features from TZS 29,000/month"
    },
    parents: {
      icon: Heart,
      title: "Parental Guidance",
      subtitle: "Supporting Parents & Guardians",
      description: "Empower parents with tools and insights to effectively guide their children's career development while fostering independence.",
      features: [
        "Child's career progress dashboard and insights",
        "Weekly parental guidance tips and strategies",
        "Parent-child communication improvement tools",
        "Educational pathway planning resources",
        "Financial planning for career development",
        "Access to family counseling sessions",
        "Workshops on modern career landscape",
        "Community support network for parents"
      ],
      benefits: [
        "89% of parents report improved career conversations",
        "Better understanding of modern career options",
        "Reduced family conflict around career choices",
        "Collaborative approach to career planning"
      ],
      pricing: "Family packages from TZS 45,000/month"
    },
    mentors: {
      icon: UserCheck,
      title: "Expert Mentorship",
      subtitle: "Professional Mentors & Industry Leaders",
      description: "Join our network of successful professionals committed to giving back by mentoring the next generation of Tanzanian talent.",
      features: [
        "Comprehensive mentor training and certification",
        "AI-powered mentee matching system",
        "Flexible scheduling and session management",
        "Progress tracking and impact measurement",
        "Professional development opportunities",
        "Recognition and awards program",
        "Access to mentor community and resources",
        "Compensation for time and expertise"
      ],
      benefits: [
        "Make direct impact on youth development",
        "Enhance leadership and coaching skills",
        "Build meaningful professional networks",
        "Contribute to Tanzania's economic growth"
      ],
      pricing: "Apply to become a certified mentor • Earn TZS 25,000-75,000/session"
    }
  };

  const additionalServices = [
    {
      icon: Briefcase,
      title: "Corporate Partnerships",
      description: "Partner with us to access top young talent and support youth development in your industry.",
      features: ["Talent pipeline access", "CSR partnership opportunities", "Skills development collaboration"]
    },
    {
      icon: TrendingUp,
      title: "Career Assessment Services",
      description: "Professional career assessments for schools, universities, and organizations.",
      features: ["Bulk assessment packages", "Custom reporting", "Institution dashboards"]
    },
    {
      icon: Shield,
      title: "Premium Support",
      description: "Enhanced support services for users who need personalized attention and faster responses.",
      features: ["Priority customer support", "1-on-1 strategy sessions", "Custom career planning"]
    }
  ];

  return (
    <PublicLayout>
      {/* Hero Section - Clean & Consistent */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-[#FE047F]/10 animate-float"
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
          <div ref={heroRef}>
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="h-8 w-8 text-[#FE047F] mr-3 animate-pulse-scale" />
              <h1 className="text-4xl md:text-6xl font-bold text-foreground">
                Our{" "}
                <span className="text-[#FE047F]">Services</span>
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Comprehensive career development solutions tailored for youth, parents, and mentors
              in the Tanzanian professional ecosystem.
            </p>
          </div>
        </div>
      </section>

      {/* Services Tabs */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="youth" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto mb-12 h-auto p-1">
              <TabsTrigger 
                value="youth" 
                className="flex flex-col items-center p-4 data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <GraduationCap className="h-6 w-6 mb-2" />
                <span className="font-medium">Youth</span>
              </TabsTrigger>
              <TabsTrigger 
                value="parents"
                className="flex flex-col items-center p-4 data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <Heart className="h-6 w-6 mb-2" />
                <span className="font-medium">Parents</span>
              </TabsTrigger>
              <TabsTrigger 
                value="mentors"
                className="flex flex-col items-center p-4 data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <UserCheck className="h-6 w-6 mb-2" />
                <span className="font-medium">Mentors</span>
              </TabsTrigger>
            </TabsList>

            {Object.entries(services).map(([key, service]) => (
              <TabsContent key={key} value={key} className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-8 animate-slide-up">
                    <div>
                      <div className="flex items-center mb-4">
                        <div className="p-3 bg-primary/10 rounded-lg mr-4">
                          <service.icon className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold text-foreground">{service.title}</h2>
                          <p className="text-primary font-medium">{service.subtitle}</p>
                        </div>
                      </div>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-4">Key Features</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {service.features.map((feature, index) => (
                          <div key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-secondary mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gradient-accent p-6 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-3">Proven Results</h4>
                      <div className="space-y-2">
                        {service.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center">
                            <Star className="h-4 w-4 text-primary mr-2" />
                            <span className="text-sm text-muted-foreground">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-border pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-semibold text-foreground">Pricing</span>
                        <span className="text-primary font-medium">{service.pricing}</span>
                      </div>
                      <Link to="/signup">
                        <Button className="w-full bg-gradient-hero text-white shadow-primary">
                          Get Started Today
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="animate-fade-in">
                    <Card className="shadow-elegant border-0 bg-gradient-card">
                      <CardContent className="p-8">
                        <div className="text-center mb-8">
                          <div className="w-20 h-20 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                            <service.icon className="h-10 w-10 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-foreground mb-2">
                            {key === 'youth' ? 'Student Success Dashboard' : 
                             key === 'parents' ? 'Parent Insights Portal' : 
                             'Mentor Impact Tracker'}
                          </h3>
                          <p className="text-muted-foreground">
                            {key === 'youth' ? 'Track your progress and achievements' :
                             key === 'parents' ? 'Monitor your child\'s career development' :
                             'Measure your mentoring impact'}
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="bg-background/50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-foreground">
                                {key === 'youth' ? 'Career Readiness Score' :
                                 key === 'parents' ? 'Family Engagement Level' :
                                 'Mentoring Effectiveness'}
                              </span>
                              <span className="text-primary font-bold">
                                {key === 'youth' ? '87%' : key === 'parents' ? '92%' : '95%'}
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-gradient-hero h-2 rounded-full transition-all duration-1000"
                                style={{ 
                                  width: key === 'youth' ? '87%' : key === 'parents' ? '92%' : '95%' 
                                }}
                              ></div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-primary">
                                {key === 'youth' ? '12' : key === 'parents' ? '3' : '8'}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {key === 'youth' ? 'Skills Developed' : 
                                 key === 'parents' ? 'Children Supported' : 
                                 'Active Mentees'}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-secondary">
                                {key === 'youth' ? '34' : key === 'parents' ? '18' : '127'}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {key === 'youth' ? 'Days Active' : 
                                 key === 'parents' ? 'Weeks Engaged' : 
                                 'Hours Mentored'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Additional Services</h2>
            <p className="text-xl text-muted-foreground">
              Specialized solutions for organizations and institutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {additionalServices.map((service, index) => (
              <Card 
                key={service.title}
                className="hover:shadow-primary transition-all duration-300 animate-bounce-in border-0 bg-background/50 backdrop-blur-sm"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <CardHeader>
                  <div className="p-3 bg-secondary/10 rounded-lg w-fit mb-4">
                    <service.icon className="h-8 w-8 text-secondary" />
                  </div>
                  <CardTitle className="text-xl text-foreground">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <div className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Creative Dual-Tone Design */}
      <section className="relative py-32 bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 overflow-hidden">
        {/* Creative Background Elements */}
        <div className="absolute inset-0">
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="services-cta-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="1" fill="currentColor" className="text-foreground" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#services-cta-grid)" />
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
                <span className="font-semibold text-[#FE047F]">Comprehensive Career Services</span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Ready to Transform Your{" "}
                <span className="text-[#00690D]">Career Journey?</span>
              </h2>

              <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
                Choose the service that's right for you and join thousands of successful Tanzanians building their dream careers.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/signup">
                  <Button
                    size="lg"
                    className="group bg-[#FE047F] hover:bg-[#FE047F]/90 text-white text-lg px-12 py-6 shadow-xl shadow-[#FE047F]/20 transform hover:scale-105 transition-all duration-300 font-semibold">
                    Start Free Trial
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-[#00690D] text-[#00690D] hover:bg-[#00690D] hover:text-white text-lg px-12 py-6 font-semibold transition-all duration-300">
                    <Clock className="mr-2 h-5 w-5" />
                    Schedule Consultation
                  </Button>
                </Link>
              </div>

              {/* Trust badges - Compact */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#00690D]" />
                  <span>Free for Students</span>
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

            {/* Right Column - Service Highlights */}
            <div className="relative hidden lg:block">
              {/* Service Cards */}
              <div className="space-y-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-800 hover:scale-105 transition-transform">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#FE047F] flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Youth Empowerment</p>
                      <p className="text-sm text-muted-foreground">Free for Students</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-800 hover:scale-105 transition-transform">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#00690D] flex items-center justify-center">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Parental Guidance</p>
                      <p className="text-sm text-muted-foreground">Family Packages</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-800 hover:scale-105 transition-transform">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#FE047F] flex items-center justify-center">
                      <UserCheck className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Expert Mentorship</p>
                      <p className="text-sm text-muted-foreground">Earn While You Guide</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-[#00690D] text-white px-6 py-4 rounded-2xl shadow-xl transform rotate-3 hover:rotate-0 transition-transform">
                <p className="text-sm font-medium">🎉 3 Service Options</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}