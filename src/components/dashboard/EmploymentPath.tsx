import React, { useState } from "react";
import { useEmploymentPathLogic } from "@/hooks/useEmploymentPathLogic";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, ArrowRight } from "lucide-react";
import { CareerSkills } from "./CareerSkills";

export const EmploymentPath: React.FC = () => {
  const { roadmap, loading, error } = useEmploymentPathLogic();
  const [activeTab, setActiveTab] = useState("roadmap");

  const renderRoadmap = () => {
    if (loading)
      return (
        <div className='flex justify-center items-center py-16'>
          <RefreshCw className='animate-spin mr-2 h-6 w-6' />
          <span>Loading your career roadmap...</span>
        </div>
      );

    if (error)
      return (
        <Card>
          <CardContent className='py-12 text-center text-red-500'>
            {error}
          </CardContent>
        </Card>
      );

    if (!roadmap?.steps?.length)
      return (
        <Card>
          <CardContent className='py-12 text-center'>
            <p className='text-muted-foreground'>
              No roadmap available yet. Please check your onboarding
              information.
            </p>
          </CardContent>
        </Card>
      );

    return (
      <div className='space-y-6'>
        {roadmap.steps.map((step, i) => (
          <Card key={String(step.id || i)} className='border-l-4 border-l-primary'>
            <CardHeader>
              <div className='flex justify-between items-start'>
                <CardTitle className='text-lg'>{String(step.title || 'Career Phase')}</CardTitle>
                <Badge
                  variant={
                    step.priority === "high"
                      ? "destructive"
                      : step.priority === "medium"
                      ? "default"
                      : "secondary"
                  }>
                  {String(step.priority || 'medium')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p className='text-sm text-muted-foreground'>
                {String(step.description || '')}
              </p>
              <div className='flex items-center gap-4 text-sm'>
                <Badge variant='outline'>{String(step.level || "Beginner")}</Badge>
                <span className='text-muted-foreground'>
                  Duration: {String(step.duration || 'N/A')}
                </span>
                <Badge
                  variant={
                    step.status === "completed"
                      ? "default"
                      : step.status === "in-progress"
                      ? "secondary"
                      : "outline"
                  }>
                  {String(step.status || 'pending')}
                </Badge>
              </div>

              {step.resources?.length > 0 && (
                <div className='mt-4'>
                  <h4 className='text-sm font-semibold mb-2'>Resources:</h4>
                  <div className='space-y-2'>
                    {step.resources.map((resource, idx) => (
                      <a
                        key={idx}
                        href={String(resource.url || '#')}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center text-sm text-primary hover:underline'>
                        <ArrowRight className='h-3 w-3 mr-1' />
                        {String(resource.name || 'Resource')}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderJobs = () => (
    <div className='flex flex-col items-center justify-center min-h-[300px]'>
      <h2 className='text-lg font-semibold mb-2'>Coming Soon...</h2>
      <p className='text-sm text-muted-foreground text-center max-w-sm'>
        Personalized job recommendations will be available soon.
      </p>
    </div>
  );

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
