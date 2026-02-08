import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Calendar,
  Plus,
  Trash2,
  Clock,
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

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: '#6366f1',
  English: '#06b6d4',
  Physics: '#f59e0b',
  Chemistry: '#10b981',
  Biology: '#ef4444',
  Geography: '#8b5cf6',
  History: '#f97316',
  Kiswahili: '#ec4899',
  ICT: '#3b82f6',
};

function getColor(subject: string): string {
  return SUBJECT_COLORS[subject] || '#6366f1';
}

interface Props {
  profile: AcademicProfile;
}

export default function StudyScheduleTab({ profile }: Props) {
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<StudySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const [newSchedule, setNewSchedule] = useState({
    subject: '', title: '', day_of_week: 1, start_time: '09:00', end_time: '10:00', color: '',
  });

  const subjects = profile.subjects_need_help.map(s => s.name);

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

  const handleCreate = async () => {
    if (!newSchedule.subject || !newSchedule.start_time || !newSchedule.end_time) {
      toast({ title: 'Error', description: 'Subject and times are required', variant: 'destructive' });
      return;
    }
    try {
      await academicSupportService.createSchedule({
        ...newSchedule,
        color: newSchedule.color || getColor(newSchedule.subject),
      });
      toast({ title: 'Added', description: 'Study session added to schedule' });
      setShowCreate(false);
      setNewSchedule({ subject: '', title: '', day_of_week: 1, start_time: '09:00', end_time: '10:00', color: '' });
      await loadSchedules();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await academicSupportService.deleteSchedule(id);
      await loadSchedules();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
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

  // Check if this is the start hour of a schedule block
  const isStartHour = (s: StudySchedule, hour: number) => {
    return parseInt(s.start_time.split(':')[0]) === hour;
  };

  const getBlockHeight = (s: StudySchedule) => {
    const startHour = parseInt(s.start_time.split(':')[0]);
    const endHour = parseInt(s.end_time.split(':')[0]);
    return endHour - startHour;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Study Schedule
          </h3>
          <p className="text-sm text-muted-foreground">Plan your weekly study sessions</p>
        </div>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-2" />Add Session</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Study Session</DialogTitle>
              <DialogDescription>Schedule a recurring study block</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              <div>
                <label className="text-sm font-medium">Subject</label>
                <select
                  value={newSchedule.subject}
                  onChange={e => setNewSchedule(p => ({ ...p, subject: e.target.value, color: getColor(e.target.value) }))}
                  className="w-full px-3 py-2 border rounded-md bg-background text-sm">
                  <option value="">Select subject</option>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Label (optional)</label>
                <Input
                  value={newSchedule.title}
                  onChange={e => setNewSchedule(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Chapter 5 revision"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Day</label>
                <select
                  value={newSchedule.day_of_week}
                  onChange={e => setNewSchedule(p => ({ ...p, day_of_week: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border rounded-md bg-background text-sm">
                  {DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Start Time</label>
                  <Input type="time" value={newSchedule.start_time} onChange={e => setNewSchedule(p => ({ ...p, start_time: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium">End Time</label>
                  <Input type="time" value={newSchedule.end_time} onChange={e => setNewSchedule(p => ({ ...p, end_time: e.target.value }))} />
                </div>
              </div>
              <Button onClick={handleCreate} className="w-full">Add to Schedule</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Weekly Calendar Grid */}
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
                            className="absolute inset-x-0.5 rounded-md px-1.5 py-1 text-xs text-white group cursor-pointer overflow-hidden z-10"
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
                            <button
                              onClick={() => handleDelete(s.id)}
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded bg-black/20 hover:bg-black/40">
                              <Trash2 className="h-3 w-3" />
                            </button>
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

      {/* Schedule List (compact view) */}
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
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(s.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
