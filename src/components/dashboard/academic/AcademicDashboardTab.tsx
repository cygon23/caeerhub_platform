import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Users,
  ClipboardList,
  Calendar,
  Sparkles,
  ArrowRight,
  Clock,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Lightbulb,
  Target,
} from 'lucide-react';
import {
  academicSupportService,
  AcademicProfile,
  AcademicAssignment,
  StudyGroup,
  StudySchedule,
} from '@/services/academicSupportService';
import { useToast } from '@/hooks/use-toast';

interface Props {
  profile: AcademicProfile;
  onNavigate: (tab: string) => void;
}

export default function AcademicDashboardTab({ profile, onNavigate }: Props) {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<AcademicAssignment[]>([]);
  const [myGroups, setMyGroups] = useState<StudyGroup[]>([]);
  const [schedules, setSchedules] = useState<StudySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [studyFocus, setStudyFocus] = useState<{
    summary: string;
    weekly_tips: string[];
    priority_subject: string;
  } | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [assignData, groupData, schedData, focusData, hasContent] = await Promise.all([
        academicSupportService.getAssignments({ status: 'pending' }),
        academicSupportService.getMyGroups(),
        academicSupportService.getSchedules(),
        academicSupportService.getStudyFocus(profile),
        academicSupportService.hasAIContent(),
      ]);
      setAssignments(assignData.slice(0, 5));
      setMyGroups(groupData.slice(0, 3));
      setSchedules(schedData);
      setStudyFocus(focusData);

      // Auto-generate AI plan on first load if no content exists
      if (!hasContent && !focusData) {
        await generatePlan();
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePlan = async () => {
    setGenerating(true);
    try {
      const result = await academicSupportService.generateAcademicPlan(profile, 'full');
      if (result.success) {
        toast({ title: 'Plan Generated', description: 'Your personalized study plan is ready!' });
        // Reload fresh data from DB
        const [assignData, schedData] = await Promise.all([
          academicSupportService.getAssignments({ status: 'pending' }),
          academicSupportService.getSchedules(),
        ]);
        setAssignments(assignData.slice(0, 5));
        setSchedules(schedData);
        if (result.plan?.study_focus) {
          setStudyFocus(result.plan.study_focus);
        }
      } else {
        toast({ title: 'Error', description: result.error || 'Failed to generate plan', variant: 'destructive' });
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to generate plan', variant: 'destructive' });
    } finally {
      setGenerating(false);
    }
  };

  const getDayName = (day: number) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day];
  const todaySchedules = schedules.filter(s => s.day_of_week === new Date().getDay());

  const upcomingAssignments = assignments
    .filter(a => new Date(a.due_date) >= new Date())
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());

  const overdueAssignments = assignments.filter(a => new Date(a.due_date) < new Date());

  const priorityColor = (p: string) => {
    switch (p) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      default: return 'secondary';
    }
  };

  // Full-screen generating state
  if (generating && !studyFocus && assignments.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center max-w-md">
          <div className="relative mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">Generating Your Personalized Study Plan</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Our AI is analyzing your profile to create tailored assignments, quizzes, and a study schedule just for you.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-primary">
            <Loader2 className="h-4 w-4 animate-spin" />
            This may take a few seconds...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Study Focus Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/20 flex-shrink-0">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold">Your AI Study Focus</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={generatePlan}
                  disabled={generating}
                  className="h-7 text-xs">
                  {generating ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <RefreshCw className="h-3 w-3 mr-1" />}
                  {generating ? 'Generating...' : 'Refresh Plan'}
                </Button>
              </div>
              {studyFocus ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">{studyFocus.summary}</p>
                  {studyFocus.priority_subject && (
                    <div className="flex items-start gap-2 p-2 rounded-lg bg-background/60">
                      <Target className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm"><span className="font-medium">Priority:</span> {studyFocus.priority_subject}</p>
                    </div>
                  )}
                  {studyFocus.weekly_tips && studyFocus.weekly_tips.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Weekly Tips</p>
                      {studyFocus.weekly_tips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Lightbulb className="h-3.5 w-3.5 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-muted-foreground">{tip}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Based on your profile, you're studying at the{' '}
                  <span className="font-medium text-foreground">
                    {profile.education_level.replace(/_/g, ' ')}
                  </span>{' '}
                  level and need help with{' '}
                  <span className="font-medium text-foreground">
                    {profile.subjects_need_help.map(s => s.name).join(', ')}
                  </span>.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Study Groups', icon: Users, tab: 'groups', color: 'from-blue-500 to-cyan-500' },
          { label: 'Assignments', icon: ClipboardList, tab: 'assignments', color: 'from-purple-500 to-pink-500' },
          { label: 'Schedule', icon: Calendar, tab: 'schedule', color: 'from-green-500 to-emerald-500' },
          { label: 'Online Modules', icon: BookOpen, tab: 'modules', color: 'from-orange-500 to-red-500' },
        ].map(action => {
          const Icon = action.icon;
          return (
            <button
              key={action.tab}
              onClick={() => onNavigate(action.tab)}
              className="p-4 rounded-xl border bg-card hover:bg-accent transition-colors text-left">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${action.color} w-fit mb-2`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
              <p className="text-sm font-medium">{action.label}</p>
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* AI-Generated Assignments */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                AI-Generated Assignments
                <Badge variant="secondary" className="text-[10px]">AI</Badge>
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('assignments')}>
                View All <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {generating && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/10 text-primary text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating personalized assignments...
              </div>
            )}
            {overdueAssignments.length > 0 && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertTriangle className="h-4 w-4" />
                {overdueAssignments.length} overdue assignment{overdueAssignments.length > 1 ? 's' : ''}
              </div>
            )}
            {upcomingAssignments.length === 0 && overdueAssignments.length === 0 && !generating ? (
              <div className="text-center py-6 text-muted-foreground text-sm">
                <ClipboardList className="h-8 w-8 mx-auto mb-2 opacity-50" />
                No assignments yet. Click "Refresh Plan" to generate AI assignments.
              </div>
            ) : (
              upcomingAssignments.map(a => (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{a.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{a.subject}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(a.due_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Badge variant={priorityColor(a.priority) as any} className="text-xs ml-2">
                    {a.priority}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Today's AI Schedule */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today's Schedule
                <Badge variant="secondary" className="text-[10px]">AI</Badge>
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('schedule')}>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {todaySchedules.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-sm">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                No study sessions today.
              </div>
            ) : (
              todaySchedules.map(s => (
                <div key={s.id} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div
                    className="w-1 h-10 rounded-full"
                    style={{ backgroundColor: s.color || '#6366f1' }}
                  />
                  <div>
                    <p className="font-medium text-sm">{s.subject}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.start_time.slice(0, 5)} - {s.end_time.slice(0, 5)}
                    </p>
                    {s.title && <p className="text-xs text-muted-foreground">{s.title}</p>}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* My Study Groups */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-5 w-5" />
              My Study Groups
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('groups')}>
              Browse Groups <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {myGroups.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground text-sm">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              You haven't joined any groups yet.
              <Button variant="link" size="sm" onClick={() => onNavigate('groups')}>Find a group</Button>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-3">
              {myGroups.map(g => (
                <div key={g.id} className="p-3 rounded-lg border hover:bg-accent transition-colors">
                  <p className="font-medium text-sm">{g.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">{g.member_count} members</span>
                    <Badge variant="secondary" className="text-xs">{g.subject}</Badge>
                  </div>
                  {g.schedule_day && g.schedule_time && (
                    <p className="text-xs text-primary mt-1 capitalize">
                      {g.schedule_day}s at {g.schedule_time}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subjects Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Your Subjects
          </CardTitle>
          <CardDescription>Subjects you're focusing on</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {profile.subjects_need_help.map(subject => (
              <div key={subject.name} className="p-3 rounded-lg border">
                <p className="font-medium text-sm">{subject.name}</p>
                {subject.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {subject.topics.map(topic => (
                      <Badge key={topic} variant="outline" className="text-xs">{topic}</Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
