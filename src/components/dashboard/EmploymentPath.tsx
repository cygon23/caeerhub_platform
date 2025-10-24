import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { employmentPathService } from "@/services/useEmploymentPath";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CareerSkills } from "./CareerSkills";

export const EmploymentPath: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("roadmap");
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load roadmap data
  const loadEmploymentData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const onboardingData = await employmentPathService.getOnboardingData(
        user.id
      );
      if (onboardingData) {
        const roadmapData = await employmentPathService.generateRoadmap(
          onboardingData.dream_career,
          onboardingData.skills
        );
        setRoadmap(roadmapData);
      }
    } catch (error) {
      console.error("Error loading employment data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmploymentData();
  }, [user]);

  // -------------------
  //  Render Roadmap Tab
  // -------------------
  const renderRoadmap = () => (
    <div className='space-y-6'>
      {loading ? (
        <p>Loading your career roadmap...</p>
      ) : roadmap ? (
        roadmap.steps.map((step: any, i: number) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>{step.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground mb-3'>
                {step.description}
              </p>
              <Progress value={step.progress || 0} className='h-2' />
              <div className='flex flex-wrap gap-2 mt-3'>
                {Array.isArray(step.tags) &&
                  step.tags.map((tag: any, j: number) => (
                    <Badge key={j} variant='secondary'>
                      {typeof tag === "string" ? tag : tag.name || String(tag)}
                    </Badge>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p>No roadmap data available yet.</p>
      )}
    </div>
  );

  // -------------------
  //  Render Jobs Tab
  // -------------------
  const renderJobs = () => (
    <div className='flex flex-col items-center justify-center min-h-[300px]'>
      <h2 className='text-lg font-semibold mb-2'>Coming Soon...</h2>
      <p className='text-sm text-muted-foreground text-center max-w-sm'>
        The personalized job recommendations feature is currently under
        development. Soon you’ll be able to see job openings that match your
        career path and skills.
      </p>
    </div>
  );

  // -------------------
  //  Main Render
  // -------------------
  return (
    <div className='space-y-8'>
      <Card>
        <CardHeader>
          <CardTitle>Your Employment Pathway</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue='roadmap' onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value='roadmap'>Roadmap</TabsTrigger>
              <TabsTrigger value='skills'>Skills</TabsTrigger>
              <TabsTrigger value='jobs'>Jobs</TabsTrigger>
            </TabsList>

            <TabsContent value='roadmap'>{renderRoadmap()}</TabsContent>
            <TabsContent value='skills'>
              <CareerSkills />
            </TabsContent>
            <TabsContent value='jobs'>{renderJobs()}</TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
