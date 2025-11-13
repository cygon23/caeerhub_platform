import PublicLayout from "@/components/layout/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Target,
  Eye,
  Heart,
  Calendar,
  Users,
  Award,
  MapPin,
  TrendingUp,
  Lightbulb,
  Shield,
  Sparkles,
  Rocket,
  Star,
  Globe,
  Zap,
  CheckCircle2,
  ArrowRight,
  UserCircle2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGSAPStagger, useGSAPScale } from "@/hooks/useGSAP";

export default function About() {
  const { t } = useTranslation('about');
  const impactRef = useGSAPStagger(0.1);
  const ctaRef = useGSAPScale();

  const timeline = [
    {
      year: "2025",
      title: "Foundation Launch",
      description:
        "Career na Mimi was founded with a mission to empower Tanzanian youth through career guidance and skills development.",
      icon: Rocket,
      gradient: "from-[#FE047F] to-[#FE047F]/80",
    },
    {
      year: "2026",
      title: "First 10,000 Youth",
      description:
        "Expected to reach our first major milestone of supporting 10,000 young people across Tanzania.",
      icon: Users,
      gradient: "from-[#00690D] to-[#00690D]/80",
    },
    {
      year: "2027",
      title: "Digital Transformation",
      description:
        "Expecting to launch our digital platform to reach youth in remote areas and scale our impact nationwide.",
      icon: Globe,
      gradient: "from-[#00690D] to-[#00690D]/80",
    },
    {
      year: "2028",
      title: "AI-Powered Platform",
      description:
        "Expected to fully integrate advanced AI technology to provide personalized career recommendations and smart mentorship matching.",
      icon: Sparkles,
      gradient: "from-[#FE047F] to-[#FE047F]/80",
    },
    {
      year: "2030",
      title: "200K+ Youth Impacted",
      description:
        "Expecting continued growth and the success stories of hundreds of thousands of young Tanzanians.",
      icon: Star,
      gradient: "from-[#FE047F] to-[#FE047F]/80",
    },
  ];

  const team = [
    {
      name: "Rahman Mabahe",
      role: "CEO & Founder",
      bio: "AI innovator and community leader driving career development solutions for Tanzanian youth.",
      initials: "RM",
      gradient: "from-[#FE047F] to-[#FE047F]/80",
    },
    {
      name: "Abdulswad Azihar",
      role: "CTO",
      bio: "Tech entrepreneur and AI specialist, previously at Google and Microsoft, passionate about using technology for social impact.",
      initials: "AA",
      gradient: "from-[#00690D] to-[#00690D]/80",
    },
    {
      name: "Godfrey Gozberty",
      role: "Head of Programs",
      bio: "Career counselor and mentor with expertise in youth psychology and workforce development.",
      initials: "GG",
      gradient: "from-[#00690D] to-[#00690D]/80",
    },
    {
      name: "Karen Kamene",
      role: "Head of Partnerships",
      bio: "Partnership official specializing in public-private partnerships and organizational development.",
      initials: "KK",
      gradient: "from-[#FE047F] to-[#FE047F]/80",
    },
  ];

  const values = [
    {
      icon: Lightbulb,
      title: t('values.innovation.title'),
      description: t('values.innovation.description'),
      gradient: "from-[#FE047F]/10 to-[#FE047F]/5",
      iconColor: "text-[#FE047F]",
    },
    {
      icon: Globe,
      title: t('values.accessibility.title'),
      description: t('values.accessibility.description'),
      gradient: "from-[#FE047F]/10 to-[#FE047F]/5",
      iconColor: "text-[#FE047F]",
    },
    {
      icon: Rocket,
      title: t('values.empowerment.title'),
      description: t('values.empowerment.description'),
      gradient: "from-[#00690D]/10 to-[#00690D]/5",
      iconColor: "text-[#00690D]",
    },
    {
      icon: Users,
      title: t('values.community.title'),
      description: t('values.community.description'),
      gradient: "from-[#00690D]/10 to-[#00690D]/5",
      iconColor: "text-[#00690D]",
    },
  ];

  const impactStats = [
    {
      number: "200+",
      label: t('stats.youth'),
      icon: Users,
      color: "bg-[#FE047F]",
    },
    {
      number: "2+",
      label: t('stats.regions'),
      icon: MapPin,
      color: "bg-[#00690D]",
    },
    {
      number: "89%",
      label: t('stats.successRate'),
      icon: TrendingUp,
      color: "bg-[#00690D]",
    },
    {
      number: "5+",
      label: t('stats.partners'),
      icon: Award,
      color: "bg-[#FE047F]",
    },
  ];

  const innovations = [
    {
      icon: Lightbulb,
      title: "AI-Powered Career Matching",
      description:
        "Revolutionary algorithm that analyzes personality, skills, and market trends to find perfect career fits.",
      year: "2024",
      gradient: "from-[#FE047F]/10 to-[#FE047F]/5",
      iconColor: "text-[#FE047F]",
    },
    {
      icon: Users,
      title: "Smart Mentorship Platform",
      description:
        "AI-driven mentor matching system connecting youth with industry professionals based on compatibility.",
      year: "2025",
      gradient: "from-[#00690D]/10 to-[#00690D]/5",
      iconColor: "text-[#00690D]",
    },
    {
      icon: Shield,
      title: "Blockchain Certification",
      description:
        "Secure, verifiable digital credentials and achievements stored on blockchain technology.",
      year: "2025",
      gradient: "from-[#00690D]/10 to-[#00690D]/5",
      iconColor: "text-[#00690D]",
    },
  ];

  return (
    <PublicLayout>
      {/* Hero Section - Clean & Simple */}
      <section className='py-20 bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 relative overflow-hidden'>
        {/* Animated background elements */}
        <div className='absolute inset-0'>
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className='absolute rounded-full bg-[#FE047F]/10 animate-float'
              style={{
                width: `${20 + Math.random() * 60}px`,
                height: `${20 + Math.random() * 60}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 4}s`,
              }}></div>
          ))}
        </div>

        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10'>
          <div>
            <div className='flex items-center justify-center mb-6'>
              <Sparkles className='h-8 w-8 text-[#FE047F] mr-3 animate-pulse-scale' />
              <h1 className='text-4xl md:text-6xl font-bold text-foreground'>
                {t('hero.title')}{" "}
                <span className='text-[#FE047F]'>{t('hero.titleHighlight')}</span>
              </h1>
            </div>
            <p className='text-xl text-muted-foreground max-w-3xl mx-auto mb-8'>
              {t('hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision - Flipped Modern Design */}
      <section className='py-24 bg-white dark:bg-slate-950'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
            {/* Vision First (Flipped) */}
            <Card className='group relative overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 border-[#00690D]/20 bg-white dark:bg-slate-900'>
              <CardContent className='p-10'>
                {/* Circular Icon Badge */}
                <div className='relative inline-block mb-8'>
                  <div className='w-20 h-20 rounded-full bg-[#00690D]/10 flex items-center justify-center group-hover:scale-110 transition-transform'>
                    <Eye className='h-10 w-10 text-[#00690D]' />
                  </div>
                </div>

                <h2 className='text-3xl md:text-4xl font-bold text-foreground mb-6'>
                  {t('vision.title')}
                </h2>

                <p className='text-lg text-muted-foreground leading-relaxed'>
                  {t('vision.content')}
                </p>

                {/* Bottom accent line */}
                <div className='mt-8 h-1 w-full bg-[#00690D]/20 rounded-full'></div>
              </CardContent>
            </Card>

            {/* Mission Second */}
            <Card className='group relative overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 border-[#FE047F]/20 bg-white dark:bg-slate-900'>
              <CardContent className='p-10'>
                {/* Circular Icon Badge */}
                <div className='relative inline-block mb-8'>
                  <div className='w-20 h-20 rounded-full bg-[#FE047F]/10 flex items-center justify-center group-hover:scale-110 transition-transform'>
                    <Target className='h-10 w-10 text-[#FE047F]' />
                  </div>
                </div>

                <h2 className='text-3xl md:text-4xl font-bold text-foreground mb-6'>
                  {t('mission.title')}
                </h2>

                <p className='text-lg text-muted-foreground leading-relaxed'>
                  {t('mission.content')}
                </p>

                {/* Bottom accent line */}
                <div className='mt-8 h-1 w-full bg-[#FE047F]/20 rounded-full'></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Stats - Circular Badge Design */}
      <section className='py-24 bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold text-foreground mb-4'>
              Our{" "}
              <span className='text-[#FE047F]'>
                Impact Story
              </span>
            </h2>
            <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
              Real numbers that reflect lives transformed and futures brightened
              across Tanzania
            </p>
          </div>

          <div
            ref={impactRef}
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto'>
            {impactStats.map((stat, index) => (
              <div
                key={stat.label}
                className='flex flex-col items-center group'>
                {/* Circular Badge with Icon */}
                <div className='relative mb-6'>
                  {/* Outer glow ring */}
                  <div className={`absolute inset-0 rounded-full ${stat.color} opacity-20 blur-xl group-hover:opacity-40 transition-opacity animate-pulse-scale`}></div>

                  {/* Main circular badge */}
                  <div className={`relative w-32 h-32 rounded-full ${stat.color} flex flex-col items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
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

      {/* Innovation Section - Redesigned */}
      <section className='py-24 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-20'>
            <h2 className='text-4xl md:text-5xl font-bold text-foreground mb-6'>
              Innovation at{" "}
              <span className='text-[#FE047F]'>
                Our Core
              </span>
            </h2>
            <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
              Pioneering technology solutions that bridge the gap between
              potential and opportunity
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
            {innovations.map((innovation, index) => (
              <Card
                key={innovation.title}
                className='group relative overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-white dark:bg-slate-900 hover:-translate-y-2'>
                {/* Gradient background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${innovation.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                <CardContent className='relative p-10 text-center'>
                  {/* Year badge */}
                  <div className='absolute top-4 right-4'>
                    <span
                      className={`inline-flex items-center gap-1 bg-gradient-to-r ${innovation.gradient} backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-bold`}>
                      <Zap className='h-3 w-3' />
                      {innovation.year}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className='relative mb-8'>
                    <div
                      className={`absolute inset-0 ${innovation.iconColor} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity`}></div>
                    <innovation.icon
                      className={`relative h-16 w-16 ${innovation.iconColor} mx-auto`}
                    />
                  </div>

                  {/* Title */}
                  <h3 className='text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors'>
                    {innovation.title}
                  </h3>

                  {/* Description */}
                  <p className='text-muted-foreground leading-relaxed'>
                    {innovation.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline - Redesigned */}
      <section className='py-24 bg-white dark:bg-slate-950'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-20'>
            <h2 className='text-4xl md:text-5xl font-bold text-foreground mb-6'>
              Our{" "}
              <span className='bg-gradient-to-r from-[#00690D] to-[#00690D] bg-clip-text text-transparent'>
                Journey
              </span>
            </h2>
            <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
              From a small initiative to a nationwide movement empowering youth
              across Tanzania
            </p>
          </div>

          <div className='relative'>
            <div className='absolute left-1/2 transform -translate-x-px h-full w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 opacity-20'></div>

            <div className='space-y-16'>
              {timeline.map((milestone, index) => (
                <div
                  key={milestone.year}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? "justify-start" : "justify-end"
                  } animate-slide-up`}
                  style={{ animationDelay: `${index * 0.2}s` }}>
                  <div
                    className={`w-5/12 ${
                      index % 2 === 0 ? "text-right pr-12" : "text-left pl-12"
                    }`}>
                    <Card className='group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 hover:-translate-y-2'>
                      <CardContent className='p-8'>
                        {/* Icon */}
                        <div
                          className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${milestone.gradient} mb-4`}>
                          <milestone.icon className='h-6 w-6 text-white' />
                        </div>

                        {/* Year */}
                        <div
                          className={`inline-flex items-center gap-2 bg-gradient-to-r ${milestone.gradient} bg-clip-text text-transparent font-bold text-xl mb-3`}>
                          <Calendar className='h-5 w-5' />
                          {milestone.year}
                        </div>

                        {/* Title */}
                        <h3 className='text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors'>
                          {milestone.title}
                        </h3>

                        {/* Description */}
                        <p className='text-muted-foreground leading-relaxed'>
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Center dot */}
                  <div
                    className={`absolute left-1/2 transform -translate-x-1/2 p-2 bg-gradient-to-r ${milestone.gradient} rounded-full border-4 border-background z-10 shadow-xl`}>
                    <div className='w-3 h-3 bg-white rounded-full'></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team - Redesigned */}
      <section className='py-24 bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-20'>
            <h2 className='text-4xl md:text-5xl font-bold text-foreground mb-6'>
              {t('team.title')}
            </h2>
            <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
              {t('team.subtitle')}
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {team.map((member, index) => (
              <Card
                key={member.name}
                className='group relative overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-white dark:bg-slate-900 text-center hover:-translate-y-2'>
                <CardContent className='p-8'>
                  {/* Avatar with gradient */}
                  <div className='relative mb-6'>
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${member.gradient} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity`}></div>
                    <div
                      className={`relative w-24 h-24 mx-auto rounded-2xl bg-gradient-to-r ${member.gradient} flex items-center justify-center text-white text-3xl font-bold shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                      {member.initials}
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className='text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors'>
                    {member.name}
                  </h3>

                  {/* Role */}
                  <p
                    className={`text-sm font-semibold mb-4 bg-gradient-to-r ${member.gradient} bg-clip-text text-transparent`}>
                    {member.role}
                  </p>

                  {/* Bio */}
                  <p className='text-sm text-muted-foreground leading-relaxed'>
                    {member.bio}
                  </p>

                  {/* Decorative element */}
                  <div
                    className={`mt-6 h-1 w-12 mx-auto bg-gradient-to-r ${member.gradient} rounded-full`}></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values - Redesigned */}
      <section className='py-24 bg-white dark:bg-slate-950'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-20'>
            <h2 className='text-4xl md:text-5xl font-bold text-foreground mb-6'>
              {t('values.title')}
            </h2>
            <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
              {t('values.subtitle')}
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {values.map((value, index) => (
              <Card
                key={value.title}
                className='group relative overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 text-center hover:-translate-y-2'>
                {/* Gradient background on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                <CardContent className='relative p-8'>
                  {/* Icon */}
                  <div className='relative mb-6'>
                    <div
                      className={`absolute inset-0 ${value.iconColor} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity`}></div>
                    <value.icon
                      className={`relative h-14 w-14 ${value.iconColor} mx-auto`}
                    />
                  </div>

                  {/* Title */}
                  <h3 className='text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors'>
                    {value.title}
                  </h3>

                  {/* Description */}
                  <p className='text-muted-foreground leading-relaxed'>
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Redesigned */}
      <section className='relative py-32 bg-[#00690D] overflow-hidden'>
        {/* Animated background */}
        <div className='absolute inset-0'>
          <div className='absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:4rem_4rem]'></div>
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className='absolute rounded-full bg-white/5 animate-pulse'
              style={{
                width: `${40 + Math.random() * 120}px`,
                height: `${40 + Math.random() * 120}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}></div>
          ))}
        </div>

        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10'>
          <div ref={ctaRef}>
            {/* Badge */}
            <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-white mb-8 border border-white/20'>
              <Rocket className='h-5 w-5 text-yellow-300' />
              <span className='font-semibold'>
                Join Our Mission to Transform Lives
              </span>
            </div>

            <h2 className='text-5xl md:text-6xl font-bold text-white mb-8 leading-tight'>
              Be Part of
              <span className='block mt-2 bg-gradient-to-r from-white to-white bg-clip-text text-transparent'>
                Something Greater
              </span>
            </h2>

            <p className='text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed'>
              Join Tanzania's largest youth empowerment community and start your
              career journey today—completely free.
            </p>

            <div className='flex flex-col sm:flex-row gap-6 justify-center items-center'>
              <Link to='/signup'>
                <Button
                  size='lg'
                  className='group bg-white text-blue-900 hover:bg-blue-50 text-xl px-12 py-7 shadow-2xl transform hover:scale-110 transition-all duration-500 font-bold'>
                  Get Started Today
                  <ArrowRight className='ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform' />
                </Button>
              </Link>

              <Link to='/contact'>
                <Button
                  size='lg'
                  variant='outline'
                  className='border-2 border-white text-white hover:bg-white/10 text-xl px-12 py-7 transform hover:scale-105 transition-all duration-300'>
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
