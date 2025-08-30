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
  CheckCircle
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
      {/* Hero Section */}
      <section className="py-20 bg-gradient-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Our 
              <span className="bg-gradient-hero bg-clip-text text-transparent"> Services</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-bounce-in">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Career Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Choose the service that's right for you and join thousands of successful Tanzanians.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4 shadow-elegant"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10 text-lg px-8 py-4"
                >
                  <Clock className="mr-2 h-5 w-5" />
                  Schedule Consultation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}