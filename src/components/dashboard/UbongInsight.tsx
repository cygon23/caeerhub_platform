import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Eye, TrendingUp, Users, MapPin, Briefcase, Calendar, Star, AlertCircle } from "lucide-react";

export const UbongInsight = () => {
  const localMarketData = [
    {
      sector: "Technology",
      growth: "+18%",
      openings: 145,
      avgSalary: "₦2.5M - ₦8M",
      demand: "Very High",
      skills: ["Software Development", "Data Analysis", "Digital Marketing"]
    },
    {
      sector: "Healthcare",
      growth: "+12%",
      openings: 89,
      avgSalary: "₦1.8M - ₦6M",
      demand: "High",
      skills: ["Nursing", "Medical Technology", "Health Information Management"]
    },
    {
      sector: "Agriculture & Agritech",
      growth: "+25%",
      openings: 67,
      avgSalary: "₦1.2M - ₦4.5M",
      demand: "High",
      skills: ["Smart Farming", "Agricultural Engineering", "Supply Chain"]
    },
    {
      sector: "Financial Services",
      growth: "+15%",
      openings: 112,
      avgSalary: "₦2M - ₦7M",
      demand: "High",
      skills: ["Fintech", "Risk Management", "Financial Analysis"]
    },
  ];

  const governmentInitiatives = [
    {
      program: "Youth Digital Skills Program",
      status: "Active",
      deadline: "2024-06-30",
      benefits: "Free tech training + certification",
      participants: 2500
    },
    {
      program: "Akwa Ibom Startup Incubator",
      status: "Open for Applications",
      deadline: "2024-04-15",
      benefits: "₦5M funding + mentorship",
      participants: 150
    },
    {
      program: "Agricultural Youth Empowerment",
      status: "Active",
      deadline: "2024-05-20",
      benefits: "Land allocation + equipment",
      participants: 800
    },
  ];

  const localSuccess = [
    {
      name: "Ada Udoh",
      field: "Tech Entrepreneur",
      achievement: "Founded successful e-commerce platform",
      company: "ShopAkwa",
      impact: "500+ local businesses onboarded"
    },
    {
      name: "Emmanuel Bassey",
      field: "Agricultural Innovation",
      achievement: "Developed smart farming solution",
      company: "FarmTech Akwa",
      impact: "30% increase in crop yields for 200+ farmers"
    },
    {
      name: "Grace Etuk",
      field: "Healthcare Tech",
      achievement: "Created telemedicine app",
      company: "HealthConnect AKS",
      impact: "Connected 50+ rural clinics"
    },
  ];

  const emergingOpportunities = [
    {
      opportunity: "Smart City Development",
      description: "Uyo smart city initiative creating tech opportunities",
      timeframe: "6-24 months",
      skillsNeeded: ["IoT", "Data Analytics", "Urban Planning"],
      potential: "High"
    },
    {
      opportunity: "Tourism Digitalization",
      description: "Digital transformation of tourism sector",
      timeframe: "3-12 months",
      skillsNeeded: ["Digital Marketing", "App Development", "Content Creation"],
      potential: "Medium"
    },
    {
      opportunity: "Green Energy Projects",
      description: "Renewable energy initiatives across the state",
      timeframe: "12-36 months",
      skillsNeeded: ["Solar Engineering", "Project Management", "Environmental Science"],
      potential: "Very High"
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Eye className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-3xl font-bold">Ubong Insights</h2>
          <p className="text-muted-foreground">Local career intelligence for Akwa Ibom State</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Akwa Ibom Job Market Overview
            </CardTitle>
            <CardDescription>
              Current employment landscape and growth sectors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {localMarketData.map((sector, index) => (
                <div key={index} className="p-4 rounded-lg border space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">{sector.sector}</h3>
                    <Badge 
                      variant={sector.demand === "Very High" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {sector.demand}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Growth Rate</p>
                      <p className="font-medium text-green-600">{sector.growth}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Open Positions</p>
                      <p className="font-medium">{sector.openings}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Salary Range</p>
                      <p className="font-medium">{sector.avgSalary}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">In-Demand Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {sector.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Government Initiatives
              </CardTitle>
              <CardDescription>
                Youth empowerment programs and opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {governmentInitiatives.map((initiative, index) => (
                <div key={index} className="p-4 rounded-lg border space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-sm">{initiative.program}</h4>
                    <Badge 
                      variant={initiative.status === "Active" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {initiative.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Deadline: {new Date(initiative.deadline).toLocaleDateString()}</span>
                    </div>
                    <p><strong>Benefits:</strong> {initiative.benefits}</p>
                    <p><strong>Participants:</strong> {initiative.participants} youth enrolled</p>
                  </div>

                  <Button size="sm" variant="outline" className="w-full text-xs">
                    Learn More
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Local Success Stories
              </CardTitle>
              <CardDescription>
                Young professionals making impact in Akwa Ibom
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {localSuccess.map((story, index) => (
                <div key={index} className="p-4 rounded-lg border space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-sm">{story.name}</h4>
                      <p className="text-xs text-muted-foreground">{story.field}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">{story.company}</Badge>
                  </div>
                  
                  <p className="text-xs">{story.achievement}</p>
                  <p className="text-xs text-primary font-medium">
                    Impact: {story.impact}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Emerging Opportunities
            </CardTitle>
            <CardDescription>
              Future career prospects and market trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 lg:grid-cols-3">
              {emergingOpportunities.map((opp, index) => (
                <div key={index} className="p-4 rounded-lg border space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold">{opp.opportunity}</h4>
                    <Badge 
                      variant={opp.potential === "Very High" ? "default" : 
                              opp.potential === "High" ? "secondary" : "outline"}
                      className="text-xs"
                    >
                      {opp.potential}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{opp.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-xs">
                      <Calendar className="h-3 w-3" />
                      <span>Timeline: {opp.timeframe}</span>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Skills Needed:</p>
                      <div className="flex flex-wrap gap-1">
                        {opp.skillsNeeded.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button size="sm" variant="outline" className="w-full text-xs">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Get Notified
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};