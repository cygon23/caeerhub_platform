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
  HeadphonesIcon
} from "lucide-react";
import { useState } from "react";
import { useGSAP, useGSAPScale, useGSAPStagger, useGSAPTextReveal, useGSAPMagnetic } from "@/hooks/useGSAP";

export default function Contact() {
  const heroRef = useGSAPTextReveal();
  const contactInfoRef = useGSAPStagger(0.1);
  const formRef = useGSAPScale();
  const specializedRef = useGSAPStagger(0.15);

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
    },

    {
      icon: Phone,
      title: "Phone Numbers",
      details: [
        "+255 628 055 646",
        "+255 673 045 414",
        "Available 8 AM - 6 PM EAT",
      ],
    },
    {
      icon: Mail,
      title: "Email Addresses",
      details: [
        "info@careernamimi.org",
        "support@careernamimi.org",
      ],
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: [
        "Monday - Friday: 8:00 AM - 6:00 PM",
        "Saturday: 9:00 AM - 2:00 PM",
        "Sunday: Closed",
      ],
    },
  ];

  const inquiryTypes = [
    {
      icon: Users,
      title: "For Youth & Students",
      description:
        "Questions about our career development programs, assessments, and mentorship opportunities.",
      email: "info@careernamimi.org",
    },
    {
      icon: Building,
      title: "For Organizations",
      description:
        "Partnership inquiries, corporate programs, and bulk assessment services.",
      email: "info@careernamimi.org",
    },
    {
      icon: HeadphonesIcon,
      title: "Technical Support",
      description:
        "Platform issues, account problems, and technical assistance.",
      email: "support@careernamimi.org",
    },
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className='py-20 bg-gradient-card'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <div className='animate-fade-in'>
            <div className='flex items-center justify-center mb-6'>
              <MessageCircle className='h-8 w-8 text-primary mr-3' />
              <h1 className='text-4xl md:text-6xl font-bold text-foreground'>
                Contact
                <span className='bg-gradient-hero bg-clip-text text-transparent'>
                  {" "}
                  Us
                </span>
              </h1>
            </div>
            <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
              Have questions about our platform? Want to explore partnership
              opportunities? We're here to help and would love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className='py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16'>
            {contactInfo.map((info, index) => (
              <Card
                key={info.title}
                className='text-center hover:shadow-primary transition-all duration-300 animate-bounce-in border-0 bg-gradient-card'
                style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className='p-6'>
                  <div className='p-3 bg-primary/10 rounded-lg w-fit mx-auto mb-4'>
                    <info.icon className='h-8 w-8 text-primary' />
                  </div>
                  <h3 className='text-lg font-semibold text-foreground mb-3'>
                    {info.title}
                  </h3>
                  <div className='space-y-1'>
                    {info.details.map((detail, idx) => (
                      <p key={idx} className='text-muted-foreground text-sm'>
                        {detail}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className='py-20 bg-muted/30'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
            {/* Contact Form */}
            <div className='animate-slide-up'>
              <Card className='border-0 bg-background/50 backdrop-blur-sm shadow-elegant'>
                <CardHeader>
                  <CardTitle className='text-2xl text-foreground'>
                    Send us a Message
                  </CardTitle>
                  <p className='text-muted-foreground'>
                    Fill out the form below and we'll get back to you within 24
                    hours.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <Label htmlFor='name'>Full Name *</Label>
                        <Input
                          id='name'
                          type='text'
                          placeholder='Your full name'
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                          className='mt-1'
                        />
                      </div>
                      <div>
                        <Label htmlFor='email'>Email Address *</Label>
                        <Input
                          id='email'
                          type='email'
                          placeholder='your.email@example.com'
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          required
                          className='mt-1'
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor='type'>Inquiry Type</Label>
                      <select
                        id='type'
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value })
                        }
                        className='w-full mt-1 px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary'>
                        <option value='general'>General Inquiry</option>
                        <option value='youth'>Youth Programs</option>
                        <option value='partnership'>Partnership</option>
                        <option value='support'>Technical Support</option>
                        <option value='media'>Media & Press</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor='subject'>Subject *</Label>
                      <Input
                        id='subject'
                        type='text'
                        placeholder='Brief description of your inquiry'
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        required
                        className='mt-1'
                      />
                    </div>

                    <div>
                      <Label htmlFor='message'>Message *</Label>
                      <Textarea
                        id='message'
                        placeholder='Please provide details about your inquiry...'
                        rows={6}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        required
                        className='mt-1'
                      />
                    </div>

                    <Button
                      type='submit'
                      className='w-full bg-gradient-hero text-white shadow-primary'
                      size='lg'>
                      <Send className='mr-2 h-5 w-5' />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Map & Quick Contact */}
            <div className='space-y-8 animate-fade-in'>
              {/* Map Placeholder */}
              <Card className='border-0 bg-background/50 backdrop-blur-sm shadow-elegant'>
                <CardContent className='p-0'>
                  <div className='bg-gradient-hero rounded-lg p-8 text-center text-white relative overflow-hidden'>
                    <div className='relative z-10'>
                      <MapPin className='h-12 w-12 mx-auto mb-4' />
                      <h3 className='text-xl font-semibold mb-2'>
                        Visit Our Office
                      </h3>
                      <p className='text-white/90'>
                        Njiro, Tanesco
                        <br />
                        Arusha, Tanzania
                      </p>
                      <Button
                        variant='outline'
                        className='mt-4 border-white text-white hover:bg-white/10'>
                        Get Directions
                      </Button>
                    </div>
                    <div className='absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20'></div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Contact Options */}
              <Card className='border-0 bg-background/50 backdrop-blur-sm shadow-elegant'>
                <CardHeader>
                  <CardTitle className='text-xl text-foreground'>
                    Quick Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex items-center p-3 bg-gradient-accent rounded-lg'>
                    <Phone className='h-5 w-5 text-primary mr-3' />
                    <div>
                      <p className='font-medium text-foreground'>Call Us Now</p>
                      <p className='text-sm text-muted-foreground'>
                        +255 628 055 646/673 045 414
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center p-3 bg-gradient-accent rounded-lg'>
                    <Mail className='h-5 w-5 text-primary mr-3' />
                    <div>
                      <p className='font-medium text-foreground'>
                        Email Support
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        info@careernamimi.org
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center p-3 bg-gradient-accent rounded-lg'>
                    <MessageCircle className='h-5 w-5 text-primary mr-3' />
                    <div>
                      <p className='font-medium text-foreground'>WhatsApp</p>
                      <p className='text-sm text-muted-foreground'>
                        +255 628 055 646/673 045 414
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Specialized Contact */}
      <section className='py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold text-foreground mb-4'>
              Specialized Support
            </h2>
            <p className='text-xl text-muted-foreground'>
              Get the right help for your specific needs
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {inquiryTypes.map((type, index) => (
              <Card
                key={type.title}
                className='hover:shadow-secondary transition-all duration-300 animate-slide-up border-0 bg-gradient-card'
                style={{ animationDelay: `${index * 0.15}s` }}>
                <CardContent className='p-6 text-center'>
                  <div className='p-3 bg-secondary/10 rounded-lg w-fit mx-auto mb-4'>
                    <type.icon className='h-8 w-8 text-secondary' />
                  </div>
                  <h3 className='text-xl font-semibold text-foreground mb-3'>
                    {type.title}
                  </h3>
                  <p className='text-muted-foreground text-sm mb-4'>
                    {type.description}
                  </p>
                  <div className='bg-background/50 p-3 rounded-lg'>
                    <p className='text-primary font-medium text-sm'>
                      {type.email}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className='py-20 bg-gradient-card'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-4xl font-bold text-foreground mb-8'>
            Frequently Asked Questions
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 text-left'>
            <div className='bg-background/50 backdrop-blur-sm p-6 rounded-lg'>
              <h3 className='font-semibold text-foreground mb-2'>
                How quickly will I hear back?
              </h3>
              <p className='text-muted-foreground text-sm'>
                We respond to all inquiries within 24 hours during business
                days. Urgent technical issues are handled within 4 hours.
              </p>
            </div>

            <div className='bg-background/50 backdrop-blur-sm p-6 rounded-lg'>
              <h3 className='font-semibold text-foreground mb-2'>
                Do you offer in-person meetings?
              </h3>
              <p className='text-muted-foreground text-sm'>
                Yes! We welcome visitors to our Dar es Salaam office. Please
                schedule in advance to ensure availability.
              </p>
            </div>

            <div className='bg-background/50 backdrop-blur-sm p-6 rounded-lg'>
              <h3 className='font-semibold text-foreground mb-2'>
                Can I get a demo of the platform?
              </h3>
              <p className='text-muted-foreground text-sm'>
                Absolutely! We offer personalized demos for organizations and
                detailed walkthroughs for individual users.
              </p>
            </div>

            <div className='bg-background/50 backdrop-blur-sm p-6 rounded-lg'>
              <h3 className='font-semibold text-foreground mb-2'>
                What languages do you support?
              </h3>
              <p className='text-muted-foreground text-sm'>
                Our platform and support are available in both English and
                Swahili to serve all Tanzanian users effectively.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}