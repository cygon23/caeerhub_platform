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
  CheckCircle
} from "lucide-react";
import { useGSAP, useGSAPScale, useGSAPStagger, useGSAPTextReveal, useGSAPFlip, useGSAPMagnetic } from "@/hooks/useGSAP";

export default function Features() {
  const heroRef = useGSAPTextReveal();
  const featuresRef = useGSAPStagger(0.05);
  const processRef = useGSAPStagger(0.2);
  const statsRef = useGSAPFlip();
  const ctaRef = useGSAPMagnetic();

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
          <div ref={heroRef}>
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="h-8 w-8 text-primary mr-3 animate-pulse-scale" />
              <h1 className="text-4xl md:text-6xl font-bold text-foreground">
                AI-Powered 
                <span className="bg-gradient-hero bg-clip-text text-transparent"> Features</span>
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover how our cutting-edge technology and expert guidance work together 
              to accelerate your career development and unlock your full potential.
            </p>
            <div ref={ctaRef}>
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
      <section className="py-20">
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

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">
              Your journey to career success in just 4 simple steps
            </p>
          </div>

            <div ref={processRef} className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Take Assessment",
                description: "Complete our comprehensive AI-powered personality and skills assessment"
              },
              {
                step: "02", 
                title: "Get Your Roadmap",
                description: "Receive a personalized career development plan tailored to your profile"
              },
              {
                step: "03",
                title: "Connect & Learn",
                description: "Access mentors, learning modules, and career-building tools"
              },
              {
                step: "04",
                title: "Achieve Success",
                description: "Track progress, build skills, and land your dream career"
              }
            ].map((item, index) => (
              <Card 
                key={item.step}
                className="text-center hover:shadow-secondary transition-all duration-500 border-0 bg-background/50 backdrop-blur-sm hover-tilt group"
              >
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-primary mb-4 group-hover:scale-125 transition-transform duration-300">{item.step}</div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-12">
            Proven Results
          </h2>
          
          <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: "94%", label: "Career Match Accuracy" },
              { number: "87%", label: "Job Placement Rate" },  
              { number: "76%", label: "Average Salary Increase" },
              { number: "4.8/5", label: "User Satisfaction Rating" }
            ].map((stat, index) => (
              <div 
                key={stat.label}
                className="text-center hover-lift cursor-pointer"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2 animate-pulse-scale">{stat.number}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-bounce-in">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Experience the Future of Career Development?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of Tanzanian youth who are already using AI to accelerate their career growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4 shadow-elegant"
                >
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10 text-lg px-8 py-4"
                >
                  Schedule Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}