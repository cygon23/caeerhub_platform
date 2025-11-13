import PublicLayout from "@/components/layout/PublicLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  Building,
  Users,
  HeadphonesIcon,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Contact() {
  const { t } = useTranslation('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the form data to your backend
    alert(t('form.subtitle'));
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: t('contactInfo.office.title'),
      details: [t('contactInfo.office.location1'), t('contactInfo.office.location2')],
      color: "bg-[#FE047F]"
    },
    {
      icon: Phone,
      title: t('contactInfo.phone.title'),
      details: [
        t('contactInfo.phone.number1'),
        t('contactInfo.phone.number2'),
        t('contactInfo.phone.hours'),
      ],
      color: "bg-[#00690D]"
    },
    {
      icon: Mail,
      title: t('contactInfo.email.title'),
      details: [
        t('contactInfo.email.info'),
        t('contactInfo.email.support'),
      ],
      color: "bg-[#FE047F]"
    },
    {
      icon: Clock,
      title: t('contactInfo.businessHours.title'),
      details: [
        t('contactInfo.businessHours.weekdays'),
        t('contactInfo.businessHours.saturday'),
        t('contactInfo.businessHours.sunday'),
      ],
      color: "bg-[#00690D]"
    },
  ];

  const inquiryTypes = [
    {
      icon: Users,
      title: t('specialized.youth.title'),
      description: t('specialized.youth.description'),
      email: t('specialized.youth.email'),
      color: "bg-[#FE047F]"
    },
    {
      icon: Building,
      title: t('specialized.organizations.title'),
      description: t('specialized.organizations.description'),
      email: t('specialized.organizations.email'),
      color: "bg-[#00690D]"
    },
    {
      icon: HeadphonesIcon,
      title: t('specialized.technical.title'),
      description: t('specialized.technical.description'),
      email: t('specialized.technical.email'),
      color: "bg-[#FE047F]"
    },
  ];

  return (
    <PublicLayout>
      {/* Hero Section - Consistent Style */}
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
          <div className="animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="h-8 w-8 text-[#FE047F] mr-3 animate-pulse-scale" />
              <h1 className="text-4xl md:text-6xl font-bold text-foreground">
                {t('hero.title')}{" "}
                <span className="text-[#FE047F]">{t('hero.titleHighlight')}</span>
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information - Circular Badges */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div
                key={info.title}
                className="flex flex-col items-center text-center group"
              >
                {/* Circular Badge */}
                <div className="relative mb-6">
                  {/* Outer glow ring */}
                  <div className={`absolute inset-0 rounded-full ${info.color} opacity-20 blur-xl group-hover:opacity-40 transition-opacity animate-pulse-scale`}></div>

                  {/* Main circular badge */}
                  <div className={`relative w-20 h-20 rounded-full ${info.color} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                    <info.icon className="h-9 w-9 text-white" />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {info.title}
                </h3>
                <div className="space-y-1">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-muted-foreground text-sm leading-relaxed">
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="animate-fade-in">
              <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
                <CardHeader className="border-b border-slate-200 dark:border-slate-800">
                  <CardTitle className="text-2xl text-foreground flex items-center gap-2">
                    <MessageCircle className="h-6 w-6 text-[#FE047F]" />
                    {t('form.title')}
                  </CardTitle>
                  <p className="text-muted-foreground mt-2">
                    {t('form.subtitle')}
                  </p>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-foreground font-medium">
                          {t('form.fields.name')} {t('form.required')}
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder={t('form.fields.namePlaceholder')}
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-foreground font-medium">
                          {t('form.fields.email')} {t('form.required')}
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder={t('form.fields.emailPlaceholder')}
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          required
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="type" className="text-foreground font-medium">
                        {t('form.fields.type')}
                      </Label>
                      <select
                        id="type"
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value })
                        }
                        className="w-full mt-2 px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-md bg-white dark:bg-slate-900 text-foreground focus:outline-none focus:ring-2 focus:ring-[#FE047F]">
                        <option value="general">{t('form.types.general')}</option>
                        <option value="youth">{t('form.types.youth')}</option>
                        <option value="partnership">{t('form.types.partnership')}</option>
                        <option value="support">{t('form.types.support')}</option>
                        <option value="media">{t('form.types.media')}</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-foreground font-medium">
                        {t('form.fields.subject')} {t('form.required')}
                      </Label>
                      <Input
                        id="subject"
                        type="text"
                        placeholder={t('form.fields.subjectPlaceholder')}
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        required
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-foreground font-medium">
                        {t('form.fields.message')} {t('form.required')}
                      </Label>
                      <Textarea
                        id="message"
                        placeholder={t('form.fields.messagePlaceholder')}
                        rows={6}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        required
                        className="mt-2"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#FE047F] hover:bg-[#FE047F]/90 text-white shadow-xl shadow-[#FE047F]/20"
                      size="lg">
                      <Send className="mr-2 h-5 w-5" />
                      {t('form.button')}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Map & Quick Contact */}
            <div className="space-y-6 animate-fade-in">
              {/* Map Card */}
              <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-[#FE047F] to-[#FE047F]/80 p-12 text-center text-white relative overflow-hidden">
                    <div className="relative z-10">
                      <MapPin className="h-16 w-16 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold mb-3">
                        {t('map.title')}
                      </h3>
                      <p className="text-white/90 text-lg mb-6">
                        {t('map.location')}
                        <br />
                        {t('map.city')}
                      </p>
                      <Button
                        variant="outline"
                        className="border-2 border-white text-white hover:bg-white hover:text-[#FE047F] transition-all duration-300">
                        {t('map.button')}
                      </Button>
                    </div>
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Contact Options */}
              <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
                <CardHeader className="border-b border-slate-200 dark:border-slate-800">
                  <CardTitle className="text-xl text-foreground">
                    {t('quickContact.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:shadow-md transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-full bg-[#FE047F] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{t('quickContact.call.title')}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('quickContact.call.number')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:shadow-md transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-full bg-[#00690D] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {t('quickContact.email.title')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t('quickContact.email.address')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:shadow-md transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-full bg-[#FE047F] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{t('quickContact.whatsapp.title')}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('quickContact.whatsapp.number')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Specialized Support - Improved Design */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              {t('specialized.title')}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t('specialized.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {inquiryTypes.map((type, index) => (
              <Card
                key={type.title}
                className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-xl transition-all duration-300 group"
              >
                <CardContent className="p-8 text-center">
                  <div className="relative mb-6 inline-block">
                    {/* Outer glow ring */}
                    <div className={`absolute inset-0 rounded-full ${type.color} opacity-20 blur-xl group-hover:opacity-40 transition-opacity`}></div>

                    {/* Main circular badge */}
                    <div className={`relative w-16 h-16 rounded-full ${type.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <type.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {type.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                    {type.description}
                  </p>
                  <div className="bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-lg">
                    <p className="text-[#FE047F] font-semibold text-sm">
                      {type.email}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
