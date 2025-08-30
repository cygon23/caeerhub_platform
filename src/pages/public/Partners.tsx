import PublicLayout from "@/components/layout/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Building2, 
  Handshake, 
  Globe, 
  TrendingUp, 
  Users, 
  Award,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import { useGSAP, useGSAPScale, useGSAPStagger, useGSAPTextReveal, useGSAPFlip } from "@/hooks/useGSAP";

export default function Partners() {
  const heroRef = useGSAPTextReveal();
  const statsRef = useGSAPStagger(0.1);
  const partnersRef = useGSAPStagger(0.08);
  const typesRef = useGSAPFlip();
  const storiesRef = useGSAPScale();

  const partners = [
    {
      name: "TechnoServe",
      category: "Development Partner",
      description: "Supporting youth entrepreneurship programs and business skills training across East Africa.",
      logo: "🌱",
      impact: "15,000+ youth trained",
      color: "bg-green-500/10 text-green-600"
    },
    {
      name: "USAID Tanzania",
      category: "Government Partner", 
      description: "Funding workforce development initiatives and digital skills programs for Tanzanian youth.",
      logo: "🇺🇸",
      impact: "TZS 2.5B invested",
      color: "bg-blue-500/10 text-blue-600"
    },
    {
      name: "World Bank Group",
      category: "Financial Partner",
      description: "Supporting policy development and large-scale youth employment programs in Tanzania.",
      logo: "🏦",
      impact: "Policy framework support",
      color: "bg-purple-500/10 text-purple-600"
    },
    {
      name: "Vodacom Foundation",
      category: "Technology Partner",
      description: "Providing mobile learning platforms and digital literacy programs for underserved communities.",
      logo: "📱",
      impact: "100,000+ digital connections",
      color: "bg-red-500/10 text-red-600"
    },
    {
      name: "Mastercard Foundation",
      category: "Strategic Partner",
      description: "Funding comprehensive youth development programs focusing on financial inclusion and skills.",
      logo: "💳",
      impact: "25,000+ youth empowered",
      color: "bg-orange-500/10 text-orange-600"
    },
    {
      name: "Google.org",
      category: "Technology Partner",
      description: "Supporting AI-powered educational tools and providing access to Google Career Certificates.",
      logo: "🔍",
      impact: "AI tools & certification",
      color: "bg-indigo-500/10 text-indigo-600"
    }
  ];

  const partnershipTypes = [
    {
      icon: Building2,
      title: "Corporate Partnerships",
      description: "Partner with us to access Tanzania's top young talent and build your future workforce.",
      benefits: [
        "Early access to skilled graduates",
        "Custom training programs",
        "CSR partnership opportunities",
        "Brand visibility among youth"
      ]
    },
    {
      icon: Globe,
      title: "International Organizations",
      description: "Collaborate on large-scale youth development and economic empowerment initiatives.",
      benefits: [
        "Program co-development",
        "Knowledge sharing platforms",
        "Impact measurement & reporting",
        "Policy advocacy support"
      ]
    },
    {
      icon: Users,
      title: "Educational Institutions",
      description: "Integrate our platform into your curriculum and career services programs.",
      benefits: [
        "Student career readiness tools",
        "Alumni engagement platforms",
        "Faculty training programs",
        "Institutional dashboards"
      ]
    }
  ];

  const stats = [
    { number: "50+", label: "Active Partners" },
    { number: "150,000+", label: "Youth Reached Through Partnerships" },
    { number: "TZS 15B+", label: "Partnership Investment Value" },
    { number: "12", label: "Countries Represented" }
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <Handshake className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-4xl md:text-6xl font-bold text-foreground">
                Our 
                <span className="bg-gradient-hero bg-clip-text text-transparent"> Partners</span>
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Collaborating with leading organizations to create opportunities and drive 
              sustainable career development for Tanzanian youth.
            </p>
          </div>
        </div>
      </section>

      {/* Partnership Stats */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className="text-center animate-bounce-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Partners */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Featured Partners</h2>
            <p className="text-xl text-muted-foreground">
              Working together to transform career development in Tanzania
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partners.map((partner, index) => (
              <Card 
                key={partner.name}
                className="hover:shadow-primary transition-all duration-300 animate-slide-up border-0 bg-background/50 backdrop-blur-sm"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{partner.logo}</div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${partner.color}`}>
                      {partner.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-2">{partner.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {partner.description}
                  </p>

                  <div className="bg-gradient-accent p-3 rounded-lg">
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm font-medium text-foreground">{partner.impact}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Types */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Partnership Opportunities</h2>
            <p className="text-xl text-muted-foreground">
              Multiple ways to collaborate and make a lasting impact on youth development
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {partnershipTypes.map((type, index) => (
              <Card 
                key={type.title}
                className="hover:shadow-secondary transition-all duration-300 animate-fade-in border-0 bg-gradient-card"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className="p-8">
                  <div className="p-3 bg-primary/10 rounded-lg w-fit mb-6">
                    <type.icon className="h-8 w-8 text-primary" />
                  </div>

                  <h3 className="text-2xl font-semibold text-foreground mb-4">{type.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{type.description}</p>

                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground">Partnership Benefits:</h4>
                    {type.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <Award className="h-4 w-4 text-secondary mr-3 flex-shrink-0" />
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

      {/* Success Stories */}
      <section className="py-20 bg-gradient-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Partnership Success Stories</h2>
            <p className="text-xl text-muted-foreground">
              Real impact achieved through strategic collaborations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-0 bg-background/50 backdrop-blur-sm hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-start mb-4">
                  <div className="text-3xl mr-4">🎓</div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Vodacom Foundation Digital Skills Program
                    </h3>
                    <p className="text-primary font-medium mb-3">2023 Partnership Initiative</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  Launched comprehensive digital literacy program reaching 10,000 youth in rural areas, 
                  with 85% completing certification and 67% securing digital economy jobs.
                </p>
                <div className="bg-gradient-accent p-4 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                      <div className="font-bold text-primary">10,000</div>
                      <div className="text-muted-foreground">Youth Trained</div>
                    </div>
                    <div>
                      <div className="font-bold text-secondary">85%</div>
                      <div className="text-muted-foreground">Completion Rate</div>
                    </div>
                    <div>
                      <div className="font-bold text-primary">67%</div>
                      <div className="text-muted-foreground">Job Placement</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-background/50 backdrop-blur-sm hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-start mb-4">
                  <div className="text-3xl mr-4">🚀</div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Mastercard Foundation Entrepreneurship Hub
                    </h3>
                    <p className="text-primary font-medium mb-3">2022-2024 Partnership</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  Established entrepreneurship incubation program supporting young entrepreneurs to 
                  start and scale businesses, creating over 3,000 direct and indirect jobs.
                </p>
                <div className="bg-gradient-accent p-4 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                      <div className="font-bold text-primary">500</div>
                      <div className="text-muted-foreground">Startups Launched</div>
                    </div>
                    <div>
                      <div className="font-bold text-secondary">3,000+</div>
                      <div className="text-muted-foreground">Jobs Created</div>
                    </div>
                    <div>
                      <div className="font-bold text-primary">TZS 2.1B</div>
                      <div className="text-muted-foreground">Revenue Generated</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How to Partner */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-8">Ready to Partner With Us?</h2>
          <p className="text-xl text-muted-foreground mb-12">
            Join our growing network of partners committed to empowering Tanzanian youth
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Connect</h3>
              <p className="text-muted-foreground text-sm">Reach out to discuss partnership opportunities</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Collaborate</h3>
              <p className="text-muted-foreground text-sm">Design programs that align with your goals</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Impact</h3>
              <p className="text-muted-foreground text-sm">Measure and celebrate our collective impact</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-gradient-hero text-white shadow-primary">
                Become a Partner
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary/10"
            >
              <ExternalLink className="mr-2 h-5 w-5" />
              Partnership Deck
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}