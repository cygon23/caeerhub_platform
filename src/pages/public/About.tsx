import PublicLayout from "@/components/layout/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Target, Eye, Heart, Calendar, Users, Award } from "lucide-react";

export default function About() {
  const timeline = [
    {
      year: "2025",
      title: "Foundation Launch",
      description:
        "Career na Mimi was founded with a mission to empower Tanzanian youth through career guidance and skills development.",
    },
    {
      year: "2026",
      title: "First 1,000 Youth",
      description:
        "EXpected to Reached our first major milestone of supporting 10,000 young people across Tanzania.",
    },
    {
      year: "2027",
      title: "Digital Transformation",
      description:
        "Expecting to Launched our digital platform to reach youth in remote areas and scale our impact nationwide.",
    },
    {
      year: "2027",
      title: "AI-Powered Platform",
      description:
        "Expected to fully Integrated advanced AI technology to provide personalized career recommendations and smart mentorship matching.",
    },
    {
      year: "2030",
      title: "42,000+ Youth Impacted",
      description:
        "expecting our continued growth and the success stories of thousands of young Tanzanians.",
    },
  ];

  const team = [
    {
      name: "Rahman mabahe",
      role: "CEO & Founder",
      bio: "AI , innovator and comminity lead .",
      image: "👩🏿‍💼",
    },
    {
      name: "Abdulswad azihar",
      role: "CTO",
      bio: "Tech entrepreneur and AI specialist, previously at Google and Microsoft, passionate about using technology for social impact.",
      image: "👨🏿‍💻",
    },
    {
      name: "Godfrey gozberty",
      role: "Head of Programs",
      bio: "Career counselor and mentor with expertise in youth psychology and workforce development.",
      image: " 👨🏿‍💼",
    },
    {
      name: "Karen kamene",
      role: "Head of Partnerships",
      bio: "official specializing in public-private partnerships and organizational development.",
      image: "👩🏿‍🏫",
    },
  ];

  const values = [
    {
      icon: Target,
      title: "Purpose-Driven",
      description: "Everything we do is focused on empowering young Tanzanians to achieve their career dreams."
    },
    {
      icon: Heart,
      title: "Locally Rooted",
      description: "We understand the unique challenges and opportunities within the Tanzanian context."
    },
    {
      icon: Users,
      title: "Community-Centered",
      description: "We believe in the power of mentorship, collaboration, and peer-to-peer learning."
    },
    {
      icon: Award,
      title: "Excellence-Focused",
      description: "We strive for the highest quality in everything we deliver to our youth community."
    }
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              About 
              <span className="bg-gradient-hero bg-clip-text text-transparent"> Career na Mimi</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Empowering Tanzanian youth since 2017 through innovative career development, 
              mentorship, and AI-powered guidance to build successful and fulfilling careers.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="hover:shadow-primary transition-all duration-300 border-0 bg-gradient-card">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Target className="h-12 w-12 text-primary mr-4" />
                  <h2 className="text-3xl font-bold text-foreground">Our Mission</h2>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To democratize access to quality career guidance and mentorship for all Tanzanian youth, 
                  regardless of their background or location, using innovative technology and local expertise 
                  to unlock their full potential and create pathways to economic prosperity.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-secondary transition-all duration-300 border-0 bg-gradient-card">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Eye className="h-12 w-12 text-secondary mr-4" />
                  <h2 className="text-3xl font-bold text-foreground">Our Vision</h2>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  A Tanzania where every young person has the knowledge, skills, and support network 
                  needed to pursue meaningful careers that contribute to both personal fulfillment 
                  and national development, creating a generation of empowered leaders and innovators.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Journey</h2>
            <p className="text-xl text-muted-foreground">
              From a small initiative to a nationwide movement empowering youth across Tanzania
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-hero"></div>
            
            <div className="space-y-12">
              {timeline.map((milestone, index) => (
                <div 
                  key={milestone.year}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'justify-start' : 'justify-end'
                  } animate-slide-up`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <Card className="hover:shadow-elegant transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-2">
                          <Calendar className="h-5 w-5 text-primary mr-2" />
                          <span className="text-primary font-bold text-lg">{milestone.year}</span>
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-3">{milestone.title}</h3>
                        <p className="text-muted-foreground">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background z-10"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground">
              Passionate leaders dedicated to empowering the next generation of Tanzanian professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card 
                key={member.name}
                className="hover:shadow-primary transition-all duration-300 animate-bounce-in border-0 bg-gradient-card text-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="text-6xl mb-4">{member.image}</div>
                  <h3 className="text-xl font-semibold text-foreground mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gradient-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card 
                key={value.title}
                className="hover:shadow-secondary transition-all duration-300 animate-fade-in text-center border-0 bg-background/50 backdrop-blur-sm"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <CardContent className="p-6">
                  <value.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-bounce-in">
            <h2 className="text-4xl font-bold text-white mb-6">
              Join Our Mission
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Be part of Tanzania's largest youth empowerment community and start your career journey today.
            </p>
            <Link to="/signup">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 text-lg px-12 py-4 shadow-elegant"
              >
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}