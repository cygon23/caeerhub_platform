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

export default function Contact() {
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
    alert('Thank you for your message! We will get back to you within 24 hours.');
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Our Office",
      details: ["Njiro", "Arusha, Tanzania"],
      color: "bg-[#FE047F]"
    },
    {
      icon: Phone,
      title: "Phone Numbers",
      details: [
        "+255 628 055 646",
        "+255 673 045 414",
        "Available 8 AM - 6 PM EAT",
      ],
      color: "bg-[#00690D]"
    },
    {
      icon: Mail,
      title: "Email Addresses",
      details: [
        "info@careernamimi.org",
        "support@careernamimi.org",
      ],
      color: "bg-[#FE047F]"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: [
        "Monday - Friday: 8:00 AM - 6:00 PM",
        "Saturday: 9:00 AM - 2:00 PM",
        "Sunday: Closed",
      ],
      color: "bg-[#00690D]"
    },
  ];

  const inquiryTypes = [
    {
      icon: Users,
      title: "For Youth & Students",
      description:
        "Questions about our career development programs, assessments, and mentorship opportunities.",
      email: "info@careernamimi.org",
      color: "bg-[#FE047F]"
    },
    {
      icon: Building,
      title: "For Organizations",
      description:
        "Partnership inquiries, corporate programs, and bulk assessment services.",
      email: "info@careernamimi.org",
      color: "bg-[#00690D]"
    },
    {
      icon: HeadphonesIcon,
      title: "Technical Support",
      description:
        "Platform issues, account problems, and technical assistance.",
      email: "support@careernamimi.org",
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
                Get in{" "}
                <span className="text-[#FE047F]">Touch</span>
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Have questions about our platform? Want to explore partnership opportunities?
              We're here to help and would love to hear from you.
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
                    Send us a Message
                  </CardTitle>
                  <p className="text-muted-foreground mt-2">
                    Fill out the form below and we'll get back to you within 24 hours.
                  </p>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-foreground font-medium">Full Name *</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-foreground font-medium">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
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
                      <Label htmlFor="type" className="text-foreground font-medium">Inquiry Type</Label>
                      <select
                        id="type"
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value })
                        }
                        className="w-full mt-2 px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-md bg-white dark:bg-slate-900 text-foreground focus:outline-none focus:ring-2 focus:ring-[#FE047F]">
                        <option value="general">General Inquiry</option>
                        <option value="youth">Youth Programs</option>
                        <option value="partnership">Partnership</option>
                        <option value="support">Technical Support</option>
                        <option value="media">Media & Press</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-foreground font-medium">Subject *</Label>
                      <Input
                        id="subject"
                        type="text"
                        placeholder="Brief description of your inquiry"
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        required
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-foreground font-medium">Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Please provide details about your inquiry..."
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
                      Send Message
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
                        Visit Our Office
                      </h3>
                      <p className="text-white/90 text-lg mb-6">
                        Njiro
                        <br />
                        Arusha, Tanzania
                      </p>
                      <Button
                        variant="outline"
                        className="border-2 border-white text-white hover:bg-white hover:text-[#FE047F] transition-all duration-300">
                        Get Directions
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
                    Quick Contact Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:shadow-md transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-full bg-[#FE047F] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Call Us Now</p>
                      <p className="text-sm text-muted-foreground">
                        +255 628 055 646 / 673 045 414
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:shadow-md transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-full bg-[#00690D] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        Email Support
                      </p>
                      <p className="text-sm text-muted-foreground">
                        info@careernamimi.org
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:shadow-md transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-full bg-[#FE047F] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">WhatsApp</p>
                      <p className="text-sm text-muted-foreground">
                        +255 628 055 646 / 673 045 414
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
              Specialized Support
            </h2>
            <p className="text-xl text-muted-foreground">
              Get the right help for your specific needs
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
