import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Calendar,
  BookOpen,
  Loader2,
} from 'lucide-react';
import { academicSupportService, AcademicProfile } from '@/services/academicSupportService';
import AcademicOnboarding from './academic/AcademicOnboarding';
import AcademicDashboardTab from './academic/AcademicDashboardTab';
import StudyGroupsTab from './academic/StudyGroupsTab';
import AssignmentsQuizzesTab from './academic/AssignmentsQuizzesTab';
import StudyScheduleTab from './academic/StudyScheduleTab';
import OnlineModulesTab from './academic/OnlineModulesTab';

interface Props {
  onNavigateToModules?: () => void;
}

export const AcademicSupport = ({ onNavigateToModules }: Props) => {
  const [profile, setProfile] = useState<AcademicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    checkProfile();
  }, []);

  const checkProfile = async () => {
    try {
      const data = await academicSupportService.getProfile();
      if (data) {
        setProfile(data);
        setNeedsOnboarding(false);
      } else {
        setNeedsOnboarding(true);
      }
    } catch (error) {
      console.error('Failed to load academic profile:', error);
      setNeedsOnboarding(true);
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingComplete = async () => {
    setLoading(true);
    await checkProfile();
  };

  const handleNavigate = (tab: string) => {
    if (tab === 'modules' && onNavigateToModules) {
      onNavigateToModules();
      return;
    }
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-primary" />
          <p className="text-sm text-muted-foreground">Loading academic support...</p>
        </div>
      </div>
    );
  }

  if (needsOnboarding) {
    return <AcademicOnboarding onComplete={handleOnboardingComplete} />;
  }

  if (!profile) return null;

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b">
          <TabsList className="h-auto p-0 bg-transparent gap-0">
            <TabsTrigger
              value="dashboard"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="groups"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3">
              <Users className="h-4 w-4 mr-2" />
              Study Groups
            </TabsTrigger>
            <TabsTrigger
              value="assignments"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3">
              <ClipboardList className="h-4 w-4 mr-2" />
              Assignments & Quizzes
            </TabsTrigger>
            <TabsTrigger
              value="schedule"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </TabsTrigger>
            <TabsTrigger
              value="modules"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3">
              <BookOpen className="h-4 w-4 mr-2" />
              Online Modules
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard" className="mt-4">
          <AcademicDashboardTab profile={profile} onNavigate={handleNavigate} />
        </TabsContent>

        <TabsContent value="groups" className="mt-4">
          <StudyGroupsTab profile={profile} />
        </TabsContent>

        <TabsContent value="assignments" className="mt-4">
          <AssignmentsQuizzesTab profile={profile} />
        </TabsContent>

        <TabsContent value="schedule" className="mt-4">
          <StudyScheduleTab profile={profile} />
        </TabsContent>

        <TabsContent value="modules" className="mt-4">
          <OnlineModulesTab onNavigateToModules={onNavigateToModules || (() => {})} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
