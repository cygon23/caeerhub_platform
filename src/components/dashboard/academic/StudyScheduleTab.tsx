import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  Loader2,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import {
  academicSupportService,
  StudySchedule,
  AcademicProfile,
} from '@/services/academicSupportService';
import { useToast } from '@/hooks/use-toast';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 15 }, (_, i) => i + 6); // 6 AM to 8 PM

interface Props {
  profile: AcademicProfile;
}

export default function StudyScheduleTab({ profile }: Props) {
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<StudySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const data = await academicSupportService.getSchedules();
      setSchedules(data);
    } catch (error) {
      console.error('Failed to load schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const regenerateSchedule = async () => {
    setGenerating(true);
    try {
      const result = await academicSupportService.generateAcademicPlan(profile, 'schedule');
      if (result.success) {
        toast({ title: 'Schedule Regenerated', description: 'Your AI study schedule has been updated!' });
        await loadSchedules();
      } else {
        toast({ title: 'Error', description: result.error || 'Failed to generate schedule', variant: 'destructive' });
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setGenerating(false);
    }
  };

  // Get schedules for a specific day and check if they overlap with an hour
  const getSchedulesForDayHour = (day: number, hour: number) => {
    return schedules.filter(s => {
      if (s.day_of_week !== day) return false;
      const startHour = parseInt(s.start_time.split(':')[0]);
      const endHour = parseInt(s.end_time.split(':')[0]);
      return hour >= startHour && hour < endHour;
    });
  };

  const isStartHour = (s: StudySchedule, hour: number) => {
    return parseInt(s.start_time.split(':')[0]) === hour;
  };

  const getBlockHeight = (s: StudySchedule) => {
    const startHour = parseInt(s.start_time.split(':')[0]);
    const endHour = parseInt(s.end_time.split(':')[0]);
    return endHour - startHour;
  };

  // Count sessions per day for summary
  const sessionsPerDay = DAYS.map((_, i) => schedules.filter(s => s.day_of_week === i).length);
  const totalHours = schedules.reduce((acc, s) => {
    const start = parseInt(s.start_time.split(':')[0]);
    const end = parseInt(s.end_time.split(':')[0]);
    return acc + (end - start);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            AI Study Schedule
            <Badge variant="secondary" className="text-[10px]">
              <Sparkles className="h-3 w-3 mr-1" />AI Generated
            </Badge>
          </h3>
          <p className="text-sm text-muted-foreground">
            {schedules.length > 0
              ? `${schedules.length} sessions, ${totalHours} hours/week`
              : 'Your personalized weekly study schedule'}
          </p>
        </div>
        <Button
          size="sm"
          onClick={regenerateSchedule}
          disabled={generating}>
          {generating ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating...</>
          ) : (
            <><RefreshCw className="h-4 w-4 mr-2" />Regenerate Schedule</>
          )}
        </Button>
      </div>

      {/* Generating state */}
      {generating && schedules.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Loader2 className="h-10 w-10 mx-auto mb-4 text-primary animate-spin" />
            <h3 className="font-semibold mb-2">Creating Your Optimal Schedule</h3>
            <p className="text-sm text-muted-foreground">AI is building a balanced weekly study plan based on your subjects and level...</p>
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {schedules.length === 0 && !generating && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-semibold mb-2">No Schedule Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Let AI create an optimal study schedule based on your subjects.</p>
            <Button onClick={regenerateSchedule}>
              <Sparkles className="h-4 w-4 mr-2" />Generate AI Schedule
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Weekly Calendar Grid */}
      {schedules.length > 0 && (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <div className="min-w-[700px]">
              {/* Day headers */}
              <div className="grid grid-cols-8 border-b">
                <div className="p-3 text-xs font-medium text-muted-foreground border-r">Time</div>
                {DAYS.map((day, i) => {
                  const isToday = new Date().getDay() === i;
                  return (
                    <div key={day} className={`p-3 text-center text-xs font-medium border-r last:border-r-0 ${isToday ? 'bg-primary/5 text-primary' : 'text-muted-foreground'}`}>
                      <span className="hidden sm:inline">{day}</span>
                      <span className="sm:hidden">{DAY_SHORT[i]}</span>
                      {isToday && <div className="w-1.5 h-1.5 rounded-full bg-primary mx-auto mt-1" />}
                      {sessionsPerDay[i] > 0 && (
                        <p className="text-[10px] opacity-60 mt-0.5">{sessionsPerDay[i]} sessions</p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Time rows */}
              {HOURS.map(hour => (
                <div key={hour} className="grid grid-cols-8 border-b last:border-b-0 min-h-[48px]">
                  <div className="p-2 text-xs text-muted-foreground border-r flex items-start justify-end pr-3">
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                  {DAYS.map((_, dayIndex) => {
                    const daySchedules = getSchedulesForDayHour(dayIndex, hour);
                    const isToday = new Date().getDay() === dayIndex;

                    return (
                      <div key={dayIndex} className={`border-r last:border-r-0 relative ${isToday ? 'bg-primary/5' : ''}`}>
                        {daySchedules.map(s => {
                          if (!isStartHour(s, hour)) return null;
                          const height = getBlockHeight(s);
                          return (
                            <div
                              key={s.id}
                              className="absolute inset-x-0.5 rounded-md px-1.5 py-1 text-xs text-white overflow-hidden z-10"
                              style={{
                                backgroundColor: s.color || '#6366f1',
                                height: `${height * 48 - 2}px`,
                                top: '1px',
                              }}>
                              <p className="font-medium truncate">{s.subject}</p>
                              <p className="text-[10px] opacity-80">
                                {s.start_time.slice(0, 5)} - {s.end_time.slice(0, 5)}
                              </p>
                              {s.title && <p className="text-[10px] opacity-80 truncate">{s.title}</p>}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schedule List */}
      {schedules.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">All Sessions ({schedules.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {schedules.map(s => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 rounded-full" style={{ backgroundColor: s.color || '#6366f1' }} />
                  <div>
                    <p className="font-medium text-sm">{s.subject}{s.title ? ` - ${s.title}` : ''}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {DAYS[s.day_of_week]} {s.start_time.slice(0, 5)} - {s.end_time.slice(0, 5)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
