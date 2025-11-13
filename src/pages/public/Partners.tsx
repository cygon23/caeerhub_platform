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
  ExternalLink,
  Sprout,
  Flag,
  Landmark,
  Smartphone,
  CreditCard,
  Search,
  GraduationCap,
  Rocket,
  Sparkles,
  DollarSign,
  MapPin
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
      logo: Sprout,
      impact: "15,000+ youth trained",
      color: "bg-secondary/10 text-secondary"
    },
    {
      name: "USAID Tanzania",
      category: "Government Partner",
      description: "Funding workforce development initiatives and digital skills programs for Tanzanian youth.",
      logo: Flag,
      impact: "TZS 2.5B invested",
      color: "bg-primary/10 text-primary"
    },
    {
      name: "World Bank Group",
      category: "Financial Partner",
      description: "Supporting policy development and large-scale youth employment programs in Tanzania.",
      logo: Landmark,
      impact: "Policy framework support",
      color: "bg-primary/10 text-primary"
    },
    {
      name: "Vodacom Foundation",
      category: "Technology Partner",
      description: "Providing mobile learning platforms and digital literacy programs for underserved communities.",
      logo: Smartphone,
      impact: "100,000+ digital connections",
      color: "bg-secondary/10 text-secondary"
    },
    {
      name: "Mastercard Foundation",
      category: "Strategic Partner",
      description: "Funding comprehensive youth development programs focusing on financial inclusion and skills.",
      logo: CreditCard,
      impact: "25,000+ youth empowered",
      color: "bg-primary/10 text-primary"
    },
    {
      name: "Google.org",
      category: "Technology Partner",
      description: "Supporting AI-powered educational tools and providing access to Google Career Certificates.",
      logo: Search,
      impact: "AI tools & certification",
      color: "bg-secondary/10 text-secondary"
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
    { number: "5+", label: "Active Partners", icon: Handshake, color: "bg-[#FE047F]", ready: true },
    { number: "200+", label: "Youth Reached Through Partnerships", icon: Users, color: "bg-[#00690D]", ready: true },
    { number: "Be First", label: "Partnership Investment - Join Us", icon: DollarSign, color: "bg-[#FE047F]", ready: false },
    { number: "Join Us", label: "Expand to New Regions", icon: MapPin, color: "bg-[#00690D]", ready: false },
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
                <span className="text-[#FE047F]">Partners</span>
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Collaborating with leading organizations to create opportunities and drive
              sustainable career development for Tanzanian youth.
            </p>
          </div>
        </div>
      </section>

      {/* Partnership Stats - Circular Badge Design */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="flex flex-col items-center group"
              >
                {/* Circular Badge */}
                <div className="relative mb-6">
                  {/* Outer glow ring */}
                  <div className={`absolute inset-0 rounded-full ${stat.color} opacity-20 blur-xl group-hover:opacity-40 transition-opacity animate-pulse-scale`}></div>

                  {/* Main circular badge */}
                  <div className={`relative w-32 h-32 rounded-full ${stat.color} flex flex-col items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300 ${!stat.ready ? 'border-4 border-dashed border-white/50' : ''}`}>
                    {/* Icon */}
                    <stat.icon className="h-8 w-8 text-white mb-2" />
                    {/* Number */}
                    <span className={`${stat.ready ? 'text-2xl' : 'text-lg'} font-bold text-white`}>{stat.number}</span>
                  </div>
                </div>

                {/* Label below */}
                <p className="text-center text-foreground font-semibold text-sm leading-tight">{stat.label}</p>
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
                    <div className={`p-3 rounded-lg ${partner.color}`}>
                      <partner.logo className="h-8 w-8" />
                    </div>
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

      {/* Partnership Success Stories - Be The First */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Partnership Success Stories</h2>
            <p className="text-xl text-muted-foreground">
              Be among the first to create impact stories with us
            </p>
          </div>

          <Card className="border-2 border-[#FE047F]/20 bg-white dark:bg-slate-900 hover:shadow-2xl transition-all duration-500">
            <CardContent className="p-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-full bg-[#FE047F]/10 flex items-center justify-center">
                  <Handshake className="h-12 w-12 text-[#FE047F]" />
                </div>
              </div>

              <h3 className="text-3xl font-bold text-foreground mb-4">
                Your Story Starts Here
              </h3>

              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                We're building something special together. As we launch our platform, we're inviting forward-thinking
                organizations to be founding partners. Your partnership will directly shape our impact and create the
                first success stories that inspire others.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-[#FE047F]/5 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-[#FE047F] flex items-center justify-center mx-auto mb-3">
                    <Rocket className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Founding Partner Status</h4>
                  <p className="text-sm text-muted-foreground">Recognition as one of our first strategic partners</p>
                </div>

                <div className="p-6 bg-[#00690D]/5 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-[#00690D] flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Direct Youth Impact</h4>
                  <p className="text-sm text-muted-foreground">Help empower the next generation of Tanzanian leaders</p>
                </div>

                <div className="p-6 bg-[#FE047F]/5 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-[#FE047F] flex items-center justify-center mx-auto mb-3">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Co-Create Solutions</h4>
                  <p className="text-sm text-muted-foreground">Shape programs that align with your CSR goals</p>
                </div>
              </div>

              <Link to="/contact">
                <Button size="lg" className="bg-[#FE047F] hover:bg-[#FE047F]/90 text-white text-lg px-12 py-6 shadow-xl shadow-[#FE047F]/20">
                  Become a Founding Partner
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
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