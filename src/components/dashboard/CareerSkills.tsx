import React, { useEffect, useState } from "react";
import {
  employmentPathService,
  SkillData,
  SkillsAnalysis,
} from "@/services/useEmploymentPath";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Loader2, CheckCircle, Lightbulb } from "lucide-react";
import { useEmploymentPathLogic } from "@/hooks/useEmploymentPathLogic";

export const CareerSkills: React.FC = () => {
  const { user } = useAuth();
  const { onboardingData } = useEmploymentPathLogic();
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<SkillsAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  // ✅ Helper to make sure anything printed is always a string
  const safeString = (value: any): string => {
    if (value == null) return "";
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean")
      return String(value);
    if (Array.isArray(value)) return value.join(", ");
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  };

  useEffect(() => {
    const loadSkills = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const onboarding = await employmentPathService.getOnboardingData(
          user.id
        );
        if (!onboarding?.dream_career) {
          console.warn("No dream career found for user");
          setLoading(false);
          return;
        }

        const loadedSkills = await employmentPathService.loadCareerSkills(
          onboarding.dream_career
        );
        const cleanSkills = loadedSkills.map((s, i) => ({
          id: safeString(s.id || `skill-${i}`),
          name: safeString(s.name),
          category: safeString(s.category),
          importance: safeString(s.importance),
        }));

        setSkills(cleanSkills);
      } catch (err) {
        console.error("Error loading skills:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSkills();
  }, [user]);

  const toggleSkill = (id: string) => {
    setSelectedSkills((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const analyzeSkills = async () => {
    if (!user || selectedSkills.length === 0) return;
    setAnalyzing(true);
    try {
      const result = await employmentPathService.getCareerSkillAnalysis(
        user.id,
        selectedSkills
      );
      // Sanitize analysis data too (AI can return nested objects)
      const safeAnalysis: SkillsAnalysis = {
        skillsToLearn: result.skillsToLearn.map((s) => ({
          name: safeString(s.name),
          category: safeString(s.category),
          importance: safeString(s.importance),
          reason: safeString(s.reason),
        })),
        learningPath: result.learningPath.map((s) => ({
          step: s.step,
          skill: safeString(s.skill),
          duration: safeString(s.duration),
          priority: safeString(s.priority),
          description: safeString(s.description),
        })),
      };
      setAnalysis(safeAnalysis);
    } catch (err) {
      console.error("Error analyzing skills:", err);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center py-16'>
        <Loader2 className='animate-spin mr-2' /> Loading skills...
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Skills Selection */}
      <Card className='border border-border/60 shadow-sm'>
        <CardHeader>
          <CardTitle className='text-xl font-semibold'>
            Select Your Current Skills
          </CardTitle>
        </CardHeader>
        <CardContent className='grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {skills.length > 0 ? (
            skills.map((skill) => (
              <div
                key={skill.id}
                className={`flex items-center space-x-2 rounded-lg border p-2 cursor-pointer transition ${
                  selectedSkills.includes(skill.id)
                    ? "bg-primary/10 border-primary"
                    : "hover:bg-muted/40"
                }`}
                onClick={() => toggleSkill(skill.id)}>
                <Checkbox
                  checked={selectedSkills.includes(skill.id)}
                  onCheckedChange={() => toggleSkill(skill.id)}
                />
                <div className='flex flex-col'>
                  <span className='font-medium'>{safeString(skill.name)}</span>
                  <Badge variant='outline' className='text-xs capitalize w-fit'>
                    {safeString(skill.category)}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <p className='col-span-full text-muted-foreground text-sm'>
              No skills available for your selected career.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Analyze Button */}
      <div className='flex justify-end'>
        <Button
          onClick={analyzeSkills}
          disabled={analyzing || selectedSkills.length === 0}>
          {analyzing ? (
            <>
              <Loader2 className='mr-2 animate-spin' /> Analyzing...
            </>
          ) : (
            "Analyze My Skills"
          )}
        </Button>
      </div>

      {/* AI Analysis Results */}
      {analysis && (
        <>
          <Separator className='my-6' />
          <div className='space-y-8'>
            {/* Skills to Learn */}
            <div>
              <h2 className='text-lg font-semibold flex items-center mb-3'>
                <Lightbulb className='mr-2 text-yellow-500' /> Skills You Should
                Learn
              </h2>
              <div className='grid gap-3 sm:grid-cols-2 md:grid-cols-3'>
                {analysis.skillsToLearn.map((s, i) => (
                  <Card key={i} className='p-3'>
                    <div className='font-medium'>{safeString(s.name)}</div>
                    <Badge
                      variant='outline'
                      className='capitalize my-1 text-xs w-fit'>
                      {safeString(s.category)}
                    </Badge>
                    <p className='text-sm text-muted-foreground mt-1'>
                      {safeString(s.reason)}
                    </p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Learning Path */}
            <div>
              <h2 className='text-lg font-semibold flex items-center mb-3'>
                <CheckCircle className='mr-2 text-green-500' /> Your Learning
                Path
              </h2>
              <div className='space-y-4'>
                {analysis.learningPath.map((step, i) => (
                  <Card key={i} className='p-4'>
                    <div className='flex justify-between items-center'>
                      <h3 className='font-semibold'>
                        Step {step.step}: {safeString(step.skill)}
                      </h3>
                      <Badge
                        variant='outline'
                        className={`capitalize ${
                          step.priority === "high"
                            ? "border-red-500 text-red-500"
                            : step.priority === "medium"
                            ? "border-yellow-500 text-yellow-500"
                            : "border-green-500 text-green-500"
                        }`}>
                        {safeString(step.priority)}
                      </Badge>
                    </div>
                    <p className='text-sm text-muted-foreground mt-1'>
                      Duration: {safeString(step.duration)}
                    </p>
                    <p className='text-sm mt-2'>
                      {safeString(step.description)}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
