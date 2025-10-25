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
