import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Languages, Users, TrendingUp, CheckCircle, Globe } from "lucide-react";
import assessmentEN from "@/data/holland_riasec_assessment_en.json";
import assessmentSW from "@/data/holland_riasec_assessment_sw.json";

interface HollandAssessmentManagementProps {
  schoolInfo?: {
    primary_color?: string;
    secondary_color?: string;
  };
}

export default function HollandAssessmentManagement({ schoolInfo }: HollandAssessmentManagementProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "sw">("en");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const assessment = selectedLanguage === "en" ? assessmentEN : assessmentSW;
  const categories = Object.keys(assessment);

  const primaryColor = schoolInfo?.primary_color || '#FE047F';
  const secondaryColor = schoolInfo?.secondary_color || '#006807';

  const categoryColors: Record<string, string> = {
    Realistic: "bg-blue-500",
    Investigative: "bg-purple-500",
    Artistic: "bg-pink-500",
    Social: "bg-green-500",
    Enterprising: "bg-orange-500",
    Conventional: "bg-teal-500",
  };

  const categoryDescriptions: Record<string, string> = {
    Realistic: "Hands-on, practical work with tools, machines, and physical activities",
    Investigative: "Research, analysis, and solving complex problems",
    Artistic: "Creative expression through art, music, writing, and design",
    Social: "Helping, teaching, and working with people",
    Enterprising: "Leading, persuading, and managing business activities",
    Conventional: "Organizing, data management, and following procedures",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="text-white rounded-lg p-6 md:p-8 shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
        }}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Holland RIASEC Assessment</h2>
            <p className="text-white/90">Career interest assessment based on Holland's theory</p>
          </div>
          <BookOpen className="h-12 w-12 opacity-50" />
        </div>
      </div>

      {/* Language Toggle */}
      <Card className="shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Languages className="h-5 w-5" style={{ color: primaryColor }} />
              <div>
                <h3 className="font-semibold">Assessment Language</h3>
                <p className="text-sm text-muted-foreground">Select the language for the assessment</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedLanguage === "en" ? "default" : "outline"}
                onClick={() => setSelectedLanguage("en")}
                className="gap-2"
                style={
                  selectedLanguage === "en"
                    ? {
                        background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                        color: 'white'
                      }
                    : {
                        borderColor: primaryColor,
                        color: primaryColor
                      }
                }
              >
                <Globe className="h-4 w-4" />
                English
              </Button>
              <Button
                variant={selectedLanguage === "sw" ? "default" : "outline"}
                onClick={() => setSelectedLanguage("sw")}
                className="gap-2"
                style={
                  selectedLanguage === "sw"
                    ? {
                        background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                        color: 'white'
                      }
                    : {
                        borderColor: primaryColor,
                        color: primaryColor
                      }
                }
              >
                <Globe className="h-4 w-4" />
                Kiswahili
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 md:p-6 text-center">
            <div className="text-2xl md:text-3xl font-bold" style={{ color: primaryColor }}>
              {categories.length}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">Categories</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 md:p-6 text-center">
            <div className="text-2xl md:text-3xl font-bold" style={{ color: secondaryColor }}>
              {Object.values(assessment).reduce((acc: number, cat: any) => acc + cat.length, 0)}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">Total Questions</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 md:p-6 text-center">
            <div className="text-2xl md:text-3xl font-bold" style={{ color: primaryColor }}>
              0
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">Students Assessed</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 md:p-6 text-center">
            <div className="text-2xl md:text-3xl font-bold" style={{ color: secondaryColor }}>
              2
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">Languages</div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Overview */}
      <Card>
        <CardHeader>
          <CardTitle>RIASEC Categories</CardTitle>
          <CardDescription>Explore the six personality types in the Holland assessment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => {
              const questions = assessment[category as keyof typeof assessment];
              const color = categoryColors[category];
              
              return (
                <Card
                  key={category}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedCategory(category)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`${color} h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold text-xl`}>
                        {category[0]}
                      </div>
                      <Badge variant="secondary">{questions.length} questions</Badge>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{category}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {categoryDescriptions[category]}
                    </p>
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-muted-foreground mb-2">
                        <span>Question Distribution</span>
                        <span>{Math.round((questions.length / 20) * 100)}%</span>
                      </div>
                      <Progress value={(questions.length / 20) * 100} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Category Details */}
      {selectedCategory && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-3">
                  <div className={`${categoryColors[selectedCategory]} h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold`}>
                    {selectedCategory[0]}
                  </div>
                  {selectedCategory}
                </CardTitle>
                <CardDescription>{categoryDescriptions[selectedCategory]}</CardDescription>
              </div>
              <Button variant="outline" onClick={() => setSelectedCategory(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assessment[selectedCategory as keyof typeof assessment].map((q: any, index: number) => (
                <div
                  key={q.id}
                  className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{q.question}</p>
                    <p className="text-xs text-muted-foreground mt-1">Question ID: {q.id}</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assessment Info */}
      <Card>
        <CardHeader>
          <CardTitle>About Holland RIASEC Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The Holland Codes or the Holland Occupational Themes (RIASEC) is a theory of careers and vocational choice
            based upon personality types. It was developed by psychologist John L. Holland.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                How it works
              </h4>
              <p className="text-sm text-muted-foreground">
                Students rate their interest in various activities across six personality types, helping identify
                suitable career paths aligned with their preferences.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Benefits
              </h4>
              <p className="text-sm text-muted-foreground">
                Provides insights into personality traits, work preferences, and potential career matches, enabling
                better educational and career planning decisions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
