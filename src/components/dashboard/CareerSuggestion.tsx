import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Lightbulb, TrendingUp, DollarSign, MapPin, Clock, Star, Users, Briefcase } from "lucide-react";

export const CareerSuggestion = () => {
  const personalizedSuggestions = [
    {
      title: "Software Developer",
      match: 95,
      salaryRange: "$70,000 - $120,000",
      growth: "+22%",
      location: "Remote/Urban areas",
      description: "Design and develop software applications using programming languages",
      skills: ["JavaScript", "Python", "Problem Solving", "Teamwork"],
      education: "Bachelor's in Computer Science or related field",
      experience: "Entry to Mid-level",
      demand: "Very High"
    },
    {
      title: "Data Scientist",
      match: 88,
      salaryRange: "$80,000 - $140,000",
      growth: "+31%",
      location: "Major cities, Remote",
      description: "Analyze complex data to help organizations make informed decisions",
      skills: ["Python", "Statistics", "Machine Learning", "Communication"],
      education: "Bachelor's/Master's in Data Science, Statistics, or related",
      experience: "Entry to Senior",
      demand: "Very High"
    },
    {
      title: "UX/UI Designer",
      match: 82,
      salaryRange: "$60,000 - $110,000",
      growth: "+13%",
      location: "Urban areas, Remote",
      description: "Create user-friendly interfaces and improve user experiences",
      skills: ["Design Thinking", "Figma", "User Research", "Creativity"],
      education: "Bachelor's in Design, Psychology, or related field",
      experience: "Entry to Senior",
      demand: "High"
    },
    {
      title: "Digital Marketing Specialist",
      match: 78,
      salaryRange: "$45,000 - $85,000",
      growth: "+19%",
      location: "Everywhere, Remote friendly",
      description: "Develop and execute digital marketing campaigns across platforms",
      skills: ["SEO", "Social Media", "Analytics", "Content Creation"],
      education: "Bachelor's in Marketing, Communications, or related",
      experience: "Entry to Mid-level",
      demand: "High"
    },
  ];

  const industryTrends = [
    { industry: "Technology", growth: "+15%", hotJobs: "AI/ML Engineer, Cloud Architect" },
    { industry: "Healthcare", growth: "+12%", hotJobs: "Telehealth Coordinator, Health Data Analyst" },
    { industry: "Renewable Energy", growth: "+25%", hotJobs: "Solar Engineer, Sustainability Consultant" },
    { industry: "E-commerce", growth: "+18%", hotJobs: "E-commerce Manager, Digital Product Manager" },
  ];

  const skillRecommendations = [
    { skill: "Artificial Intelligence", demand: 95, timeToLearn: "6-12 months" },
    { skill: "Cloud Computing", demand: 90, timeToLearn: "3-6 months" },
    { skill: "Data Analysis", demand: 85, timeToLearn: "4-8 months" },
    { skill: "Digital Marketing", demand: 80, timeToLearn: "2-4 months" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Lightbulb className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-3xl font-bold">Career Suggestions</h2>
          <p className="text-muted-foreground">Personalized career recommendations based on your profile</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Top Career Matches
            </CardTitle>
            <CardDescription>
              Careers that align with your skills, interests, and goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 lg:grid-cols-2">
              {personalizedSuggestions.map((career, index) => (
                <div key={index} className="p-6 rounded-lg border space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold">{career.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{career.description}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="text-sm">
                        {career.match}% Match
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-sm font-medium">Career Match Score</span>
                    <Progress value={career.match} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">Salary Range</p>
                        <p className="text-muted-foreground">{career.salaryRange}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="font-medium">Job Growth</p>
                        <p className="text-green-600">{career.growth}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-muted-foreground">{career.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">Demand</p>
                        <p className="text-muted-foreground">{career.demand}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Required Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {career.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Education: </span>
                      <span className="text-muted-foreground">{career.education}</span>
                    </div>
                    <div>
                      <span className="font-medium">Experience Level: </span>
                      <span className="text-muted-foreground">{career.experience}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <Briefcase className="h-4 w-4 mr-1" />
                      Explore Path
                    </Button>
                    <Button size="sm" variant="outline">
                      Save Career
                    </Button>
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
                <TrendingUp className="h-5 w-5" />
                Industry Trends
              </CardTitle>
              <CardDescription>
                Growing industries with promising opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {industryTrends.map((trend, index) => (
                <div key={index} className="p-4 rounded-lg border space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">{trend.industry}</h4>
                    <Badge variant="default" className="text-xs">
                      {trend.growth} growth
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Hot Jobs: {trend.hotJobs}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Skills to Develop
              </CardTitle>
              <CardDescription>
                High-demand skills that boost your career prospects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {skillRecommendations.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{skill.skill}</span>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{skill.timeToLearn}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Market Demand</span>
                      <span>{skill.demand}%</span>
                    </div>
                    <Progress value={skill.demand} className="h-2" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};