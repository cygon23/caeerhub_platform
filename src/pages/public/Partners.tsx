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
import { useTranslation } from "react-i18next";

export default function Partners() {
  const { t } = useTranslation('partners');

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
      title: t('opportunities.corporate.title'),
      description: t('opportunities.corporate.description'),
      benefits: [
        "Early access to skilled graduates",
        "Custom training programs",
        "CSR partnership opportunities",
        "Brand visibility among youth"
      ]
    },
    {
      icon: Globe,
      title: t('opportunities.international.title'),
      description: t('opportunities.international.description'),
      benefits: [
        "Program co-development",
        "Knowledge sharing platforms",
        "Impact measurement & reporting",
        "Policy advocacy support"
      ]
    },
    {
      icon: Users,
      title: t('opportunities.educational.title'),
      description: t('opportunities.educational.description'),
      benefits: [
        "Student career readiness tools",
        "Alumni engagement platforms",
        "Faculty training programs",
        "Institutional dashboards"
      ]
    }
  ];

  const stats = [
    {
      number: "5+",
      label: t('stats.activePartners'),
      icon: Handshake,
      color: "bg-[#FE047F]",
      ready: true
    },
    {
      number: "200+",
      label: t('stats.youthReached'),
      icon: Users,
      color: "bg-[#00690D]",
      ready: true
    },
    {
      number: t('stats.beFirst'),
      label: t('stats.investmentValue'),
      icon: DollarSign,
      color: "bg-[#FE047F]",
      ready: false
    },
    {
      number: t('stats.joinUs'),
      label: t('stats.regions'),
      icon: MapPin,
      color: "bg-[#00690D]",
      ready: false
    },
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
          <div>
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="h-8 w-8 text-[#FE047F] mr-3 animate-pulse-scale" />
              <h1 className="text-4xl md:text-6xl font-bold text-foreground">
                {t('hero.title')}{" "}
                <span className="text-[#FE047F]">{t('hero.titleHighlight')}</span>
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              {t('hero.subtitle')}
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
            <h2 className="text-4xl font-bold text-foreground mb-4">{t('featured.title')}</h2>
            <p className="text-xl text-muted-foreground">
              {t('featured.subtitle')}
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
            <h2 className="text-4xl font-bold text-foreground mb-4">{t('opportunities.title')}</h2>
            <p className="text-xl text-muted-foreground">
              {t('opportunities.subtitle')}
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
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 relative overflow-hidden">
        {/* Subtle background elements */}
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="founding-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <circle cx="15" cy="15" r="1" fill="currentColor" className="text-foreground" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#founding-grid)" />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">{t('founding.title')}</h2>
            <p className="text-xl text-muted-foreground">
              {t('founding.subtitle')}
            </p>
          </div>

          {/* Split Layout - Cleaner Design */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Main Content */}
            <div className="text-left">
              <div className="inline-flex items-center gap-2 bg-[#FE047F]/10 px-5 py-2 rounded-full mb-6 border border-[#FE047F]/20">
                <Handshake className="h-5 w-5 text-[#FE047F]" />
                <span className="text-sm font-semibold text-[#FE047F]">{t('founding.badge')}</span>
              </div>

              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                {t('founding.heading')} <span className="text-[#FE047F]">{t('founding.headingHighlight')}</span>
              </h3>

              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {t('founding.description')}
              </p>

              <Link to="/contact">
                <Button size="lg" className="bg-[#FE047F] hover:bg-[#FE047F]/90 text-white text-lg px-10 py-6 shadow-xl shadow-[#FE047F]/20 group">
                  {t('founding.button')}
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Right Column - Benefits List */}
            <div className="space-y-6">
              {/* Benefit 1 */}
              <div className="flex items-start gap-4 p-6 bg-white dark:bg-slate-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-800">
                <div className="w-14 h-14 rounded-full bg-[#FE047F] flex items-center justify-center flex-shrink-0">
                  <Rocket className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">{t('founding.benefits.status.title')}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t('founding.benefits.status.description')}</p>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="flex items-start gap-4 p-6 bg-white dark:bg-slate-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-800">
                <div className="w-14 h-14 rounded-full bg-[#00690D] flex items-center justify-center flex-shrink-0">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">{t('founding.benefits.impact.title')}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t('founding.benefits.impact.description')}</p>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="flex items-start gap-4 p-6 bg-white dark:bg-slate-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-800">
                <div className="w-14 h-14 rounded-full bg-[#FE047F] flex items-center justify-center flex-shrink-0">
                  <Award className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">{t('founding.benefits.coCreate.title')}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t('founding.benefits.coCreate.description')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Partner - Enhanced UX/UI */}
      <section className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#FE047F]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00690D]/10 rounded-full blur-3xl"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t('readyToPartner.title')} <span className="text-[#FE047F]">{t('readyToPartner.titleHighlight')}</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('readyToPartner.subtitle')}
            </p>
          </div>

          {/* Partnership Steps - Circular Badge Design */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16 max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative mb-6">
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-full bg-[#FE047F] opacity-20 blur-xl group-hover:opacity-40 transition-opacity"></div>

                {/* Main circular badge */}
                <div className="relative w-24 h-24 rounded-full bg-[#FE047F] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-3xl">1</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{t('readyToPartner.steps.connect.title')}</h3>
              <p className="text-muted-foreground leading-relaxed">{t('readyToPartner.steps.connect.description')}</p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative mb-6">
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-full bg-[#00690D] opacity-20 blur-xl group-hover:opacity-40 transition-opacity"></div>

                {/* Main circular badge */}
                <div className="relative w-24 h-24 rounded-full bg-[#00690D] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-3xl">2</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{t('readyToPartner.steps.collaborate.title')}</h3>
              <p className="text-muted-foreground leading-relaxed">{t('readyToPartner.steps.collaborate.description')}</p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative mb-6">
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-full bg-[#FE047F] opacity-20 blur-xl group-hover:opacity-40 transition-opacity"></div>

                {/* Main circular badge */}
                <div className="relative w-24 h-24 rounded-full bg-[#FE047F] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-3xl">3</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{t('readyToPartner.steps.impact.title')}</h3>
              <p className="text-muted-foreground leading-relaxed">{t('readyToPartner.steps.impact.description')}</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-[#FE047F] hover:bg-[#FE047F]/90 text-white text-lg px-12 py-6 shadow-xl shadow-[#FE047F]/20 group">
                {t('readyToPartner.buttonPartner')}
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-[#00690D] text-[#00690D] hover:bg-[#00690D] hover:text-white text-lg px-12 py-6 font-semibold transition-all duration-300"
            >
              <ExternalLink className="mr-2 h-5 w-5" />
              {t('readyToPartner.buttonDeck')}
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
