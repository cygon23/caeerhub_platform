import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { employmentPathService } from "@/services/useEmploymentPath";
import type { OnboardingData, CareerStep } from "@/services/useEmploymentPath";

export function useEmploymentPathLogic() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(
    null
  );
  const [roadmap, setRoadmap] = useState<{ steps: CareerStep[] } | null>(null);

  const loadEmploymentData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const onboarding = await employmentPathService.getOnboardingData(user.id);
      setOnboardingData(onboarding);

      if (onboarding.ai_roadmap_json?.steps) {
        setRoadmap(onboarding.ai_roadmap_json);
      } else if (onboarding.ai_roadmap_json?.phases) {
        // Transform phases from onboarding to steps format
        const transformedSteps = onboarding.ai_roadmap_json.phases.map((phase: any, index: number) => ({
          id: `step-${index + 1}`,
          title: String(phase.title || 'Career Phase'),
          description: Array.isArray(phase.milestones)
            ? phase.milestones.map((m: any) => String(m)).join('. ')
            : String(phase.milestones || ''),
          duration: String(phase.timeline || 'N/A'),
          priority: index < 2 ? 'high' : index < 4 ? 'medium' : 'low',
          status: index === 0 ? 'in-progress' : 'pending',
          resources: Array.isArray(phase.resources)
            ? phase.resources.map((r: any, idx: number) => ({
                name: String(r),
                url: '#'
              }))
            : [],
          level: index === 0 ? 'Beginner' : index === 1 ? 'Intermediate' : index === 2 ? 'Advanced' : 'Professional'
        }));
        setRoadmap({ steps: transformedSteps });
      } else {
        const roadmapSteps = await employmentPathService.generateRoadmap(
          onboarding
        );
        await employmentPathService.saveRoadmap(user.id, roadmapSteps);
        setRoadmap({ steps: roadmapSteps });
      }
    } catch (err: any) {
      console.error("Error loading employment path:", err);
      setError(err.message || "Failed to load employment data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmploymentData();
  }, [user]);

  return {
    user,
    onboardingData,
    roadmap,
    loading,
    error,
    reload: loadEmploymentData,
  };
}
