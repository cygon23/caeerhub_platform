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
      console.log('📊 Onboarding data loaded:', {
        has_steps: !!onboarding.ai_roadmap_json?.steps,
        has_phases: !!onboarding.ai_roadmap_json?.phases,
        roadmap_structure: onboarding.ai_roadmap_json,
      });
      setOnboardingData(onboarding);

      if (onboarding.ai_roadmap_json?.steps) {
        // Ensure all steps have String values
        const safeSteps = onboarding.ai_roadmap_json.steps.map((step: any, index: number) => ({
          id: String(step.id || `step-${index + 1}`),
          title: String(step.title || 'Career Phase'),
          description: String(step.description || ''),
          duration: String(step.duration || 'N/A'),
          priority: String(step.priority || 'medium') as 'high' | 'medium' | 'low',
          status: String(step.status || 'pending') as 'completed' | 'in-progress' | 'pending',
          resources: Array.isArray(step.resources)
            ? step.resources.map((r: any) => ({
                name: String(r.name || r || 'Resource'),
                url: String(r.url || '#')
              }))
            : [],
          level: String(step.level || 'Beginner')
        }));
        console.log('✅ Roadmap set from steps:', { count: safeSteps.length, steps: safeSteps });
        setRoadmap({ steps: safeSteps });
      } else if (onboarding.ai_roadmap_json?.phases && Array.isArray(onboarding.ai_roadmap_json.phases)) {
        // Transform phases from onboarding to steps format
        const transformedSteps = onboarding.ai_roadmap_json.phases.map((phase: any, index: number) => {
          // Safely convert milestones to description
          let description = '';
          if (Array.isArray(phase.milestones)) {
            description = phase.milestones.map((m: any) => String(m || '')).filter(Boolean).join('. ');
          } else if (phase.milestones) {
            description = String(phase.milestones);
          }

          // Safely convert resources
          let resources: Array<{name: string; url: string}> = [];
          if (Array.isArray(phase.resources)) {
            resources = phase.resources.map((r: any) => ({
              name: String(r || 'Resource'),
              url: '#'
            }));
          }

          return {
            id: `step-${index + 1}`,
            title: String(phase.title || 'Career Phase'),
            description: description || 'No description available',
            duration: String(phase.timeline || 'N/A'),
            priority: (index < 2 ? 'high' : index < 4 ? 'medium' : 'low') as 'high' | 'medium' | 'low',
            status: (index === 0 ? 'in-progress' : 'pending') as 'completed' | 'in-progress' | 'pending',
            resources: resources,
            level: index === 0 ? 'Beginner' : index === 1 ? 'Intermediate' : index === 2 ? 'Advanced' : 'Professional'
          };
        });
        console.log('✅ Roadmap set from phases:', { count: transformedSteps.length, steps: transformedSteps });
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
